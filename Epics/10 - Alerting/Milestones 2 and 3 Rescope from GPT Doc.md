Extractions from [Epic 10 MS 2-3 GitLab Issues Breakdown](Epic%2010%20MS%202-3%20GitLab%20Issues%20Breakdown.md) to whittle scope back down to PIP intentions.

# Milestone 2: Alerts System

Provide a neutral centerpiece for migrating AllRivers Alerts into NewRivers.

## 1. Alert Definition and Run History

[A01 — Persist alert definitions and alert runs](A01%20—%20Persist%20alert%20definitions%20and%20alert%20runs.md)

### Simplified

#### Requirements

- Create `alerts`, `alert_schedules`, `alert_role_recipients` and `alert_runs` tables
- Each Alert is registered with execution schedule, active status, data service, mail builder, recipients by Role.
- Every Alert run is recorded with its start and finish timestamps, completion status (new enum seems appropriate if one doesn't exist), JSON for arbitrary extra data (in particular, when a job fails mid-stream, store a list of the successful "sends" so they can be omitted from retry).
	- Not sure how best to do the data relationship. Most common usage will be last-run for a given Alert, meaning the Alert holds FK to the Run ID, but that leaves the Runs would a link to the Alert they were for. On the other side, if the Runs hold FK to Alert, code/query logic has to look for `MAX(run_timestamp)` 99% of the time, which is inefficient. Is a cross-FK appropriate here?

#### Specifications

**`alerts`** 

| Column              | Type                  | Modifiers                                | Key/Index           | Note/ `Comment` |
| ------------------- | --------------------- | ---------------------------------------- | ------------------- | --------------- |
| `id`                | `id()`                |                                          | PK                  |                 |
| `service`           | `string()`            |                                          | UIDX                |                 |
| `mailer`            | `enum(EmailMailable)` |                                          |                     |                 |
| `active`            | `bool()`              | `default(true)`                          |                     |                 |
| `last_alert_run_id` | `unsignedBigInt()`    | `nullable()`                             | FK `alert_runs(id)` |                 |
| `created_at`        | `timestamp()`         | `useCurrent()`                           |                     |                 |
| `updated_at`        | `timestamp()`         | `useCurrent()`<br>`useCurrentOnUpdate()` |                     |                 |

**`alert_runs`**

| Column              | Type                     | Modifiers              | Key/Index       | Note/ `Comment`                                         |
| ------------------- | ------------------------ | ---------------------- | --------------- | ------------------------------------------------------- |
| `id`                | `id()`                   | PK                     |                 |                                                         |
| `started_at`        | `timestamp()`            | `useCurrent()`         |                 |                                                         |
| `finished_at`       | `timestamp()`            | `useCurrentOnUpdate()` |                 |                                                         |
| `completion_status` | `enum(CompletionStatus)` | `nullable()`           | IDX             |                                                         |
| `data`              | `json()`                 | `nullable()`           |                 | Error info, list of partially complete recipients, etc. |
| `alert_id`          | `unsignedBigInt()`       |                        | FK `alerts(id)` |                                                         |

**`alert_role_recipients`** (model extends `Pivot`)

| Column     | Type               | Modifiers | Key/Index       | Note/ `Comment` |
| ---------- | ------------------ | --------- | --------------- | --------------- |
| `alert_id` | `unsignedBigInt()` |           | FK `alerts(id)` |                 |
| `role_id`  | `unsignedBigInt()` |           | FK `roles(id)`  |                 |
| `active`   | `bool()`           |           | `default(true)` |                 |

**`alert_schedules`**

| Column             | Type                 | Modifiers                                | Key/Index | Note/ `Comment`                                                      |
| ------------------ | -------------------- | ---------------------------------------- | --------- | -------------------------------------------------------------------- |
| `id`               | `id()`               |                                          | PK        |                                                                      |
| `created_at`       | `timestamp()`        | `useCurrent()`                           |           |                                                                      |
| `updated_at`       | `timestamp()`        | `useCurrent()`<br>`useCurrentOnUpdate()` |           |                                                                      |
| `expires_at`       | `datetime()`         | `nullable()`                             |           |                                                                      |
| `nth_year_cycle`   | `unsignedTinyint()`  | `nullable()`                             |           | Yes, improbable, but so was > $1M  order until Walmart messed it up. |
| `nth_month_cycle`  | `unsignedTinyint()`  | `nullable()`                             |           |                                                                      |
| `nth_week_cycle`   | `unsignedTinyint()`  | `nullable()`                             |           |                                                                      |
| `nth_day_cycle`    | `unsignedSmallint()` | `nullable()`                             |           |                                                                      |
| `nth_hour_cycle`   | `unsignedTinyint()`  | `nullable()`                             |           |                                                                      |
| `nth_minute_cycle` | `unsignedTinyint()`  | `nullable()`                             |           |                                                                      |
| `months_of_year`   | `json()`             | `nullable()`                             |           | `1=Jan`                                                              |
| `weeks_of_year`    | `json()`             | `nullable()`                             |           | `ISO-8601`                                                           |
| `weeks_of_month`   | `json()`             | `nullable()`                             |           | `1-[4,5]`<br>`Mon=D1`                                                |
| `days_of_month`    | `json()`             | `nullable()`                             |           | `1-[28-31]`<br>skip if not in month                                  |
| `days_of_week`     | `json()`             | `nullable()`                             |           | `1=Mon`                                                              |
| `hours_of_day`     | `json()`             | `nullable()`                             |           | `0-23`                                                               |
| `minutes_of_hour`  | `json()`             | `nullable()`                             |           | `0-59`                                                               |

That's the most "table-ized" way, but we could also compact all the schedule values into a JSON schema and use one `schedule<JSON>` column.
