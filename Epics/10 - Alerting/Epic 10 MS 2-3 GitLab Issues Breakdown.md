# Epic 10: GitLab issue backlog for milestones 0.2 and 0.3

## How to use this backlog

Create the issues in dependency order. Set **Parent** to NewRivers work item 664 for
MS 0.2 issues; set **Parent** to the Epic 10 Mail milestone for MS 0.3 issues.
The labels below are suggestions, not assumed existing GitLab labels.

Every issue deliberately keeps its implementation and verification scope bounded. Work
identified as an addendum is included so it can be submitted and prioritized, but is
not a prerequisite for the PIP-scoped MS 0.2 framework unless explicitly promoted.

| Sequence | Issue | Weight | Depends on |
| --- | --- | ---: | --- |
| 1 | A01, A02, A04, A05 | 5, 3, 3, 5 | — |
| 2 | A03, A06 | 5, 5 | A01–A05 as applicable |
| 3 | A07, A08 | 5, 3 | A03–A06 |
| 4 | M01, M02 | 5, 5 | MS 0.2 delivery behavior stable |
| 5 | M03, M04, M09, M15, M16 | 5, 5, 3, 3, 3 | M01 and/or M02 |
| 6 | M05, M06, M07, M08 | 5, 5, 5, 5 | M01–M04 |
| Later | A09–A14, M10–M14 | see issue | stated dependencies |

---

# Milestone 0.2 — Alerts / Work Item 664

[A01 — Persist alert definitions and alert runs](A01%20—%20Persist%20alert%20definitions%20and%20alert%20runs.md)
---

## A02 — Define alert run outcomes and idempotency rules

**Suggested labels:** `Epic 10`, `MS 0.2`, `type::task`, `area::alerts`  
**Weight:** 3  
**Depends on:** A01

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

---

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

---

## A04 — Implement shared Role-based recipient resolution

**Suggested labels:** `Epic 10`, `MS 0.2`, `type::feature`, `area::alerts`  
**Weight:** 3  
**Depends on:** A01

### Feature brief

Create the shared service that resolves alert recipients by Role for use by all alert
implementations.

---

### Access control and users

The service operates under system alert configuration. It must not grant a future
administrator access to recipient data outside their allowed scope; that UI policy is
handled by A09–A12.

---

### Data collection

Return explicit resolved recipients and enough audit context to associate them with the
alert run, without copying unrelated recipient data into run history.

---

### Implementation scope

- Define a recipient-resolution interface and its Role-based input contract.
- Implement resolution and predictable handling of no recipients or invalid
  configuration.
- Add tests for valid Roles, no matching users, and role changes.

**Not included:** Department-scoped administration, recipient selection UI, or mail
transport behavior.

---

### Release strategy

Adopt the resolver in the DTS migration and subsequent registered alerts only after
tests demonstrate equivalent recipients.

---

### Sign-off

- Alerts resolve recipients through one shared service.
- Empty recipient resolution has an explicit, tested result.
- No alert implementation duplicates the Role lookup.

---

### Screenshots, design & docs

Document role input, recipient output, and empty-result semantics.

---

## A05 — Define the alert source and enrichment contract

**Suggested labels:** `Epic 10`, `MS 0.2`, `type::feature`, `area::alerts`  
**Weight:** 5  
**Depends on:** A01, A02

### Feature brief

Define the extension contract through which an alert obtains source records, enriches
them, and provides content data to the common runner.

---

### Access control and users

Not user-facing.

---

### Data collection

Specify what source/enrichment data may be retained in run context and what must remain
in its system of record.

---

### Implementation scope

- Define alert-specific source, enrichment, and content interfaces/value shapes.
- Make empty source results and enrichment failures map to A02 outcomes.
- Provide a DTS implementation as the reference consumer.
- Add contract tests for normal, empty, enrichment-failure, and partial-result cases.

**Not included:** a generic reporting data warehouse or additional legacy alert
migrations.

---

### Release strategy

Land the contract before A07 migrates the DTS alert to the common runner.

---

### Sign-off

- An alert can provide source/enriched content without reimplementing common execution.
- Empty, failed, and partial inputs produce the documented run outcomes.
- The DTS implementation proves the contract is usable.

---

### Screenshots, design & docs

Document the source-to-run-to-content data flow and allowed context fields.

---

## A06 — Integrate alert email intent and generic Mailable delivery

**Suggested labels:** `Epic 10`, `MS 0.2`, `type::feature`, `area::alerts`, `area::mail`  
**Weight:** 5  
**Depends on:** A02, A04, A05

### Feature brief

