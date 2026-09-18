# Epic 10, milestone 0.2: Mailable consolidation

## Objective

Reduce duplicate `App\Mail` implementations without changing delivery, email-audit,
permission, or queueing behavior. Preserve dedicated mailables where their type conveys
meaningful behavior rather than merely selecting a subject and view.

## Findings to guide the work

`GenericAlertMail` already provides the fundamental template-mail contract: subject,
view, and view data. It is the natural base for mail sent by an alert that has no
additional behavior.

The following mailables have a second, repeated responsibility: they identify an
existing `Email` intent to the transport and mark that intent on failed delivery.

- `BillingHoldAlertMail`
- `DtsTrackerAssignmentMail`
- `ItemTypePendingReviewDigestMail`
- `ItemTypeSubmissionDecisionDigestMail`

That responsibility is distinct from the message-specific subject, view, and data.
It should be shared without forcing those messages into a common base class.

`EmailMailable` and the matching generated `PermissionCode` cases are compatibility
boundaries. Replacing a class is not safe solely because its rendered email is the
same: its enum value may be stored or used by authorization code. Existing class
names should therefore be retained as compatibility adapters until all consumers
are migrated deliberately.

The Microsoft Graph transport also has an important split in behavior. A mailable
with an email-intent header updates its existing `Email` row; one without it may use
the fallback delivery record creation path. Consolidation must make this choice
explicit rather than accidentally changing it.

Before consolidating, decide whether `App\\Mail` (potentially through a small abstract
parent) is the email control center rather than only a template/content provider. That
decision must assign one owner for intent metadata, lifecycle transitions, transport
headers, and delivery failure handling; it must not leave those responsibilities split
ambiguously between the Job, mailable, listeners, and Graph transport.

## Plan

### 1. Establish alert administration requirements and UX

The alert architecture must support authorized users administering alerts for their
own operational needs without granting unrestricted access to every alert, recipient,
or schedule. Define the permission and configuration model before building the
administrative UI.

The administration experience must support:

- creating, viewing, modifying, and deleting an alert configuration, with the
  configuration owner, permission requirement, and audit history visible;
- immediately disabling an alert and optionally setting an expiration time after which
  it is disabled automatically. Document how disable/expiration affects already queued
  work and any in-flight event;
- managing recipients with explicit Role and Department constraints. The UI must show
  the effective recipient set and prevent an administrator from selecting users or
  groups outside their permitted organizational scope;
- configuring recurring schedule frequency for polling-style alerts. Scheduling
  granularity is intentionally TBD and must remain a documented product decision, not
  an incidental cron implementation detail; and
- defining alert trigger criteria in a way that can later support event-driven,
  near-real-time alerts without requiring the administrator-facing configuration
  contract to be replaced.

Keep configuration state, authorization, recipient-resolution rules, and delivery
history separate. A user who can administer an alert is not automatically entitled to
view unrelated recipient data or delivery/audit records.

Add UX and authorization tests for every lifecycle action, scoped-recipient selection,
immediate disable, scheduled expiration, and attempts to bypass Role/Department
constraints. Document the initial scheduling granularity decision and the future
event-driven extension point.

### 2. Create a complete delivery matrix

For every class in `App\Mail`, record:

- direct caller(s), including jobs, services, commands, listeners, and notifications;
- envelope, recipients, queue, view and view-data contract;
- attachments, custom headers, and failed-delivery behavior;
- `EmailMailable`, permission, `Email`, and transport dependencies.

Mark each class as one of: template-only adapter, intent-aware notification,
attachment/report mail, transactional/portal mail, or independently specialized.
Do not remove an apparently unused class until code, enum, configuration, and queued
payload references have all been checked.

Also inventory the concrete Job and mail-queue categories now in use. Define enums for
the stable categories only after establishing their consumers, serialization needs, and
queue-routing semantics; do not replace queue names or Job class identity with an enum
where Laravel's serialized payload contract depends on them.

### 3. Add characterization coverage before refactoring

Add focused mailable tests that assert the externally observable contract:

