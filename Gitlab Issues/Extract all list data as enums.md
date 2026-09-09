---
id: 200917776
title: Extract all list data as enums
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/617
project: cme-corp/newrivers#617
---

### Extract all list data as enums
##### Due on 

* Contact Roles
* Level (of?) Care
* Clinical Specialty
* Note Type
* Construction Size
* Construction Category
* Construction Stage
* Construction Type
* Sector
* Project Type
* Report Type
* Commercial Real Estate

---

* Enums are int-backed, with a method to get the string name of the case.
* Table stores the API data integer array as JSON, adding the formatted output string to `formatted` column's JSON under the same key.
  * `commercial_real_estate = [ 1, 2, 3 ] ~> formatted->'commercial_real_estate' = 'A, B, C'`
  * `contacts[0].role       = [ 11, 22 ]  ~> formatted->'contacts[0].role' = 'XYZ, ABC'`
* The enum display name is primarily for selection in searches. Display value of the data should come from `formatted`.

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/617)
