Implement the Project Tier criteria:

### Tier 1

- `value_min` > $100M
- `end_date`: current month + 4 years

### Tier 2

- `value_min` between $25M - $100M
- `end_date`: current month + 2 years

### Tier 1 & 2 Shared

- `construction_stage` IN (int values): Planning, Starts in 1-3 Months, Starts in 4-12 Months, Starts 12+ Months, Groundbreaking, Early Construction, Construction, Finalizing Construction, On Hold/Postponed
- `project_type` = (int) Medical 
- `facility_type` IN (int values): Acute Care Hospital, Ambulatory Surgery Center, Cancer Center, Medical Office, Long-term Care/Rehabilitation Hospital, Specialty Clinic, Urgent Care/Community Clinic


### Tier 3

- `value_min` < $25M
- `end_date` {omit}
- Negation of the shared criteria from 1 & 2