- subject, sender/reply-to, recipients, view, and view data;
- custom transport headers and dedupe keys;
- attachment metadata and content source where applicable;
- queue selection and failed-intent state transitions for intent-aware mail.

Add transport-level coverage for both paths: an existing email intent identified by
headers and a mail without an intent that follows the fallback creation behavior.

### 4. Extract email-intent lifecycle behavior

Introduce a narrowly scoped trait, for example `InteractsWithEmailIntent`, that owns:

- construction of the email type, dedupe-key, and intent-ID headers; and
- the shared `failed()` transition for the associated `Email` intent.

Require each adopting mailable to supply its semantic email type, dedupe identity,
and intent. Keep envelope and content methods in the concrete mailable. Apply the
trait first to the Billing Hold, DTS Tracker Assignment, and Item Type digest
mailables, with their characterization tests protecting the refactor.

### 5. Generalize template-only delivery

Evolve the generic template-mail contract (or introduce a small factory/value object
beside it) to accept only the genuine variation points:

- subject, view, and view data;
- optional from/reply-to values;
- optional explicitly supplied headers; and
- optional email-intent metadata.

Migrate template-only callers to this contract. Where a class name is referenced by
`EmailMailable`, a permission case, serialized queue payload, or an external caller,
retain a deprecated thin adapter that delegates to the generic implementation until
the compatibility dependency is retired.

Document the selected control-center boundary here: either keep Jobs responsible for
creating intents and make mailables intent-aware delivery objects, or make a dedicated
mail-control abstraction own the complete intent-to-send transition. Graph must remain
an adapter that updates a supplied intent or creates an explicit fallback record, not a
second competing source of intent creation.

### 6. Keep meaningful specializations separate

Do not fold mailables into the generic path when they build attachments, calculate
recipients, create signed/portal links, render reports, or transform domain data.
For these, extract a trait only when there is a verified shared behavior with a small,
stable contract (for example, shared attachment construction). Avoid a broad mailable
inheritance tree.

### 7. Migrate and remove in safe increments

Migrate one category at a time, beginning with intent-aware mailables, then
template-only adapters. After each group:

- run the focused mailable and transport tests;
- confirm no changed `EmailMailable`/permission mappings or persisted values;
- verify both intent-backed and fallback transport behavior; and
- search callers, configuration, and queue payload references before deleting any
  compatibility adapter.

Delete a specialized mailable only when it has no remaining semantic behavior and no
compatibility consumer.

### 8. Make dynamic email contracts source-assistable

Use PHPDoc annotations wherever a value names code or a template dynamically. In
particular, annotate class references as `class-string` (or a bounded
`class-string<...>` where possible), identify nullable versus required metadata, and
document Blade/view names and the shape of their view data. Add equivalent array-shape
annotations for email context, headers, recipients, and intent data when those values
cross Job, mailable, listener, or transport boundaries. This is a source-assistance
requirement, not merely a static-analysis cleanup.

## _Addendum:_ formalize the typed email-object system

Revision ovpvkluw started the right direction with immutable `EmailAddress`,
`Recipient`, and `Recipients` objects. Expand that work deliberately into a small typed
object system for email construction, rather than allowing each Job, mailable, and
transport adapter to keep inventing array shapes.

### Typed-object boundary

- Keep value objects immutable, final, and free of Laravel facades, Eloquent models,
  transport clients, configuration reads, and delivery side effects.
- Make EmailAddress the single validated address value. Decide and document its
  canonicalization policy (trim, case handling, internationalized domains, and display
  preservation) before it replaces existing string inputs.
- Define a recipient collection contract that preserves order, rejects or documents
  duplicates, and distinguishes `To`, `CC`, and `BCC` at the message boundary.
  Do not make a plain string array the de facto API again after introducing `Recipients`.
- Introduce an immutable message/composite object only for stable message data:
  envelope addresses, subject, HTML body or view contract, headers, attachments, and
  email-intent identity. It must describe a message, not send it or mutate an Email
  lifecycle.