Connect the alert runner to email-intent creation, the generic alert Mailable, and
delivery-status integration without introducing a second alert delivery path.

---

### Access control and users

Not user-facing. It is used by the runner after recipient resolution.

---

### Data collection

Persist the alert's email intent and associate it with the alert/run context. Delivery
status remains in the email record; the run records execution outcome.

---

### Implementation scope

- Define the alert delivery request containing run context, resolved recipients,
  content/template data, and email-intent identity.
- Create/persist the intent and dispatch the generic alert Mailable through the
  existing delivery path.
- Map delivery failures and retry behavior to the A02 outcome contract.
- Add intent-backed, fallback, and failure-path integration tests.

**Not included:** general `App\\Mail` consolidation or changing the generic Mailable's
class identity; those belong to MS 0.3.

---

### Release strategy

Verify delivery using the existing Week 1 alert before switching all runner output to
this path.

---

### Sign-off

- Alert delivery persists an email intent and uses the generic alert Mailable.
- Delivery status is visible through the existing email lifecycle.
- Duplicate/retry rules prevent unintended duplicate alert sends.

---

### Screenshots, design & docs

Document the alert-run/email-intent relationship and delivery handoff.

---

## A07 — Migrate DTS Over $20K to the reusable alert framework

**Suggested labels:** `Epic 10`, `MS 0.2`, `type::feature`, `area::alerts`  
**Weight:** 5  
**Depends on:** A03, A04, A05, A06

### Feature brief

Move the Week 1 DTS Over $20K alert onto the reusable registry/runner/services while
preserving its business result and required legacy/reporting writes.

---

### Access control and users

No new user access model.

---

### Data collection

Continue required writes to `allrivers.alertTracking` and
`allrivers.dimReporting`; preserve the alert's existing source semantics and expected
results.

---

### Implementation scope

- Implement/register DTS using A05's source/enrichment contract.
- Use shared recipient resolution, run recording, intent creation, and delivery.
- Preserve `alert.dtsover20k` behavior and the Week 1 result set.
- Add before/after characterization or comparison coverage for recipients, content,
  delivery, and legacy writes.

**Not included:** the MS 0.3 concrete-DTS-Mailable identity change, unless separately
approved as an immediate compatibility requirement.

---

### Release strategy

Run the new path in a controlled verification mode, compare results with the existing
implementation, then switch the scheduled execution.

---

### Sign-off

- Expected alert results match the Week 1 implementation.
- Required legacy/reporting writes are preserved.
- DTS no longer recreates common framework behavior.

---

### Screenshots, design & docs

Attach comparison evidence and the registered-alert configuration.

---

## A08 — Complete the MS 0.2 end-to-end verification and review package

**Suggested labels:** `Epic 10`, `MS 0.2`, `type::task`, `area::quality`  
**Weight:** 3  
**Depends on:** A03–A07

### Feature brief

Produce the final evidence that the reusable alert framework satisfies work item 664
and is ready for review.

---

### Access control and users

Not user-facing.

---

### Data collection

Use representative test configurations and controlled DTS data. Do not use
production-only information in automated fixtures.

---

### Implementation scope

- Cover persistence, registry/runner, jobs/command, Role resolution, source/enrichment,
  run outcomes, duplicate handling, email intent/delivery, and legacy tracking.
- Verify successful, empty, failed, and partial-run paths.
- Produce a concise acceptance-criteria traceability checklist.

**Not included:** subsequent alert administration or MS 0.3 mail refactoring.

---

### Release strategy

Run this suite and review checklist before declaring MS 0.2 complete.

---

### Sign-off

- Every MS 0.2 acceptance criterion has test or review evidence.
- The framework is testable and reviewable without manual reconstruction of behavior.

---

### Screenshots, design & docs

Link the traceability checklist and test results.

---

## A09 — Define alert administration authorization and lifecycle policy

**Suggested labels:** `Epic 10`, `addendum`, `type::design`, `area::alerts`  
**Weight:** 5  
**Depends on:** A01, A04

### Feature brief

Define the product and authorization contract required before self-service alert
administration is implemented.

---

### Access control and users

Identify administrator roles, ownership, organizational scope, audit visibility, and
who may view configuration, resolved recipients, run history, and delivery history.

---

### Data collection

Define audit events and retention for create/update/delete, disable/enable, expiration,
recipient changes, and schedule/trigger changes.

---

### Implementation scope

- Produce the lifecycle/permission matrix.
- Define scoped CRUD, ownership transfer, and audit requirements.
- Specify how access to recipient and delivery data is separated.
- Define queued and in-flight semantics for disablement/expiration.

**Not included:** UI implementation or final schedule/trigger controls.

---

### Release strategy

