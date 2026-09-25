## A02 — Define alert run outcomes and idempotency rules

**Suggested labels:** `Epic 10`, `MS 0.2`, `type::task`, `area::alerts`  
**Weight:** 3  
**Depends on:** A01
#epic-10 #alerts #pip #ms_0-2

### Feature brief

Define one outcome model for alert execution and the idempotency/duplicate-prevention
rules that the runner and email-intent path will follow.

---

### Access control and users

Not user-facing.

---

### Data collection

Specify how successful, empty-result, failed, and partial runs are recorded, including
the error/partial-result data that is safe and useful to retain.

---

### Implementation scope

- Define run-status values and permitted transitions.
- Define the idempotency key or equivalence rule for a run and for a delivery attempt.
- Document retry behavior and the point at which duplicate sends are prevented.
- Add unit tests for state transitions and repeated execution inputs.

**Not included:** scheduling implementation or user-visible run-history screens.

---

### Release strategy

Land this contract before runner, job, and delivery work. Later tickets consume it
rather than introducing status fields ad hoc.

---

### Sign-off

- The four required outcome classes are distinguishable and persisted consistently.
- A repeated eligible execution follows a documented, tested duplicate rule.
- Retry behavior cannot silently convert a partial/failure outcome into success.

---

### Screenshots, design & docs

Add a short state-transition table to the issue.
