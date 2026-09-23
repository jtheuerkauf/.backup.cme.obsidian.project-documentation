# Codex handoff: Dynamic Alert registry and collection framework

## Purpose

Implement the registry and data-collection foundation for Epic 10 MS 0.2 / work item
664. The goal is to migrate legacy alerts into one reusable execution process without
allowing database configuration to select arbitrary executable code.

This document defines the intended architecture. Inspect the existing NewRivers codebase
before choosing exact namespaces, model names, migrations, and existing email/queue
integration points. Preserve the existing Week 1 DTS Over $20K behavior while moving it
onto these shared contracts.

## Decisions to preserve

1. **AlertType is code-owned.** It is an approved capability with a stable string key,
   collector, message builder, configuration schema, and definition version.
2. **Alert configuration is database-owned.** An `Alert` row selects one AlertType by
   key and stores validated per-instance settings, recipient policy, and enabled state.
   Multiple configurations may select the same AlertType.
3. **Scheduling is independent of AlertType.** An `AlertSchedule` belongs to an Alert
   configuration, not to the code-defined type. Different configurations of the same
   type may use different schedules.
4. **Start with at most one active schedule per Alert configuration.** Model schedules
   in their own table so multiple schedules can be supported later without a schema
   redesign, but do not expose or depend on multiple active schedules now.
5. **Every claimed scheduled occurrence creates an AlertRun.** Runs are the durable
   history for queued, running, empty, partial, failed, and successful execution.
6. **Collectors collect; they do not send.** A collector must not create email intents,
   resolve recipients, dispatch mail, or write run lifecycle state.
7. **The shared runner owns orchestration.** It creates and transitions runs, invokes
   the collector, resolves recipients, creates the email intent, dispatches the
   generic alert Mailable, and records the final outcome.
8. **Never persist class names or executable expressions in alert configuration.**
   Database values select a known AlertType key from the code catalog.

## Conceptual model

```
Code catalog
  AlertType "dts.over_20k"
    ├── DtsOver20KCollector
    ├── DtsOver20KMessageFactory
    └── DtsOver20KConfig schema

Database
  Alert configuration "DTS > $20K - Operations"
    ├── type_key = "dts.over_20k"
    ├── configuration = { ... }
    ├── recipient policy = { ... }
    └── AlertSchedule "weekdays at 08:00"
          └── AlertRun for each claimed occurrence
```

Use these terms consistently:

| Term | Meaning | Ownership |
| --- | --- | --- |
| AlertType | Code-defined capability with stable key and approved implementation classes. | Code/catalog |
| Alert | Persisted configuration instance of one AlertType. | Database |
| AlertSchedule | Persisted execution policy for an Alert. | Database |
| AlertRun | One attempted execution of an Alert for a scheduled occurrence. | Database |
| AlertCollector | AlertType component that fetches and enriches source data. | Code |
| AlertMessageFactory | AlertType component that turns collection output into alert content/template data. | Code |
| AlertRegistry | Runtime service that resolves an Alert's type key to its code-defined AlertType. | Code |

## Data model

Use the existing project conventions for IDs, timestamps, soft deletes, enums, JSON
casts, and model naming. The fields below are the required semantic shape.

### alerts

```
id
type_key                  // stable code catalog key, e.g. dts.over_20k
name                      // human-readable configuration name
configuration             // validated JSON settings for this AlertType
recipient_policy          // validated Role-based recipient configuration
enabled_at                // nullable; null means not enabled
disabled_at               // nullable
definition_version        // code/config contract version applied to this configuration
created_at
updated_at
```

An Alert is not a record of an individual execution. It may have zero or more schedules
and zero or more runs.

### alert_schedules

```
id
alert_id
trigger_kind              // initially scheduled/polling; leave room for event later
schedule_definition       // approved interval/cron-like representation
timezone
enabled_at                // nullable
disabled_at               // nullable
next_run_at
created_at
updated_at
```

Required indexes/constraints:

- index due-schedule lookup on enabled state and `next_run_at`;
- foreign key to `alerts`;
- enforce the initial one-active-schedule policy at the application/service layer or
  with a database constraint appropriate to the chosen database;