Obtain product/security agreement before A10–A12 begin.

---

### Sign-off

- The permission and lifecycle matrix resolves the unknowns listed for this issue.
- MS 0.2 persistence/runner interfaces are sufficient or resulting gaps are recorded.

---

### Screenshots, design & docs

Deliver a short UX flow and authorization matrix.

---

## A10 — Implement scoped alert configuration CRUD and audit history

**Suggested labels:** `Epic 10`, `addendum`, `type::feature`, `area::alerts`  
**Weight:** 5  
**Depends on:** A09

### Feature brief

Provide authorized create, view, update, and delete operations for alert configuration,
with ownership and audit history enforced by the approved policy.

---

### Access control and users

Only authorized administrators act within their allowed operational scope.

---

### Data collection

Persist configuration changes and audit events. Do not make unrelated recipient or
delivery records broadly visible.

---

### Implementation scope

- Implement policy-backed CRUD endpoints/services and initial administration UI.
- Show ownership and relevant audit history.
- Add positive and bypass-attempt authorization tests.

**Not included:** recipient selection, disable/expiration controls, or schedule/trigger
editing.

---

### Release strategy

Release behind the approved permission model. Verify existing configured alerts remain
unchanged.

---

### Sign-off

- Authorized users can administer only in-scope configurations.
- Unauthorized direct requests are rejected.
- Audit history records required lifecycle changes.

---

### Screenshots, design & docs

Attach the configuration-list/detail design and authorization test evidence.

---

## A11 — Implement scoped recipient management and effective-recipient display

**Suggested labels:** `Epic 10`, `addendum`, `type::feature`, `area::alerts`  
**Weight:** 5  
**Depends on:** A09, A10

### Feature brief

Allow authorized administrators to configure Role/Department-constrained recipients and
view the resulting effective recipient set.

---

### Access control and users

Administrators may select only users/groups within their permitted organizational
scope; no automatic access to unrelated recipient data is granted.

---

### Data collection

Persist recipient policy/configuration, not a stale copy of each resolved recipient
list. Retain auditable changes.

---

### Implementation scope

- Implement policy validation for Role and Department constraints.
- Implement recipient-management UI/service and effective-recipient preview.
- Add permitted, rejected, and no-effective-recipient tests.

**Not included:** email delivery changes or broader identity/organization-model changes.

---

### Release strategy

Release after A04's resolver contract is stable; compare UI preview with actual
runtime resolution.

---

### Sign-off

- Invalid out-of-scope selections are blocked.
- Effective recipients are visible and agree with runtime resolution.
- Tests cover Role and Department constraints.

---

### Screenshots, design & docs

Attach the recipient editor/preview design and scope rules.

---

## A12 — Add alert disablement and expiration controls

**Suggested labels:** `Epic 10`, `addendum`, `type::feature`, `area::alerts`  
**Weight:** 3  
**Depends on:** A09, A10, A03

### Feature brief

Implement immediate disablement and optional timed expiration using the approved
queued/in-flight semantics.

---

### Access control and users

Only administrators authorized by A09 may change the lifecycle state.

---

### Data collection

Persist lifecycle state, expiration timestamp, actor, and audit events.

---

### Implementation scope

- Add disable/enable/expiration operations and runner enforcement.
- Ensure queued work and active execution follow the documented policy.
- Add lifecycle and authorization tests.

**Not included:** new schedule frequency controls or event-trigger configuration.

---

### Release strategy

Ship runner enforcement and administration control together so state is never
display-only.

---

### Sign-off

- A disabled/expired alert cannot create a new execution contrary to policy.
- Queued/in-flight behavior matches the approved semantics.
- Changes are auditable.

---

### Screenshots, design & docs

Attach lifecycle controls and state-transition behavior.

---

## A13 — Define and implement alert schedule and event-trigger configuration

**Suggested labels:** `Epic 10`, `addendum`, `type::feature`, `area::alerts`  
**Weight:** 5  
**Depends on:** A09, A10, A03

### Feature brief

Add administrator-facing polling schedule configuration with a deliberate granularity
decision and a stable extension point for future event-driven alerts.

---

### Access control and users

Only in-scope alert administrators may modify schedule or trigger configuration.

---

### Data collection

Persist schedule/trigger configuration separately from run history. Record audit
changes.

---

### Implementation scope

- Resolve scheduling granularity with product stakeholders.
- Implement the approved polling configuration and runner translation.
- Define, but do not necessarily implement, the event-driven trigger extension.
- Add schedule authorization, validation, and execution tests.

**Not included:** arbitrary cron input or a production event bus migration unless
separately approved.

---

### Release strategy

