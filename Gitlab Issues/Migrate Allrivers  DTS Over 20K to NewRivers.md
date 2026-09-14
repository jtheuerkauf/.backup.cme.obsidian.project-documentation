---
id: 203037303
title: Migrate Allrivers  DTS Over 20K to NewRivers
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/676
project: cme-corp/newrivers#676
---

### Migrate Allrivers  DTS Over 20K to NewRivers
##### Due on 

#### Description (Clearly describe the enhancement and what it will improve):

---

The change migrates an old alert from Allrivers code to Newrivers, updates it, and lowers dependency on legacy code. It also sets the stage for a more generalized Alert architecture that can be applied throughout NewRivers.

#### Specification details and special considerations?

---

Refactor `allrivers/periodicJobs/dtsOver20KAlert.php` into NewRivers using the NewRivers database synchronization tables.

The implementation must establish the initial generic alert email functionality that will be used as the foundation for the reusable alert framework developed during the following weeks.

Completion includes:

- Recreating the DTS Over $20K alert functionality in NewRivers.
- Using NewRivers synchronized database tables as the data source.
- Creating a generic Mailable capable of being populated for alert emails.
- Ensuring the persisted email Mailable is the generic alert Mailable.
- Setting the email type to `alert.dtsover20k`.
- Preserving the required writes to `allrivers.alertTracking`.
- Preserving the required writes to `allrivers.dimReporting`.
- Adding appropriate automated testing.
- Demonstrating that the NewRivers implementation produces the expected alert results

#### Location Details (URL, System\> Page\> Section of page, and screenshots of current asset):

---

#### Stakeholder Reviewer and Groups to Notify

---

### Calculated Priority

**WPI Score:** `AUTO`

**WPI Priority:** `AUTO`

---

<details>
<summary>Click to expand</summary>

 =100\\\*((((B2+C2)/(D2+(E2\\\*3)))-(2/28))/((10/4)-(2/28)))

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
- [x] `RISK:2` Limited potential negative impact
- [ ] `RISK:3` Moderate - meaningful potential impact
- [ ] `RISK:4` Significant potential impact
- [ ] `RISK:5` Critical - severe business, user, operational, or release risk

#### Development Effort (weight)

- [ ] `EFFORT:1` Minimal - Very small change
- [x] `EFFORT:2` Straightforward development
- [ ] `EFFORT:3` Moderate - Moderate implementation/testing
- [ ] `EFFORT:5` Large - Significant development/testing
- [ ] `EFFORT:8` Very Large - Major change, multiple components
- [ ] `EFFORT:13` Extensive - Should probably be broken into smaller work

</details>

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/676)
