---
id: 204423113
title: Provide --test and --dry-run options to restrict to local environment
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/730
project: cme-corp/newrivers#730
---

### Provide --test and --dry-run options to restrict to local environment
##### Due on 

These run options should provide safeguards against unintended data writes and provide full spin-up of a test run.

* `--dry-run` Is a `stdout` result only: it previews stats and data from the Run, but _does not_ send emails or record data to tables
* `--test` Provides an "active" Run:
  * Data writes to SQLite to avoid accidental disruption to live data
  * Test will not run if Mailer setting is MS Graph (set `smtp` and use MailPit) -- this configuration may end up statically written in `config/alerts.php`

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/730)