Release the configuration only after scheduler/runner validation proves it cannot
bypass lifecycle state or duplicate controls.

---

### Sign-off

- Frequency is configurable within the approved model.
- The event-trigger extension point is documented.
- Schedule changes are scoped, validated, and audited.

---

### Screenshots, design & docs

Attach schedule UI and the event-trigger extension contract.

---

## A14 — Assess reusable utilities and RabbitMQ for alert evolution

**Suggested labels:** `Epic 10`, `addendum`, `type::spike`, `area::architecture`  
**Weight:** 3  
**Depends on:** A03

### Feature brief

Evaluate extraction of useful BuildCentral utilities and RabbitMQ as a queue-system
option for future alert migrations.

---

### Access control and users

Not user-facing.

---

### Data collection

Collect dependency, ownership, operational, failure-mode, and migration-impact evidence
for each candidate.

---

### Implementation scope

- Inventory candidate utilities such as `Parseable` and `Sluggable`.
- Assess their extraction cost, test coverage, and NewRivers ownership.
- Assess RabbitMQ integration, operations, retry semantics, observability, and
  compatibility with current queue jobs.
- Produce a recommendation with a proposed follow-up or explicit decision not to act.

**Not included:** adoption of RabbitMQ or extraction of utilities.

---

### Release strategy

No production behavior changes occur in this spike.

---

### Sign-off

- Each option has a recommendation, rationale, risks, and estimated next step.
- No addendum work silently expands the MS 0.2 PIP deliverable.

---

### Screenshots, design & docs

Attach an options/trade-off note.

---

# Milestone 0.3 — Mail / Mailable consolidation

## M01 — Build the complete mail delivery matrix and select boundaries

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::design`, `area::mail`  
**Weight:** 5  
**Depends on:** MS 0.2 alert delivery behavior stable

### Feature brief

Inventory all `App\\Mail` classes and select the email-intent control center and
mail-hierarchy direction based on actual delivery behavior rather than rendering
similarity.

---

### Access control and users

Not user-facing. The matrix must identify authorization/permission dependencies.

---

### Data collection

For each mailable, record callers, envelope, recipients, queue, views/view data,
attachments, headers, failure behavior, `EmailMailable`/permission values, persisted
records, serialized jobs, and Graph paths.

---

### Implementation scope

- Classify each mailable: template-only, intent-aware, attachment/report,
  transactional/portal, or independently specialized.
- Inventory concrete Job and queue categories and their serialization/routing needs.
- Decide whether common behavior belongs in `AbstractMail`, narrow traits, or neither.
- Record the criteria for any later `EmailMailable` `UnitEnum` assessment.

**Not included:** deleting/replacing classes or changing persisted values.

---

### Release strategy

Treat the matrix as the gate for every subsequent refactor.

---

### Sign-off

- Every `App\\Mail` class has a caller and classification.
- The selected boundaries preserve meaningful specializations.
- Compatibility consumers are enumerated before migration work begins.

---

### Screenshots, design & docs

Attach the delivery matrix and ownership/hierarchy decision record.

---

## M02 — Add mailable and transport characterization coverage

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::task`, `area::quality`  
**Weight:** 5  
**Depends on:** M01

### Feature brief

Protect the externally observable mail and Graph behavior before consolidation.

---

### Access control and users

Not user-facing.

---

### Data collection

Use controlled fixtures to assert subject, sender/reply-to, recipients, views, view
data, headers, dedupe keys, attachments, queue selection, and intent outcomes.

---

### Implementation scope

- Add focused tests for representative mailables in each M01 classification.
- Cover existing-intent/header behavior and explicit fallback delivery-record behavior.
- Cover failed-intent transitions, queue serialization, permissions, and persisted
  value round trips where relevant.
- Baseline the MS 0.2 generic alert Mailable behavior as a compatibility boundary.

**Not included:** behavior-changing refactors.

---

### Release strategy

All subsequent migration tickets must retain or extend this coverage.

---

### Sign-off

- Test failures identify a changed observable contract.
- Both Graph paths and the alert Mailable boundary are characterized.

---

### Screenshots, design & docs

Link the test matrix to the delivery matrix.

---

