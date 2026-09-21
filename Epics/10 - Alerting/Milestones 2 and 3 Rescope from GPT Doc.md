Extractions from [Epic 10 MS 2-3 GitLab Issues Breakdown](Epic%2010%20MS%202-3%20GitLab%20Issues%20Breakdown.md) to whittle scope back down to PIP intentions.

# Milestone 2: Alerts System

Provide a neutral centerpiece for migrating AllRivers Alerts into NewRivers.

## 1. Alert Definition and Run History

[A01 — Persist alert definitions and alert runs](A01%20—%20Persist%20alert%20definitions%20and%20alert%20runs.md)

### Simplified

- Create `alerts`, `alert_schedules` and `alert_runs` tables
- Each Alert is registered with execution schedule, active status, data service, mail builder, recipients by Role/Department/both