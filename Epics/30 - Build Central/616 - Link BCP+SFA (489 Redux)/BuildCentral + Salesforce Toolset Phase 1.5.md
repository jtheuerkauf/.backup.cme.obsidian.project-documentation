# Requirements
- Establish NewRivers-based UI to match BC Project Location to SF Project Location
- Pre-match where possible based on Project street address
- User reviews/confirms auto-match pairs
- User searches SF/BC Projects to match them manually #unclear
	- What address are the pairs actually based on? SF Account (or "Facility Account"), or Project? #user-questions

# Specifications
- Most of the work pre-demo can be applied; [[UI will require overhaul]] #task
## Database Revisions
### `build_central_projects`
- Nearly everything remains as-is
- `sf_*_id` columns move to `build_central_salesforce_projects`
- What other data points from the BC API data should be extracted as columns? #user-questions 
### `build_central_salesforce_matches`

| Column                     | Type              | NULL       | Default             | Index         | FK                          | Extra                             |
| -------------------------- | ----------------- | ---------- | ------------------- | ------------- | --------------------------- | --------------------------------- |
| `id`                       | `BIGINT UNSIGNED` | `NOT NULL` | `AUTOINCREMENT`     | `PRIMARY KEY` |                             |                                   |
| `build_central_project_id` | `BIGINT UNSIGNED` | `NOT NULL` |                     | `UNIQUE`      | `build_central_projects.id` |                                   |
| `salesforce_project_id`    | `VARCHAR(18)`     | `NOT NULL` |                     | `UNIQUE`      | `datasync.sfProjects.ID`    |                                   |
| `created_at`               | `TIMESTAMP`       | `NOT NULL` | `CURRENT_TIMESTAMP` |               |                             |                                   |
| `accepted_at`              | `TIMESTAMP`       | `NULL`     | `NULL`              |               |                             | `ON UPDATE USE CURRENT_TIMESTAMP` |
| `accepted_by`              | `BIGINT UNSIGNED` | `NULL`     | `NULL`              |               | `users.id`                  |                                   |
### `build_central_salesforce_projects`

| Column                     | Type              | NULL       | Default             | Index         | FK                          | Extra |
| -------------------------- | ----------------- | ---------- | ------------------- | ------------- | --------------------------- | ----- |
| `id`                       | `BIGINT UNSIGNED` | `NOT NULL` | `AUTOINCREMENT`     | `PRIMARY KEY` |                             |       |
| `build_central_project_id` | `BIGINT UNSIGNED` | `NOT NULL` |                     | `UNIQUE`      | `build_central_projects.id` |       |
| `salesforce_account_id`    | `VARCHAR(18)`     | `NOT NULL` |                     | `INDEX`       | `datasync.sfAccounts.ID`    |       |
| `salesforce_project_id`    | `VARCHAR(18)`     | `NOT NULL` |                     | `INDEX`       | `datasync.sfProjects.Id`    |       |
| `assigned_by`              | `BIGINT UNSIGNED` | `NOT NULL` |                     |               | `users.id`                  |       |
| `assigned_at`              | `TIMESTAMP`       | `NOT NULL` | `CURRENT_TIMESTAMP` |               |                             |       |
### `build_central_assignment_history`

| Column                     | Type              | NULL       | Default         | Index         | FK                          | Extra |
| -------------------------- | ----------------- | ---------- | --------------- | ------------- | --------------------------- | ----- |
| `id`                       | `BIGINT UNSIGNED` | `NOT NULL` | `AUTOINCREMENT` | `PRIMARY KEY` |                             |       |
| `build_central_project_id` | `BIGINT UNSIGNED` | `NOT NULL` |                 |               | `build_central_projects.id` |       |
| `salesforce_account_id`    | `VARCHAR(18)`     | `NULL`     | `NULL`          | `INDEX`       | `datasync.sfAccounts.ID`    |       |


# BuildCentral API Pull
Scheduled 

# Data Flow
[Diagram](nr-449-build-central/nr-449-revised-workflow.drawio.pdf)

## Data Organization
- `Facility Type = 'Medical Office'` #requirement ([Doc](CD%20Project%20Filtering%20and%20Process_Updated%208.21.26%20BC%20Edits))
- 