# Epic 10, milestone 0.3: Mail / Mailable consolidation

## Objective

Reduce duplicated `App\Mail` implementations without changing delivery, email-audit,
permission, queueing, or transport behavior. Preserve dedicated mailables when their
type conveys real domain behavior rather than merely choosing a subject and view.

MS 0.2 supplies the alert framework and generic alert Mailable. MS 0.3 improves the
general email-delivery architecture around that established behavior; it must not
create a competing alert delivery, intent, or history path.

## Planned scope

### 1. Inventory the delivery surface

For every class in `App\Mail`, document its direct callers, envelope, recipients,
queue, views/view data, attachments, headers, failed-delivery behavior, and
`EmailMailable`, permission, `Email`, and Graph dependencies. Classify each as a
template-only adapter, intent-aware notification, attachment/report mail,
transactional/portal mail, or independently specialized mailable.

Also inventory concrete Job and mail-queue categories. Introduce enums only for stable
categories after confirming their consumers, serialization needs, and routing
semantics; do not replace Laravel queue names or Job identity where serialized payload
compatibility depends on them.

### 2. Characterize behavior before refactoring

Add focused mailable tests for subjects, sender/reply-to values, recipients, views,
view data, custom headers, dedupe keys, attachments, queue selection, and failed-intent
state transitions. Add transport coverage for both an existing email intent identified
by headers and a mail that follows the explicit fallback delivery-record path.

### 3. Establish the email-intent control center

Choose one owner for intent metadata, lifecycle transitions, transport headers, and
failed-delivery handling. The boundary may be intent-aware mailables with Jobs creating
the intent, or a dedicated mail-control abstraction owning the intent-to-send
transition. In either case, Microsoft Graph is an adapter that updates a supplied
intent or creates an explicit fallback record; it is not a competing source of intent
creation.

### 4. Extract repeated intent-aware behavior

Introduce a narrow trait, such as `InteractsWithEmailIntent`, that builds the email
type, dedupe-key, and intent-ID headers and performs the shared `failed()` transition.
Each adopting mailable supplies its semantic email type, dedupe identity, and intent;
concrete mailables retain their envelope and content methods. Start with the Billing
Hold, DTS Tracker Assignment, and Item Type digest mailables, protected by their
characterization tests.

### 5. Generalize template-only delivery

Evolve the generic template-mail contract, or introduce a small companion
factory/value object, around only the genuine variation points: subject, view, view
data, optional from/reply-to values, explicitly supplied headers, and optional
email-intent metadata.

Migrate template-only callers to that contract. Retain deprecated thin adapters when
a class name is referenced by `EmailMailable`, generated permissions, serialized queue
payloads, persisted values, or an external caller, until the compatibility dependency
is deliberately retired.

### 6. Preserve meaningful specializations

Do not fold mailables into the generic path when they calculate recipients, create
signed/portal links, render reports, build attachments, or transform domain data.
Extract a trait only for verified shared behavior with a small, stable contract; avoid
a broad mailable inheritance tree.

### 7. Migrate safely and document dynamic contracts

Migrate one category at a time, beginning with intent-aware mailables and then
template-only adapters. After each group, run focused tests, verify both transport
paths, confirm preserved `EmailMailable`/permission mappings and persisted values, and
search callers, configuration, and queue payload references before deleting a
compatibility adapter.

Use PHPDoc annotations wherever values name code or templates dynamically:
`class-string` references, nullable versus required metadata, Blade/view names, view
data shapes, headers, recipients, and intent data crossing Jobs, mailables, listeners,
or transport boundaries.

## Acceptance criteria

- Every `App\Mail` class has a documented caller and classification.
- Repeated email-intent headers and failed-intent handling have one tested owner.
- Template-only mail delivery uses a shared, explicit contract.
- Specialized mailables remain only where they contain domain-specific behavior.
- Tests preserve subjects, views, recipients, attachments, queue behavior,
  permissions, audit records, and intent-backed/fallback Graph outcomes.
- Existing class names, enum/permission mappings, serialized queue payloads, and
  persisted values remain supported until the appropriate migration is complete.

## Revisit of milestone 0.2 alert compatibility

