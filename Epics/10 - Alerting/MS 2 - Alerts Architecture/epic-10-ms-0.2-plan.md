# Epic 10, milestone 0.2: Alerts / Work Item 664

## Objective

Turn the Week 1 DTS Over $20K alert migration into the reusable alert framework
required by the PIP's Week 2 and Week 3 assignments and NewRivers work item 664.
Additional legacy alerts must be able to migrate to NewRivers without independently
recreating alert definitions, scheduling/execution, recipient resolution, email
persistence and delivery, run history, or legacy tracking.

This milestone assumes the Week 1 generic alert Mailable exists. Its focus is the
alert framework, not a general consolidation of all `App\Mail` classes.

## Required outcome

The completed framework is testable, reviewable, and satisfies the documented
requirements and acceptance criteria of work item 664. It supplies distinct,
cooperating components for the following concerns:

| Concern | Required capability |
| --- | --- |
| Alert definition | Persist alert configuration in `alerts` and make it available to the framework. |
| Scheduling and execution | Invoke registered alerts through the common scheduler/runner, jobs, and command execution. |
| Run history | Persist `alert_runs` and record each run's outcome. |
| Recipients | Resolve recipients by Role. |
| Email delivery | Create/persist the email intent and deliver through the generic alert Mailable, integrating delivery status. |
| Legacy integration | Preserve required legacy alert-tracking integration. |
| Resilience | Handle empty results, failures, and partial runs; prevent duplicates and preserve idempotency where required. |
| Alert data | Provide the source and enrichment handling required by a reusable alert implementation. |

## Delivery sequence

### Week 2 - Alert Service Foundation

1. Establish the application tables and model/service boundaries for alert
   definitions and run history.
2. Extract the Week 1 implementation into common services for alert definition,
   scheduling/execution, recipients, email persistence/delivery, run recording, and
   legacy tracking.
3. Define the runner's outcome model so successful, empty, failed, and partial runs
   are distinguishable and recordable.
4. Establish duplicate-prevention and idempotency rules at the relevant execution and
   email-intent boundaries.
5. Keep the generic alert Mailable as the delivery mechanism; the framework supplies
   alert-specific content, recipient, and intent data.
6. Add focused automated tests for the extracted services and the migrated Week 1
   alert to demonstrate equivalent expected alert results.

### Week 3 - Complete the alert framework

1. Complete `alerts` and `alert_runs` persistence, the alert registry, scheduler,
   runner, jobs, and command execution.
2. Complete Role-based recipient resolution, alert-run recording, source/enrichment
   handling, and legacy alert-tracking integration.
3. Complete generic alert Mailable integration, including email-intent creation and
   delivery-status integration.
4. Complete behavior for duplicate prevention, empty results, failures, and partial
   runs.
5. Deliver the automated tests required by work item 664 and verify the framework is
   complete, usable, and reviewable.

## Required design rules

- A legacy-alert migration provides its alert-specific source, enrichment, and
  content logic; it uses the common framework for the concerns above.
- The generic alert Mailable remains the persisted Mailable for alert delivery. A
  migration must not create an unrelated alert-mail path.
- An alert run and an email intent are related delivery records with distinct purposes:
  run history records alert execution; the email record tracks delivery status.
- Empty, failed, and partial executions must be visible in recorded run outcomes;
  they must not be represented as unexplained successful runs.
- Duplicate and retry behavior must be deterministic enough that re-running a job or
  command does not create duplicate alert delivery where idempotency is required.
- Preserve Week 1 DTS Over $20K behavior while moving it onto framework services,
  including required legacy tracking and reporting writes.

## Acceptance criteria

- `alerts` and `alert_runs` persist alert configuration and execution history.
- The registry and runner execute registered alerts through scheduler, job, and
  command entry points, without each migrated alert recreating scheduling.
- Role-based recipient resolution is shared rather than recreated in each alert.
- Each run records success, empty-result, failure, or partial-run behavior as
  applicable.
- The framework handles source and enrichment data, legacy alert tracking, duplicate
  prevention, and idempotency where required.
- Alert email uses the generic alert Mailable with email-intent creation and
  delivery-status integration.
- Required automated tests demonstrate the framework and the migrated Week 1 alert
  produce expected results.

## Preparation for milestone 0.3 - Mail

MS 0.2 should expose a clear alert delivery request containing the run
identity/outcome context, resolved Role-based recipients, content/template data, and
email-intent identity. The generic alert Mailable and its observable delivery behavior
must remain stable while the later mail milestone improves internal contracts and
adapters. Do not make this milestone depend on an unfinished general-mail refactor.

## Addendum: Alert administration UX and authorization - high importance

The PIP requires persisted alert definitions/configuration and Role-based recipients,
but it does **not** require an administrator-facing CRUD UI or its full authorization
model. This follow-on work is highly important before broad self-service alert
administration:

- define scoped create/view/update/delete permissions, configuration ownership, audit
  history, and the visibility boundary between configuration, recipient data, and
  delivery history;
- support immediate disablement and optional expiration, with explicit semantics for
  queued and in-flight work;
- constrain recipient management by Role and Department and show the effective
  recipient set; and
- define configurable polling schedules and an event-driven extension point without
  treating a chosen cron interval as an accidental product decision.

The UI and authorization tests for this follow-on work must consume MS 0.2's persisted
definition, runner, recipient-resolution, run-history, and delivery interfaces rather
than create a parallel framework.

## Addendum: Shared utilities and queue evaluation - future work

Assess whether reusable utilities such as `Parseable` and `Sluggable` should be
extracted from BuildCentral for alert implementations. Evaluate RabbitMQ separately as
a queue-system decision. Both may materially support future alert migrations, but
neither is a prerequisite for the PIP framework unless a concrete dependency is found
and approved.

## Source basis

Primary requirements are derived from the PIP sections **"Week 2 - Alert Service
Foundation"** and **"Week 3 - Complete Alert Framework / Work Item 664."**
