---
id: 201488926
title: Add "format" JSON column to BC Projects and related tables
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/647
project: cme-corp/newrivers#647
---

### Add "format" JSON column to BC Projects and related tables
##### Due on 

Each table that holds `"format"` data that isn't extracted as relational/enum should have a `format` column:

`format JSON NULL DEFAULT NULL`

The content will be a map of table columns to display values:

```
 county_fips |     start_date |       end_date | format 
-------------+----------------+----------------+-----------------------------
       39059 | 1976-09-15 ... | 2026-09-15 ... | {
                                               |   "county_fips": "Cuyahoga",
                                               |   "start_date": "9/1976",
                                               |   "end_date": "Q3/2026"
                                               | }
-----------------------------------------------+-----------------------------
```

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/647)