- do not attach a schedule directly to an AlertType.

### alert_runs

```
id
alert_id
alert_schedule_id
scheduled_for             // occurrence that caused this run
started_at
completed_at
status                    // queued, running, empty, partial, failed, succeeded
idempotency_key
email_id                  // nullable; set when an email intent is created
context                   // bounded diagnostic/result metadata
error_summary             // nullable, safe-to-store summary
created_at
updated_at
```

Required indexes/constraints:

- foreign keys to `alerts` and `alert_schedules`;
- unique `(alert_schedule_id, scheduled_for)` or an equivalent idempotency key that
  prevents two runs for the same claimed schedule occurrence;
- index `(alert_id, scheduled_for)` for run history;
- index `(status, started_at)` if operational recovery queries need it.

Do not put source records, full email content, or arbitrary exception payloads in run
context. Persist only bounded identifiers, counts, outcome details, and safe diagnostic
metadata.

## Code catalog and runtime registry

Prefer a small explicit catalog, for example `config/alerts.php`, loaded into an
`AlertCatalog`/registry service. A service-provider registration is also acceptable if
it remains explicit, reviewable, and testable.

Illustrative shape:

```php
return [
    'dts.over_20k' => new AlertTypeDefinition(
        collector: DtsOver20KCollector::class,
        messageFactory: DtsOver20KMessageFactory::class,
        configuration: DtsOver20KConfig::class,
        definitionVersion: 1,
    ),
];
```

The registry must:

- expose the list of supported type keys;
- resolve a known key to its definition and instantiate dependencies through the
  Laravel container;
- reject an unknown or disabled-by-code key with a clear domain exception;
- validate a persisted Alert configuration against the selected definition before a run;
- be testable without booting the scheduler.

The registry must not query every database alert during application boot. It resolves an
Alert only when the dispatcher/runner needs it.

## Collector and message contracts

Keep data collection separate from message construction and delivery.

Illustrative contracts:

```php
interface AlertCollector
{
    public function collect(
        AlertConfiguration $alert,
        AlertRunContext $context,
    ): AlertCollectionResult;
}

interface AlertMessageFactory
{
    public function build(
        AlertConfiguration $alert,
        AlertCollectionResult $result,
    ): AlertMessage;
}
```

`AlertCollectionResult` must represent the outcome clearly:

- `records` or typed result items;
- source identifiers needed for traceability and deduplication;
- aggregate counts/summary data;
- zero-result output;
- bounded partial-error details; and
- a failure result or a domain exception for unrecoverable collection failure.

An AlertCollector may query synchronized tables and perform alert-specific enrichment.
It must not:

- resolve recipients;
- construct or dispatch a Laravel Mailable;
- create or update an Email intent;
- write AlertRun status directly;
- decide general retry, schedule, or duplicate policy.

The message factory owns alert-specific subject, view/template selection, and documented
view-data shape. It returns an `AlertMessage` value; the runner supplies it to the
existing generic alert Mailable/delivery path.

## Dispatcher and runner flow

### Due-schedule dispatcher

Configure the Laravel application scheduler to invoke one generic command frequently,
for example:

```
alerts:dispatch-due
```

The command must:

1. Query enabled schedules whose `next_run_at` is due.
2. Atomically claim each occurrence so concurrent command invocations cannot claim the
   same schedule occurrence.
3. Create the AlertRun for the claimed `scheduled_for` occurrence.
4. Advance `next_run_at` according to the schedule policy.
5. Queue a job containing the AlertRun ID, or the alert/schedule/occurrence identifiers
   needed to retrieve it safely.

Use database transactions and locking/conditional updates appropriate to the project's
database. A scheduler poll, retry, or worker restart must not create a second run for
the same occurrence.

### Alert runner job

The queued runner must:

