---
id: 196363721
title: Evaluate moving application routes to DB
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/501
project: cme-corp/newrivers#501
---

### Evaluate moving application routes to DB
##### Due on 

As we move to DB-driven app navigation, we have to start maintaining that information in two locations: database and `routes/*.php` files.

It will become very easy to overlook making matching changes in both sources if/when we grant access to high-level users to manage the menu according to their needs. One, they won't be able to update the config files that have to match the data they just updated, so they have to submit a dev request on top of the change. Two, as we continue to add and manage routes in config, we have to remember to write migration files to fix the DB menu.

It might ultimately be better to move routing into the DB as well to eliminate the split and keep one source of truth.

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/501)