- Keep conversion to Laravel Address, mailable envelope/content objects, Microsoft
  Graph payloads, and persisted Email arrays in explicit adapters. These adapters are
  the compatibility boundary for existing queue payloads and EmailMailable values.

### Architecture and contract tests

Add architecture tests that enforce the boundary above:

- value/composite classes are final readonly where PHP and Laravel serialization
  permit it;
- typed email data depends only on allowed value-object/collection namespaces, never
  on App Models, facades, mail transport, queue, or HTTP clients;
- Jobs, mailables, and Graph adapters consume typed objects through documented
  conversion points rather than reaching into their internal arrays;
- value-object tests cover invalid addresses, normalization policy, formatting,
  recipient order/deduplication, nullable display names, and To/CC/BCC separation;
- round-trip tests verify that typed objects render the same envelope, headers,
  recipients, body, attachments, and persisted intent fields as the pre-migration
  array contracts.

Keep these tests focused on public behavior and dependency boundaries. Do not make
framework-managed queue Jobs or mailables readonly merely to satisfy an architecture
rule when Laravel must mutate their dispatch metadata.

### Documentation and migration artifacts

Before migrating callers, add a short typed-email contract document that includes:

- A class diagram or concise ownership map for value objects, the message composite,
  mailables, Jobs, Email, and Graph;
- Constructor/property invariants, serialization form, and adapter methods for every
  public typed object;
- A table mapping each legacy array field to its typed replacement and identifying the
  compatibility adapter that still accepts the legacy form;
- The staged migration order, rollback boundary, and the point at which compatibility
  adapters can be removed.

Migrate one caller category at a time behind these adapters. Preserve serialized queue
payload compatibility until queued work has drained and every known producer/consumer
has moved to the typed contract.

## Acceptance criteria

- Authorized users can create, modify, delete, disable, and set expiration for alert
  configurations only within their allowed administrative scope.
- Recipient selection and display enforce the configured Role/Department constraints,
  and tests cover both permitted and rejected selections.
- Polling schedule frequency is configurable with documented TBD granularity, while
  the trigger configuration has a documented event-driven extension path.
- Alert lifecycle, authorization, recipient-resolution, and delivery history have
  distinct ownership and auditable behavior.

- Every `App\Mail` class has a documented caller and classification.
- Repeated email-intent headers and failed-intent handling have one tested owner.
- Template-only mail delivery uses a shared, explicit contract.
- Specialized mailables remain only where they contain domain-specific behavior.
- Existing subjects, views, recipients, attachments, queue behavior, permissions,
  audit records, and Graph transport outcomes are preserved by tests.

## _Addendum:_ Additional tasks

### Apply a concrete Loggable type to the "loggable" models in `emails` table

- Create `Loggable` interface
- Determine if there is a common thread between these models (do they all have a `log()` method?)
- Update the polymorph relations to `Loggable` so a predictable type can be accessed.
- One possible log entry approach:
  - `Loggable::log()` implemented by a trait, used by the implementing models
  - The trait defines an abstract `loggedAttributes()` or something similar that the model must implement
  - `loggedAttributes()` is called by `log()`
  - The model provides the attributes to the trait
  - `log()` assembles the attributes into a normalized log entry and calls the `Logger`

### *(low-priority)* Fix Email Attachment support to allow > 1 file

- Refactor how `emails` and `form_rivers_files` connect, possibly through a pivot table.
- Enable the Mail Manager to attach multiple files.
- This change is _specifically_ to provide the **data support** for an `emails` record to find multiple attachments.
  - Enabling multiple attachments in UI components that currently expect only one is beyond this scope.
  - Implementing functionality to attach multiple files in existing operations is beyond this scope.

### Extract `Parseable`, `Sluggable`, etc. from BuildCentral

- A lot of useful utility code exists in BC that should be extracted for Alerts / Mail

### _Addendum:_ Look into RabbitMQ as the Queue system

#### https://www.rabbitmq.com
#### https://github.com/vyuldashev/laravel-queue-rabbitmq
