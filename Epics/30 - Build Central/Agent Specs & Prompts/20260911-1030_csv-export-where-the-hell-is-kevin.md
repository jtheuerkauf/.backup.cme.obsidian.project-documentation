I need the CSV export logic. The mapping is in `storage/docs/20260910-1240_bcp-to-csv-map.md`

- The output CSV column headers are in the "Salesforce Column Name" list.
- Where provided, substitute the stored table or model mutator value with the alternate source to keep everything contained in SQL.
  - If any other columns turn out to require external evaluation, report the issue.
- The most complex part of this is the `manager` column:

#### `manager`

This is the Regional Sales Director (identified by `newrivers.roles`).
The correct RSD is found by matching the (by priority) `owner_contact`/`tenant_contact` to a `newrivers.users` record.
I'm not sure how this is done. Examine code, comments, and docs related to Sales Territory (`portal.[account_managers|am_territory|facilities]`)
looking for connections to Directors, Regional, etc. In theory it should be possible to link to it in the same query pass.
I'll provide additional detail if you can't find it.
