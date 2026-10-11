---
id: 194093168
title: Add Migration/Seeding procedure for table and data maintenance
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/427
project: cme-corp/newrivers#427
---

### Add Migration/Seeding procedure for table and data maintenance
##### Due on 

_TL;DR: Migrations and seeding can create a two-way compatibility problem. Modifying the table makes it incompatible with the original seed data, but modifying the seed data breaks the ability to rollback partial table changes._

To accommodate making table and data changes that can preserve compatibility through rollbacks, re-installation, etc. Migrations need to make their needed changes, and execute any data maintenance _separately_ from the original seeder. But the execution has to be conditional. Seeders need the same mechanism.

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/427)
