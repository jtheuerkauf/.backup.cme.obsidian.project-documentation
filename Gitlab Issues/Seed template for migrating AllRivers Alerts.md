---
id: 204686463
title: Seed template for migrating AllRivers Alerts
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/733
project: cme-corp/newrivers#733
---

### Seed template for migrating AllRivers Alerts
##### Due on 

To ease migration of other Alerts out of AllRivers, add a data template that takes data necessary to build the Alert, Schedule, and Role links.

Required \*

| Table | Field | Type |
|-------|-------|------|
| **`alerts`** |  |  |
|  | `type_key` \* | `App\Enums\Alerts\AlertType` |
|  | `name` \* | `varchar(255)` |
|  | `source_config` \* | `json` |
|  | `definition_version` | `tinyint` (default `1`) |
|  | `enabled_at` | `timestamp` |
|  | `disabled_at` | `timestamp` |
| **`alert_schedules`** |  |  |
|  | `schedule_type` \* | `App\Enums\Alerts\ScheduleType` |
|  | `schedule_definition` \* | `varchar(255)` cron-string |
|  | `timezone` \* | `varchar(255)` IANA TZDB name |
|  | `next_run_at` | `timestamp` |
|  | `enabled_at` | `timestamp` |
|  | `disabled_at` | `timestamp` |
| **`alerts_role_recipients`** |  |  |
|  | `roles.code` \* (-\> `role_id`) | `bigint unsigned` |

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/733)
