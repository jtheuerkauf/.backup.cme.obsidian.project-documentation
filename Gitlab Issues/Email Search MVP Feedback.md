---
id: 196096271
title: Email Search MVP Feedback
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/485
project: cme-corp/newrivers#485
---

### Email Search MVP Feedback
##### Due on 

### Describe the enhancement / feature. What will it do?

* Open text search doesn't provide accurate matches.
  * Over all, review search functionality to improve accuracy.
* Implement actual Permissions that were added in MVP but not applied.
  * Are separate `mailable`-based permissions necessary? How should they be bound to users/mail triggers?
* Links to Attachments
* Queued that aren't queued (write up list of conditions that define each status)
  * Make sure status rules are consistent and mutually exclusive (individual Mailable status counts all match, including `All`)
  * New Issue for `EmailService` -- uniform attempt limit, clear errors on success
* Image rendering in `iframe` -- HTML dump isn't requesting `<img>` or request is failing?

---

Request to have `[Retry]` on Failed messages, but there will be better alternatives once we have more robust MSGraph/Exchange feedback data.

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/485)
