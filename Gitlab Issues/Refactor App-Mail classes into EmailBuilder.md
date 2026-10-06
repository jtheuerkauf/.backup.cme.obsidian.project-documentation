---
id: 205005275
title: Refactor App\Mail classes into EmailBuilder
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/745
project: cme-corp/newrivers#745
---

### Refactor App\Mail classes into EmailBuilder
##### Due on 

#### Description (Clearly describe the enhancement and what it will improve):

This change will consolidate the growing number of individualized "Mailable" classes under the `App\Mail` namespace, consolidating redundant and overlapping logic into a neutral EmailBuilder, with extending Builders that run customized email logic.

It will improve development ability to quickly and intuitively implement new email groups (Alerts, Portal, PO Submission, etc.) and types within the groups ([DTS Over 20K Alert](newrivers#676), etc.)

---

#### Specification details and special considerations?

Most `App\Mail` classes have redundant methods that can be centralized into a primary MailBuilder. Mailers that have specialized needs like attachments or specific headers, etc. can extend the primary, and share overlapping needs via traits.

To remain agnostic to the data being passed to the email body (for Alerts, typically data sheets and other multi-row information), the mechanism using the MailBuilder is responsible for passing in its own data formatting in the form of a function or invokable object. The MB doesn't care about what the formatter gives it, it simply applies it to the email body.

Surrounding email content (typically HTML) is therefore also the responsibility of the calling mechanism. The email should already be templated and ready for MailBuilder to drop data into it.

Recipients of the Email are the MailBuilders responsibility, though the conditions and access rules for collecting them is also part of the caller: if the Email is received by Role in general, provide the query that finds the Users with the permitted Roles. If specific data is linked in some other way, provide that. The MailBuilder should be limited to assembling the Email itself, not the business rules of its content.

---

#### Location Details (URL, System\> Page\> Section of page, and screenshots of current asset):

---

#### Stakeholder Reviewer and Groups to Notify

---

### Calculated Priority

**WPI Score:** `20`

**WPI Priority:** `AUTO`

---

<details>
<summary>Click to expand</summary>
=100\*((((B2+C2)/(D2+(E2\*3)))-(2/28))/((10/4)-(2/28)))

#### Business Value

- [ ] `BV:1` Very Low — little measurable value
- [ ] `BV:2` Low — limited value
- [x] `BV:3` Medium — meaningful value
- [ ] `BV:4` Significant value
- [ ] `BV:5` Critical — essential business/user value

#### Time Criticality

- [ ] `TC:1` Not time-sensitive
- [ ] `TC:2` Can wait with little consequence
- [ ] `TC:3` Should be addressed reasonably soon
- [ ] `TC:4` Delay has significant consequences
- [x] `TC:5` Immediate/near-term need

#### Added Risk

- [ ] `RISK:1` Very Low - minimal consequence if unresolved
- [ ] `RISK:2` Limited potential negative impact
- [ ] `RISK:3` Moderate - meaningful potential impact
- [x] `RISK:4` Significant potential impact
- [ ] `RISK:5` Critical - severe business, user, operational, or release risk

#### Development Effort (weight)

- [ ] `EFFORT:1` Minimal - Very small change
- [ ] `EFFORT:2` Straightforward development
- [x] `EFFORT:3` Moderate - Moderate implementation/testing
- [ ] `EFFORT:5` Large - Significant development/testing
- [ ] `EFFORT:8` Very Large - Major change, multiple components
- [ ] `EFFORT:13` Extensive - Should probably be broken into smaller work

</details>

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/745)