## M03 — Introduce AbstractMail and the concrete DTS Over $20K Mailable

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::feature`, `area::mail`  
**Weight:** 5  
**Depends on:** M01, M02

### Feature brief

Make the generic alert base abstract as `AbstractMail` and introduce
`DtsOver20KAlertMail` as the concrete class owning the DTS subject, Blade/view name,
and documented view-data shape.

---

### Access control and users

Not user-facing.

---

### Data collection

Preserve the class identifiers and persisted values currently used by
`EmailMailable`, permissions, jobs, and `emails.mailable` until M08 migrates them.

---

### Implementation scope

- Extract shared envelope, queue, and attachment behavior into `AbstractMail`.
- Add the concrete DTS mailable and move DTS construction to it.
- Add tests for concrete DTS content and inherited shared behavior.
- Retain a deliberately compatible `GenericAlertMail` adapter where existing values
  or callers require it.

**Not included:** removal/migration of `EmailMailable::GenericAlert` values.

---

### Release strategy

Deploy compatibility adapter and concrete class together. Do not remove existing
identifiers in the same release.

---

### Sign-off

- DTS constructs the concrete mailable.
- Shared behavior remains in the abstract base.
- Existing persisted/queued/permission references remain valid.

---

### Screenshots, design & docs

Document the concrete-class versus adapter mapping.

---

## M04 — Establish the email-intent control-center contract

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::design`, `area::mail`  
**Weight:** 5  
**Depends on:** M01, M02

### Feature brief

Choose and document the one owner for email-intent metadata, lifecycle transitions,
transport headers, and failed-delivery behavior.

---

### Access control and users

Not user-facing.

---

### Data collection

Define intent type, dedupe identity, intent ID, header, and failure-transition data
that crosses Jobs, mailables, listeners, and Graph transport.

---

### Implementation scope

- Select the ownership model: intent-aware mailable with Job-created intent, or a
  dedicated mail-control abstraction.
- Define Graph's role as adapter: update supplied intent or create explicit fallback.
- Document the alert delivery request compatibility boundary from MS 0.2.
- Add architecture/contract tests for the selected owner.

**Not included:** migrating all mailables or changing generic template behavior.

---

### Release strategy

Land the contract before M05/M06; no parallel intent owner may be introduced.

---

### Sign-off

- One component owns the named intent responsibilities.
- Graph is not a competing source of intent creation.
- Alert delivery remains behaviorally compatible.

---

### Screenshots, design & docs

Publish the intent ownership map and header contract.

---

## M05 — Extract intent-aware behavior and migrate the first mailables

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::feature`, `area::mail`  
**Weight:** 5  
**Depends on:** M02, M04

### Feature brief

Implement the narrow `InteractsWithEmailIntent` trait (or approved equivalent) and
adopt it in the Billing Hold, DTS Tracker Assignment, and Item Type digest mailables.

---

### Access control and users

Not user-facing.

---

### Data collection

The trait builds the semantic email type, dedupe-key, and intent-ID headers and owns
the shared failed-intent transition.

---

### Implementation scope

- Define required mailable-supplied inputs: semantic type, dedupe identity, and intent.
- Implement header construction and `failed()` transition.
- Migrate the three named mailables only.
- Retain each concrete mailable's envelope and content logic.
- Run/extend characterization tests.

**Not included:** a broad base class or migration of template-only mail.

---

### Release strategy

Migrate one named class at a time behind its characterization tests.

---

### Sign-off

- Repeated intent behavior has one tested owner.
- Each migrated class preserves its existing observable behavior.
- No generic trait absorbs domain content or recipient logic.

---

### Screenshots, design & docs

Document the trait's narrow contract and adopter list.

---

## M06 — Generalize the template-only mail contract

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::feature`, `area::mail`  
**Weight:** 5  
**Depends on:** M01, M02, M04

### Feature brief

Create the explicit shared contract for template-only mail and migrate eligible callers
without flattening meaningful mailables.

---

### Access control and users

Not user-facing.

---

### Data collection

The contract accepts subject, view, view data, optional from/reply-to values, explicit
headers, and optional intent metadata only.

---

### Implementation scope

- Evolve the generic template Mailable or introduce a small factory/value object.
- Migrate only M01-classified template-only callers.
- Add/retain thin compatibility adapters for names referenced by enums, permissions,
  serialized jobs, persisted values, or external callers.
- Add contract tests.

**Not included:** attachment/report, portal, or recipient-calculating mailables.

---

### Release strategy

Adopt by caller category. Each category remains releasable and reversible while
adapters exist.

---

### Sign-off

- Template-only delivery uses a documented shared contract.
- Eligible callers migrate without an observable change.
- Compatibility adapters remain where required.

---

### Screenshots, design & docs

Document variation points and the adapter retirement criteria.

---

