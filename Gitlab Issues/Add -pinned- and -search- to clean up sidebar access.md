---
id: 205999938
title: Add "pinned" and "search" to clean up sidebar access
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/793
project: cme-corp/newrivers#793
---

### Add "pinned" and "search" to clean up sidebar access
##### Due on 

#### Description (Clearly describe the enhancement and what it will improve):

---

The change will allow users to "pin" their most frequently used sidebar menu items to the top for quicker access, and provide a live-filter search to find menu items by name, possibly description, etc.

#### Specification details and special considerations?

---

**1. Search**

Add `Search` component to sidebar top that filters the sidebar in-line **or** offers a suggestion list separate from the Sidebar tree. To keep vertical space optimal, the search could be hidden at a side and slide out

**2. Pinning**

* Provide a "pin" icon when hovering over the menu item (gt 0.5s). When the user pins an item, it creates or is added to a "Pinned Items" menu container at the top of the sidebar.
* Groups may also be pinned by pinning the container item.
* Pinned items and position are persisted to DB for the user.
* The user can drag pinned items vertically to change their position. Groups remain exclusive; they move as a whole and don't allow new items to be dragged in.
* Last unpinned item removes/hides the "Pinned" container from UI.

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
=100\*((((B2+C2)/(D2+(E2\*3)))-(2/28))/((10/4)-(2/28)))

#### Business Value

- [ ] `BV:1` Very Low — little measurable value
- [ ] `BV:2` Low — limited value
- [ ] `BV:3` Medium — meaningful value
- [x] `BV:4` Significant value
- [ ] `BV:5` Critical — essential business/user value

#### Time Criticality

- [ ] `TC:1` Not time-sensitive
- [ ] `TC:2` Can wait with little consequence
- [x] `TC:3` Should be addressed reasonably soon
- [ ] `TC:4` Delay has significant consequences
- [ ] `TC:5` Immediate/near-term need

#### Added Risk

- [ ] `RISK:1` Very Low - minimal consequence if unresolved
- [ ] `RISK:2` Limited potential negative impact
- [x] `RISK:3` Moderate - meaningful potential impact
- [ ] `RISK:4` Significant potential impact
- [ ] `RISK:5` Critical - severe business, user, operational, or release risk

#### Development Effort (weight)

- [ ] `EFFORT:1` Minimal - Very small change
- [ ] `EFFORT:2` Straightforward development
- [ ] `EFFORT:3` Moderate - Moderate implementation/testing
- [x] `EFFORT:5` Large - Significant development/testing
- [ ] `EFFORT:8` Very Large - Major change, multiple components
- [ ] `EFFORT:13` Extensive - Should probably be broken into smaller work

</details>

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/793)
