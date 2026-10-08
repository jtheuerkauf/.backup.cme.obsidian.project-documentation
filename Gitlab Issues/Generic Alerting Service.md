---
id: 202540037
title: Generic Alerting Service
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/664
project: cme-corp/newrivers#664
---

### Generic Alerting Service
##### Due on 

#### Description (Briefly describe the new feature and what value it will add):

Create a reusable, role-targeted alert framework for scheduled user alert emails. It will replace alert-specific email orchestration with a common runner, a single digest Mailable, reusable data-source classes, and durable run/email history.

This reduces duplicate alert code, makes new alerts faster and safer to add, preserves required legacy alert-tracking writes, and provides the data needed for a future alert dashboard.

———

#### Access control and who will be using it?

Alert emails will be sent only to active users resolved from configured application roles. Each alert will define its TO/CC role rules and may define approved fallback recipients where necessary.

Initial operational users are the business roles receiving existing alert emails. Administrators/developers will manage alert definitions, schedules, role mappings, and investigate run/email status. A future dashboard should be restricted to an alert administration/reporting permission.

———

#### Specification details, considerations, and Data collection (is data synthesized from other sources or created this feature?

Create only these new application tables: (see [clarification comment](#note_3937781707))

- alerts: alert registry/configuration, replacing the proposed alert_definitions name.
  - Stable key, display name, description, definition class, enabled status, schedule, recipient rules JSON, settings JSON, and legacy alert name.
- alert_runs: a durable record of every alert evaluation.
  - Alert ID, unique run/deduplication key, trigger type, scheduled time, start/end time, status, matched row count, recipient/email counts, source statistics JSON, summary JSON, payload/item-key snapshot, legacy-write result JSON, and error details.

Do not add separate source, recipient, delivery, or legacy-write tables. Existing emails records will represent individual email deliveries and point back to the run through:

'related_type' =\> AlertRun::class, 'related_id' =\> $alertRun-\>id,

The email context field will retain the recipient role snapshot, alert key, recipient-specific row count, and other delivery context. Existing email statuses and mail transport listeners remain the source of truth for queued, sent, and failed email delivery.

Place new alert orchestration under existing core folders rather than creating a new top-level App\\Alerts namespace:

app/Models/ Alert.php AlertRun.php

app/Services/Email/ AlertRegistry.php AlertRunner.php RoleRecipientResolver.php AlertRunRecorder.php LegacyAlertTrackingWriter.php Definitions/ BillingHoldAlertDefinition.php Sources/ APlusBillingHoldSource.php PmHubTrackerEnricher.php CleanupNoteEnricher.php

app/Contracts/Email/ AlertDefinition.php AlertSource.php

app/Mail/ AlertDigestMail.php

app/Jobs/Email/ RunAlertJob.php SendAlertDigestJob.php

app/Console/Commands/ RunAlertCommand.php

Use a single AlertDigestMail Mailable. Alert definition classes provide the subject, heading, columns, source classes, recipient rules, and normalized result data; they must not own queueing, email intent persistence, recipient lookup, or legacy writes.

Data may be synthesized from multiple sources. Each source/enricher must run batched queries against its own connection and report its row count, duration, status, and failure information into alert_runs.source_stats. Do not store arbitrary SQL in the database; SQL remains in tested source classes.

The first conversion target should be the dts over 20k alert. Its existing A+, PMHub, and cleanup-note logic should be split into sources/enrichers and executed through the common runner.

The runner must:

1. Create an alert_runs row with a deterministic run key.
2. Collect, normalize, and enrich rows from configured sources.
3. Resolve and deduplicate active recipients by role.
4. Persist summary/source/run details and create one existing emails intent per recipient group.
5. Queue the generic Mailable only after the local database transaction commits.
6. Write required legacy alertTracking data through LegacyAlertTrackingWriter.
7. Mark the run completed, no_results, failed, or partial.

Legacy writes must be isolated from local run persistence. A legacy write failure should preserve the run and email audit trail, record its error in alert_runs.legacy_write, and mark the run partial. Since the legacy tracking model has no dependable primary key, the writer should use the query builder and an explicit idempotency strategy.

Required tests include source data normalization, role-based recipient resolution, duplicate prevention, empty-result behavior, per-recipient email intent creation, queued/sent/failed email status handling, source failure behavior, and idempotent legacy writes.

———

#### Relevant screenshots, design, or supporting documentation?

No UI is required for the initial release.

Supporting implementation references:

- Existing billing-hold alert job/service/mailable as the first refactor candidate.
- Existing emails intent, deduplication, and delivery-status workflow.
- Existing legacy allrivers.alertTracking and dimReporting schemas.
- Future dashboard data source: alerts, alert_runs, and related emails.

———

#### Release strategy? Outside of the code being put into production what else needs to happen?

1. Confirm legacy alertTracking column semantics, especially runCount, totalRunCount, lineCount, and the expected runDate granularity.
2. Add and migrate alerts and alert_runs.
3. Seed the billing-hold alert definition and configure its schedule and recipient-role rules.
4. Run the new billing-hold implementation in dry-run/shadow mode and compare source rows, recipient lists, email output, and legacy tracking writes against the existing alert.
5. Enable the new scheduled job and disable the legacy billing-hold scheduler only after comparison is accepted.
6. Monitor alert runs, queued emails, provider delivery results, and legacy-write outcomes after release.
7. Convert further alerts incrementally using the same framework.

———

#### Stakeholders or Groups to notify for review

- Billing / Accounts Receivable alert recipients
- Alert owners and requestors
- Application development team
- Database/data integration owners for A+, PMHub, Datasync, and legacy AllRivers
- Infrastructure/queue-email operations owners
- Future reporting/dashboard stakeholders

———

### Calculated Priority

WPI Score: 18

WPI Priority: AUTO

———

<details>
<summary>Click to expand</summary>
=100\*((((B2+C2)/(D2+(E2\*3)))-(2/28))/((10/4)-(2/28)))

#### Business Value

- [ ] BV:1 Very Low — little measurable value
- [ ] BV:2 Low — limited value
- [ ] BV:3 Medium — meaningful value
- [x] BV:4 Significant value
- [ ] BV:5 Critical — essential business/user value

#### Time Criticality

- [ ] TC:1 Not time-sensitive
- [ ] TC:2 Can wait with little consequence
- [x] TC:3 Should be addressed reasonably soon
- [ ] TC:4 Delay has significant consequences
- [ ] TC:5 Immediate/near-term need

#### Added Risk

- [ ] RISK:1 Very Low - minimal consequence if unresolved
- [ ] RISK:2 Limited potential negative impact
- [x] RISK:3 Moderate - meaningful potential impact
- [ ] RISK:4 Significant potential impact
- [ ] RISK:5 Critical - severe business, user, operational, or release risk

#### Development Effort (weight)

- [ ] EFFORT:1 Minimal - Very small change
- [ ] EFFORT:2 Straightforward development
- [ ] EFFORT:3 Moderate - Moderate implementation/testing
- [x] EFFORT:5 Large - Significant development/testing
- [ ] EFFORT:8 Very Large - Major change, multiple components
- [ ] EFFORT:13 Extensive - Should probably be broken into smaller work

</details>

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/664)