## M07 — Refactor verified shared behavior among specialized mailables

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::task`, `area::mail`  
**Weight:** 5  
**Depends on:** M01, M02

### Feature brief

Apply the M01 hierarchy decision to specialized mailables without forcing unrelated
attachment, report, FormRivers, transactional, or portal behavior into a common
constructor.

---

### Access control and users

Not user-facing.

---

### Data collection

Preserve domain-specific recipient calculations, signed links, report/attachment
sources, and transformed domain data.

---

### Implementation scope

- Identify only verified narrow shared behaviors.
- Extract typed traits or helpers with explicit contracts where justified.
- Keep concrete children for distinct construction/handling patterns.
- Add targeted tests for each approved extraction.

**Not included:** refactoring merely because classes share a subject/view pattern.

---

### Release strategy

Deliver one verified extraction at a time; defer classes with no stable common contract.

---

### Sign-off

- No broad inheritance tree obscures domain behavior.
- Every extraction has a documented consumer and tests.
- Specializations retain their behavioral contracts.

---

### Screenshots, design & docs

Update the hierarchy record with each approved trait/helper.

---

## M08 — Migrate mail compatibility values and retire adapters safely

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::feature`, `area::mail`, `area::data-migration`  
**Weight:** 5  
**Depends on:** M02, M03, M05, M06

### Feature brief

Deliberately migrate compatibility boundaries rather than deleting mail classes once
rendered content appears equivalent.

---

### Access control and users

Permission-code behavior must remain equivalent throughout the migration.

---

### Data collection

Track and migrate `EmailMailable` backed class strings, generated
`PermissionCode` cases, `emails.mailable` records, serialized queued jobs, and
external caller references.

---

### Implementation scope

- Create a compatibility inventory and migration order.
- Characterize/migrate `EmailMailable::GenericAlert` before retiring it.
- Persist `EmailMailable::DtsOver20KAlertMail` only when readers and queued work can
  consume it.
- Provide adapters and rollback boundaries; remove an adapter only after consumers and
  queued work are retired/drained.

**Not included:** converting `EmailMailable` to a `UnitEnum` (M09).

---

### Release strategy

Use additive deployment, migrate readers/producers, drain relevant queued work, then
remove compatibility code in a later release.

---

### Sign-off

- No known persisted or serialized value becomes unreadable.
- Permission derivation and Graph mapping remain correct.
- Adapter removal has documented evidence.

---

### Screenshots, design & docs

Attach legacy-to-new value mapping and rollback plan.

---

