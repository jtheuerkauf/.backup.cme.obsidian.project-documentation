---
id: 193474690
title: git-switch - Add "composer dump-autoload"
dueDate: 
webUrl: https://gitlab.com/cme-corp/sharedservices/-/work_items/33
project: cme-corp/sharedservices#33
---

### git-switch - Add "composer dump-autoload"
##### Due on 

Even though the branch switch deletes and re-installs **composer** packages, it doesn't account for changes to autoload (class/namespace renames, etc.).

Every `composer install` should be followed by `composer dump-autoload`

[View On Gitlab](https://gitlab.com/cme-corp/sharedservices/-/work_items/33)
