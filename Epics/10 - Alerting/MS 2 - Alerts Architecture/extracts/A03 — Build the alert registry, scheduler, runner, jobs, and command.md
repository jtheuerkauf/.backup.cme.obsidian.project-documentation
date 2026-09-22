## A03 — Build the alert registry, scheduler, runner, jobs, and command

**Suggested labels:** `Epic 10`, `MS 0.2`, `type::feature`, `area::alerts`  
**Weight:** 5  
**Depends on:** A01, A02

### Feature brief

Provide the common execution path that registers alerts and invokes them through the
application scheduler, runner, queued jobs, and a command entry point.

---

### Access control and users

Operational/developer users invoke the command. Application scheduling invokes the
same runner; no administration UI is included.

---

### Data collection

Create and update `alert_runs` through the shared execution path, not in individual
legacy alert implementations.

---

### Implementation scope

- Define the alert registry contract and registration mechanism.
- Implement the runner and the scheduler/job/command adapters around it.
- Use the A02 outcome and idempotency contract.
- Ensure a legacy alert supplies alert-specific logic while the runner owns common
  execution plumbing.
- Add runner, job, and command tests.

**Not included:** configurable self-service schedules or event-driven UI configuration.

---

### Release strategy

Deploy the common execution path before moving the DTS alert to it. Retain a safe
command path for operator verification.

---

### Sign-off

- A registered test alert can run from scheduler, job, and command entry points.
- Each invocation creates/updates a correctly classified run record.
- Individual alert implementations do not recreate common scheduling or run recording.

---

### Screenshots, design & docs

Document the registry and execution sequence, including retry/duplicate behavior.