## M09 — Add source-assistable dynamic mail contracts

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::task`, `area::mail`  
**Weight:** 3  
**Depends on:** M01, M04

### Feature brief

Document dynamic mail values so source assistance and static analysis can identify
invalid class, view, recipient, header, and intent shapes before runtime.

---

### Access control and users

Not user-facing.

---

### Data collection

Annotate data at Jobs, mailables, listeners, and transport boundaries without changing
the persisted representation.

---

### Implementation scope

- Add `class-string`/bounded class-string annotations.
- Document required versus nullable metadata.
- Annotate Blade/view names, view-data arrays, headers, recipients, and intent arrays.
- Add focused static-analysis or contract tests where the project supports them.

**Not included:** a full typed-email-object migration (M10–M11).

---

### Release strategy

Land annotations incrementally with the owning contract, avoiding unrelated code churn.

---

### Sign-off

- Dynamic values crossing key boundaries have usable source-assistance annotations.
- No annotation masks an unresolved compatibility or ownership decision.

---

### Screenshots, design & docs

Link the public PHPDoc contracts from the delivery matrix.

---

## M10 — Define the typed email-object system and migration plan

**Suggested labels:** `Epic 10`, `addendum`, `type::design`, `area::mail`  
**Weight:** 5  
**Depends on:** M01, M02, M04

### Feature brief

Define the immutable typed-email boundary before broad caller migration.

---

### Access control and users

Not user-facing.

---

### Data collection

Map legacy array fields to `EmailAddress`, `Recipient`, `Recipients`, and any
message composite; define serialization and adapter forms for Laravel, Graph, and
persisted `Email` values.

---

### Implementation scope

- Document invariants: validation/canonicalization, display names, ordering,
  deduplication, and To/CC/BCC separation.
- Define allowed dependencies for value/composite types.
- Produce the legacy mapping, staged migration order, rollback boundary, and adapter
  ownership map.
- Decide whether a stable message composite is warranted.

**Not included:** changing production callers or queue payloads.

---

### Release strategy

Treat the approved design as a prerequisite for M11 and any later typed migration.

---

### Sign-off

- Every proposed public typed object has invariants and serialization rules.
- Legacy compatibility and rollback boundaries are explicit.
- The design does not make framework-managed Jobs/mailables readonly by assumption.

---

### Screenshots, design & docs

Deliver the ownership map and legacy-to-typed mapping table.

---

## M11 — Implement typed email values, adapters, and contract tests

**Suggested labels:** `Epic 10`, `addendum`, `type::feature`, `area::mail`  
**Weight:** 8  
**Depends on:** M10

### Feature brief

Implement the approved immutable email values and explicit adapters while preserving
existing array-based compatibility at the boundary.

---

### Access control and users

Not user-facing.

---

### Data collection

Typed values remain free of Eloquent, facades, transport clients, configuration reads,
and delivery side effects.

---

### Implementation scope

- Implement approved value/collection/composite objects.
- Add Laravel, Graph, and persisted-`Email` adapters.
- Add invalid-address, normalization, formatting, order/deduplication, display-name,
  and To/CC/BCC tests.
- Add round-trip tests proving equivalent envelope, headers, recipients, body,
  attachments, and persisted intent fields.

**Not included:** migration of every Job/mailable producer; migrate callers in bounded
follow-up issues after adapters prove stable.

---

### Release strategy

Introduce adapters additively. Preserve serialized queue payload compatibility until
all affected producers/consumers have migrated and relevant queues drain.

---

### Sign-off

- Typed values have no forbidden framework/transport dependencies.
- Adapter round trips preserve current externally observable behavior.
- Existing callers can continue through explicit compatibility adapters.

---

### Screenshots, design & docs

Update the typed-email contract with implemented adapters and examples.

---

## M12 — Add a concrete Loggable contract for email relations

**Suggested labels:** `Epic 10`, `addendum`, `type::feature`, `area::mail`  
**Weight:** 3  
**Depends on:** M01

### Feature brief

Make `emails.loggable` references predictably accessible through an explicit
`Loggable` contract where the referenced models share a stable logging behavior.

---

### Access control and users

Not user-facing.

---

### Data collection

Inventory current polymorphic types and their log data. Do not force an unrelated
model into the contract only to satisfy a type declaration.

---

### Implementation scope

- Determine the shared contract, including whether a trait-backed `log()` and
  model-provided `loggedAttributes()` is appropriate.
- Implement the interface/trait for qualifying models.
- Update relations/types and add tests for supported and unsupported model behavior.

**Not included:** a general audit-log redesign.

---

### Release strategy

Add the contract compatibly; migrate models one at a time.

---

### Sign-off

- Qualifying `emails.loggable` relations expose a predictable contract.
- No unsupported polymorphic model is misrepresented as Loggable.

---

### Screenshots, design & docs

Document adopted models and excluded models with rationale.

---

## M13 — Add data-model support for multiple email attachments

**Suggested labels:** `Epic 10`, `addendum`, `type::feature`, `area::mail`  
**Weight:** 5  
**Depends on:** M01, M02

### Feature brief

Enable an `emails` record to locate more than one `form_rivers_files` attachment
through an appropriate data-model relationship.

---

### Access control and users

Existing attachment authorization remains authoritative.

---

### Data collection

Design the relationship, likely via a pivot, and preserve existing one-attachment data.

---

### Implementation scope

- Select and migrate the relationship model.
- Provide model/query support for multiple attachments.
- Backfill or preserve existing attachment linkage.
- Add migration, relationship, and mail-attachment retrieval tests.

**Not included:** changing existing Mail Manager UI or operations that currently assume
one attachment.

---

### Release strategy

Use an additive/backfill-safe migration and retain existing attachment reads during the
transition.

---

### Sign-off

- An email record can resolve multiple attachments.
- Existing single-attachment records remain valid.
- No current UI behavior is expanded unintentionally.

---

### Screenshots, design & docs

Document schema change, backfill plan, and unchanged UI scope.

---

## M14 — Assess EmailMailable UnitEnum feasibility and adapters

**Suggested labels:** `Epic 10`, `addendum`, `type::spike`, `area::mail`  
**Weight:** 3  
**Depends on:** M01, M08

### Feature brief

Determine whether `EmailMailable` can become a `UnitEnum` after delivery-matrix and
persisted-data migration work is complete.

---

### Access control and users

Permission-code derivation is a compatibility boundary and must be assessed.

---

### Data collection

Evaluate the current class-string-backed database cast, dynamic permission derivation,
Graph header mapping, transport mapping, and serialized values.

---

### Implementation scope

- Produce an adapter design for class lookup, persistence, permission, and transport.
- Identify irreversible or high-risk migration points.
- Recommend adopt/defer/reject with evidence.

**Not included:** performing the enum conversion.

---

### Release strategy

No production behavior changes occur in this spike.

---

### Sign-off

- The decision accounts for every existing `EmailMailable` consumer.
- A follow-up conversion plan exists only if compatibility is demonstrably preserved.

---

### Screenshots, design & docs

Attach the decision record and adapter sketch.

---

## M15 — Resolve DTS related-record metadata semantics

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::spike`, `area::mail`  
**Weight:** 3  
**Depends on:** M01, M02

