---
id: 193519037
title: Fixes for ports, composer.json, vite, etc.
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/406
project: cme-corp/newrivers#406
---

### Fixes for ports, composer.json, vite, etc.
##### Due on 

* Ports: `vite` needs `5173` open so it can serve fresh JS/CSS resources during `npm run dev`
* `composer.json` needs:
  * PHP 8.3+ polyfills (also added by cme-corp#28)
  * `playwright` -- Dockerfile attempts to install its dependencies but it's never installed.
    * Besides, it's a useful tool for test writing.
  * Update `composer.lock` with updated requirements

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/406)
