---
id: 197775446
title: In-team demo feedback
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/575
project: cme-corp/newrivers#575
---

### In-team demo feedback
##### Due on 

Change notes

- Scrollable part of search view: table or page?
  * Move HTML classes from `table-cell` to local scope
  * For table-cell, make classes a parameter and default to originals
- Move global CSS `:disabled` rule to local override
- Add more color to info cards on modal
  - Should be easier to distinguish grouping of info and stand out from background
- Adjust Min Value logic to look at config's minimum:
  - When config \> 1M, assume min-value search with no symbol == 'M'
  - When \< 1M, no auto-'M'.
- Move new `.env` config to actual `./config/...`
- Remove "`env`" file
- Remove accidentally committed credentials (review full branch to re-commit without them).
- Move BC-specific API Exception to be more generalized / reusable

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/575)
