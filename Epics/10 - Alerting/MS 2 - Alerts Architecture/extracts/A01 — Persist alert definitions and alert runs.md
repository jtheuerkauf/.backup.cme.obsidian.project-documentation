## A01 — Persist alert definitions and alert runs

**Suggested labels:** `Epic 10`, `MS 0.2`, `type::feature`, `area::alerts`  
**Weight:** 5  
**Depends on:** None

### Feature brief

Create the `alerts` and `alert_runs` persistence boundary needed to configure
registered alerts and record each execution. Define model and service ownership so
configuration, run history, recipient resolution, and email delivery remain separate.

---

### Access control and users

No administrator-facing UI is included. Application services and command/job execution
are the consumers.

---

### Data collection

Persist alert configuration and a run record with stable identifiers, timestamps, and
a lifecycle/outcome value. Do not persist a second copy of email-delivery history.

---

### Implementation scope

- Add migrations, models, factories, and relationships for `alerts` and
  `alert_runs`.
- Define the minimum configuration and run fields needed by the registry/runner.
- Establish foreign-key/index strategy and retention expectations.
- Document the ownership boundary between a run record and an `Email` intent.

**Not included:** administration CRUD, recipient UI, or a general email refactor.

---

### Release strategy

Ship migrations and models before runner adoption. Do not require a destructive
migration of existing Week 1 alert data.

---

### Sign-off

- A configured alert and each of its runs can be persisted and retrieved.
- Run history is distinct from email intent/delivery history.
- Factories and migration tests cover the schema and relationships.

---

### Screenshots, design & docs

Document the data ownership map and migration fields in the issue or linked design
note.