1. Re-read the Alert and AlertSchedule and verify both are still enabled.
2. Mark the run as running.
3. Resolve the AlertType through the AlertRegistry.
4. Validate the Alert configuration using that type's schema.
5. Invoke the collector.
6. Record an empty, partial, or failed collection outcome as applicable.
7. Resolve recipients through the shared Role-based recipient resolver.
8. If delivery is appropriate, create the email intent and build/dispatch the generic
   alert Mailable using the message factory's output.
9. Persist the email reference and complete the run with the final status.
10. Record safe errors and allow only the approved retry behavior.

The runner, not an AlertType, owns the common lifecycle and transport handoff.

## Adding a new legacy alert type

For each migrated legacy alert:

1. Identify its source query, enrichment, message content, recipient inputs, legacy
   tracking requirements, and existing duplicate rules.
2. Create one AlertCollector implementation.
3. Create one AlertMessageFactory implementation.
4. Create a validated configuration DTO/schema with defaults and documented fields.
5. Add a stable, namespaced type key to the code catalog. Do not reuse or rename keys
   casually after they appear in persisted configuration.
6. Add focused collector/message tests and runner integration tests.
7. Create a disabled Alert configuration through a migration, seeder, or explicit
   install command where an initial configured instance is needed.
8. Verify expected results against the legacy implementation before enabling the
   scheduled configuration.

A useful operator/developer command may be:

```
alerts:sync-definitions
```

It may validate configured type keys, report configuration-version gaps, and install
missing disabled defaults. It must not overwrite administrator-owned configuration or
silently enable new alert configurations.

## Editing existing alerts

Separate edits by ownership:

| Change | Mechanism |
| --- | --- |
| Threshold, source filter, recipient policy, enabled state, or schedule | Validated database configuration update. |
| Collector query, enrichment algorithm, message construction, or duplicate semantics | Code change and deployment. |
| Configuration schema interpretation | Code migration/transform with definition-version handling. |
| New supported alert capability | New code catalog entry plus a configured Alert instance when needed. |

Do not provide generic free-form SQL, PHP, class names, or expressions in an
administrator-facing configuration form.

## Status and failure behavior

Use a single run-status model. At minimum support:

- `queued`
- `running`
- `empty`
- `partial`
- `failed`
- `succeeded`

Define and test permitted transitions. In particular:

- zero source results are `empty`, not an unexplained success;
- a partial collection/delivery outcome is visible as `partial`;
- an unrecoverable collector failure is `failed`;
- disabled Alert or Schedule state is rechecked by the job before collection;
- duplicate occurrence claims do not create another run or another delivery.

## DTS Over $20K migration requirements

Use DTS Over $20K as the first registered AlertType.

- Preserve its synchronized-table data source.
- Preserve the expected result set and recipient behavior.
- Preserve required writes to `allrivers.alertTracking` and
  `allrivers.dimReporting`.
- Preserve the existing generic alert Mailable delivery path for this milestone.
- Compare legacy and NewRivers output in a controlled verification mode before
  switching the active schedule.

Do not fold the later MS 0.3 concrete-DTS-Mailable identity migration into this registry
implementation unless it is separately approved.

## Required tests and acceptance criteria

- A known catalog key resolves; an unknown key fails clearly.
- A configured Alert validates against the selected type schema.
- A due enabled schedule creates exactly one run for one occurrence despite concurrent
  dispatcher attempts.
- Disabled Alert or Schedule state prevents collection when rechecked by the job.
- Runner tests cover successful, empty, partial, and failed collection outcomes.
- Collector tests prove data collection/enrichment is isolated from recipients, email
  persistence, and delivery.
- Recipient resolution, intent creation, and generic Mailable dispatch occur through
  the shared path.
- DTS produces expected results and preserves required legacy/reporting writes.
- Commands, scheduler adapters, and queued jobs use the same runner rather than
  independently implementing execution logic.

## Decisions still required

- Exact database representation and allowed granularity of polling schedules.
- Exact recipient-policy shape and authoritative Role/Department data source.
- Idempotency-key composition for each alert type and delivery attempt.
- Retention policy and safe context/error fields for AlertRun.
- Whether schedule configuration starts with developer-managed records or an
  administrator-facing form; the latter belongs to the alert-administration follow-on.