Treat the MS 0.2 generic alert Mailable, alert delivery request, email intent, and
delivery-status integration as compatibility boundaries. Internal Mail changes may
improve typed contracts and adapters, but must preserve the alert runner's observable
behavior and must not introduce a second alert envelope, direct Graph integration, or
parallel delivery-history model.

## Addendum: Typed email-object system - high importance

Immutable `EmailAddress`, `Recipient`, `Recipients`, and message-value contracts would
make both alert and general mail delivery safer to evolve. This is important support
for MS 0.3, but it should be deliberately staged rather than silently bundled into
the first consolidation change.

Before migrating callers, document value invariants, serialization, Laravel/Graph/
persisted-`Email` adapters, legacy-array mappings, migration order, and rollback
boundaries. Add value-object, round-trip, and architecture tests that keep typed data
free of Laravel facades, Eloquent models, transport clients, queues, and delivery side
effects. Preserve serialized queue-payload compatibility until queued work drains and
all known producers and consumers have migrated.

## Addendum: Loggable typing for `emails.loggable` - important

Evaluate a `Loggable` interface/trait for models referenced by the `emails` polymorph
relation. This can improve predictable audit access, but it is independent of the
core delivery and intent consolidation.

## Addendum: Multiple email-attachment data support - important

Evaluate a data-model change, potentially a pivot between `emails` and
`form_rivers_files`, so an email record can locate more than one attachment. This is
data support only; extending existing UI or operations that assume a single attachment
is not included.

## Addendum: Concrete alert identity and mail hierarchy - milestone 0.3

### DTS alert identity

- Make the generic alert base abstract. The target name is `AbstractMail`; retain a
  deliberately compatible adapter only if persisted enum values, queued payloads, or
  external callers still name `GenericAlertMail`.
- Introduce `DtsOver20KAlertMail` as the concrete DTS mailable. It owns the DTS
  subject, Blade/view name, and documented view-data shape; shared envelope, queue,
  and attachment behavior remains in the abstract base.
- Replace DTS construction of `GenericAlertMail` with the concrete DTS mailable.
  Persist the concrete `EmailMailable::DtsOver20KAlertMail` identifier rather than a
  generic template identifier.
- Characterize and migrate the existing `EmailMailable::GenericAlert` persisted value
  before removal. The enum's backed class-string values, generated `PermissionCode`
  cases, existing `emails.mailable` records, and serialized jobs are compatibility
  boundaries.

### Related-record metadata

- Remove the DTS job's placeholder `POSubmission::class` relation. It is invalid when
  `related_id` is null and is not derived from the alert data.
- Evaluate a tracker relation using the existing `App\Models\Datasync\PMHubTracker`
  model and its non-integer key contract. Adopt it only if one durable tracker record
  can represent a multi-tracker alert; otherwise leave both `related_type` and
  `related_id` null and use the alert/tracker list in typed `context` data.
- Persist the configured active mailer for a newly queued intent (`msgraph`, `smtp`,
  and so on), rather than hard-coding `msgraph`. This preserves local MailPit audit
  truth when the default mailer is SMTP. Where a failover/round-robin mailer selects a
  child transport after intent creation, update the value from the transport that
  actually succeeds.

### Mail hierarchy assessment and migration

- Complete the all-`App\Mail` delivery matrix before choosing the final base class.
  The existing classes span template-only mail, intent-aware notifications,
  attachment/report mail, FormRivers mail, and portal mail; a single constructor or
  inheritance contract must not erase those distinctions.
- If common behavior is only envelope/content/queue plumbing, keep it in
  `AbstractMail`. If independently specialized classes share only narrow behavior,
  extract typed traits with explicit contracts instead of forcing them into a broad
  base class. Keep concrete children for every distinct construction or handling
  pattern.
- Assess converting `EmailMailable` to a `UnitEnum` only after the delivery matrix and
  persisted-data migration are complete. A `UnitEnum` cannot directly replace the
  current class-string-backed database cast, dynamic permission derivation, or Graph
  header/transport mapping; provide explicit class and persistence adapters first.
- Add characterization, persistence round-trip, queue-serialization, permission,
  Graph intent/fallback, and concrete-DTS-mailable tests before migrating values or
  deleting compatibility classes.
