---
id: 202814016
title: Sync SF Account IDs to BC Project records
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/671
project: cme-corp/newrivers#671
---

### Sync SF Account IDs to BC Project records
##### Due on 

Because the work- and data-flow for this project have shifted, SF Account IDs are no longer assigned within the NewRivers UI. As a consequence, there's no way to filter out "pending" BC Projects (those that haven't been linked to SF Accounts).

After each routine pull, `newrivers.build_central_projects` needs to get current data from `datasync.sfProjects` to find `BCD_Project_ID__c IS NOT NULL`. Since it's on a separate host, the cleanest way will be to pull the data into a `newrivers` temp table so the sync can fill in missing `build_central_projects.sf_account_id`.

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/671)
