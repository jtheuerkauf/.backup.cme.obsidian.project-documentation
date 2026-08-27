---
id: 193474632
title: Add "cruise artisan optimize:clear" after branch switch
dueDate: 
webUrl: https://gitlab.com/cme-corp/sharedservices/-/work_items/32
project: cme-corp/sharedservices#32
---

### Add "cruise artisan optimize:clear" after branch switch
##### Due on 

Before or after `npm run build` might not matter, but at some point `artisan optimize:clear` should be called to ensure cached view and other debris from a branch switch are cleared so they can be re-cached with correct ones.

[View On Gitlab](https://gitlab.com/cme-corp/sharedservices/-/work_items/32)
