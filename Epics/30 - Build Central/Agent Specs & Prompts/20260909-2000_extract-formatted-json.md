Scan `build_central_projects.raw_payload` and extract all `"format"` data, preserving its current structure, but removing the `"format"` key itself:

**`raw_payload` example**
```
{
  "buildCentralId": 12345,
  "constructionType": [ 2, 5 ],
  "projectStage": 3,
  "endDate": "2028-12-31 23:59:59"
  "format": {
    "constructionType": "Value 2, Value 5",
    "projectStage": "Groundbreaking",
    "endDate": "Q4/2028"
  },
  "contacts": [
    {
      "contactId": 88888,
      "role": [ 1, 3, 5 ]
      "format": {
        "role": "Owner, Tenant, Customer"
      }
    }, {
      "contactId": 99999,
      "role": [ 9 ],
      "format": {
        "role": "Sidekick"
      }
    }
  ]
}
```

**expected extraction**
```
/* build_central_projects.formatted */
{
  "construction_type": "Value 2, Value 3",
  "project_stage": "Groundbreaking",
  "end_date": "Q4/2028"
}

/* build_central_contacts */
{
  "contact_id": 88888,
  "role": "Owner, Tenant, Customer"
},
{
  "contact_id": 99999,
  "role": "Sidekick"
}
```

Note the criteria:
- `camelCase` from payload converts to `snake_case` for extraction -- this is to match the table column name
- 