### Feature brief

Replace the DTS job's placeholder `POSubmission::class` related record with a
durable, truthful metadata strategy.

---

### Access control and users

Not user-facing.

---

### Data collection

Evaluate `App\\Models\\Datasync\\PMHubTracker`, including its non-integer key
contract, and whether a single tracker can truthfully represent a multi-tracker alert.

---

### Implementation scope

- Validate the tracker relation against real DTS alert composition.
- Adopt a tracker relation only if it is durable and unambiguous.
- Otherwise leave `related_type`/`related_id` null and record the alert/tracker
  list in typed context data.
- Add persistence and retrieval tests for the selected approach.

**Not included:** inventing a placeholder polymorphic relation.

---

### Release strategy

Do not change existing records until the selected representation has a safe migration
path.

---

### Sign-off

- DTS metadata is truthful for single- and multi-tracker alerts.
- Null related fields, if selected, are an intentional, documented state.

---

### Screenshots, design & docs

Attach the decision and example stored records.

---

## M16 — Persist the actual delivery mailer for queued email intents

**Suggested labels:** `Epic 10`, `MS 0.3`, `type::feature`, `area::mail`  
**Weight:** 3  
**Depends on:** M02, M04

### Feature brief

Record the configured active mailer when an email intent is queued and update it with
the child transport that actually succeeds when failover/round-robin selection occurs.

---

### Access control and users

Not user-facing.

---

### Data collection

Persist truthful mailer/transport audit data for `msgraph`, `smtp`, and local
MailPit use; do not hard-code `msgraph`.

---

### Implementation scope

- Read the configured active mailer during intent creation.
- Update the intent when the transport that succeeds is known.
- Cover SMTP/MailPit, Graph, and failover/round-robin behavior in tests.

**Not included:** changing transport selection policy.

---

### Release strategy

Deploy with backward-compatible field handling and verify audit output in local and
configured production-like transports.

---

### Sign-off

- Newly queued intents name the configured mailer.
- A successful child transport supersedes a parent failover/round-robin value where
  applicable.
- Local MailPit records are truthful.

---

### Screenshots, design & docs

Document initial versus actual transport values and update timing.

---

# Unknowns, conflicts, and required decisions

| Key | Related issue(s) | Question or dependency |
| --- | --- | --- |
| U01 | A01, A02 | What exact configuration fields, run retention, and error/context payload are required for `alerts` and `alert_runs`? |
| U02 | A02, A03, A06 | What defines duplicate eligibility: source record, alert/config revision, recipient set, time window, email intent, or a combination? |
| U03 | A03, A13 | What scheduler model and polling granularity are product-approved? Is cron expression input allowed or intentionally excluded? |
| U04 | A04, A09–A11 | Which Roles and Departments define both runtime recipient resolution and administrator scope? What is the authoritative organization source? |
| U05 | A05, A07 | What source/enrichment context may be persisted, and what data must stay only in upstream synchronized tables? |
| U06 | A06, A07, M03 | What current generic-alert Mailable and email-intent behavior is already deployed, and which parts are immutable compatibility boundaries? |
| U07 | A07 | What controlled comparison data/process will demonstrate DTS parity without duplicating production alert delivery? |
| U08 | A09–A13 | Who owns alert configuration, how long are audit records retained, and what exactly happens to queued/in-flight work when disabled or expired? |
| U09 | A14 | Are utility extraction and RabbitMQ evaluation intended as separate future decisions, and what operational constraints apply to RabbitMQ? |
| U10 | M01, M08, M14 | Which `EmailMailable`/permission values are persisted or externally referenced, and how long may queued payloads remain in flight? |
| U11 | M01, M07 | Which specialized mailables share verified stable behavior, versus only superficial similarity? |
| U12 | M03, M04 | Should Jobs create intents while mailables carry them, or should a dedicated mail-control service own the complete intent-to-send transition? |
| U13 | M10, M11 | What address canonicalization policy is required for case, internationalized domains, display names, ordering, and duplicate recipients? |
| U14 | M12 | Which current `emails.loggable` polymorphic types genuinely support a common logging contract? |
| U15 | M13 | What is the authoritative existing one-attachment relation and required backfill behavior? |
| U16 | M15 | Can one PMHubTracker truthfully represent every DTS alert, especially alerts with multiple tracker records? |
| U17 | M16 | How does the active mailer configuration expose the actual successful child transport for each supported failover/round-robin setup? |

