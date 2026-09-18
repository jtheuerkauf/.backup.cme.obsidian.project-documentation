# Epic 10, milestone 0.2: mailable consolidation

## Objective

Reduce duplicate `App\\Mail` implementations without changing delivery, email-audit,
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

## Plan

### 1. Create a complete delivery matrix

For every class in `App\\Mail`, record:

- direct caller(s), including jobs, services, commands, listeners, and notifications;
- envelope, recipients, queue, view and view-data contract;
- attachments, custom headers, and failed-delivery behavior;
- `EmailMailable`, permission, `Email`, and transport dependencies.

Mark each class as one of: template-only adapter, intent-aware notification,
attachment/report mail, transactional/portal mail, or independently specialized.
Do not remove an apparently unused class until code, enum, configuration, and queued
payload references have all been checked.

### 2. Add characterization coverage before refactoring

Add focused mailable tests that assert the externally observable contract:

- subject, sender/reply-to, recipients, view, and view data;
- custom transport headers and dedupe keys;
- attachment metadata and content source where applicable;
- queue selection and failed-intent state transitions for intent-aware mail.

Add transport-level coverage for both paths: an existing email intent identified by
headers and a mail without an intent that follows the fallback creation behavior.

### 3. Extract email-intent lifecycle behavior

Introduce a narrowly scoped trait, for example `InteractsWithEmailIntent`, that owns:

- construction of the email type, dedupe-key, and intent-ID headers; and
- the shared `failed()` transition for the associated `Email` intent.

Require each adopting mailable to supply its semantic email type, dedupe identity,
and intent. Keep envelope and content methods in the concrete mailable. Apply the
trait first to the Billing Hold, DTS Tracker Assignment, and Item Type digest
mailables, with their characterization tests protecting the refactor.

### 4. Generalize template-only delivery

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

### 5. Keep meaningful specializations separate

Do not fold mailables into the generic path when they build attachments, calculate
recipients, create signed/portal links, render reports, or transform domain data.
For these, extract a trait only when there is a verified shared behavior with a small,
stable contract (for example, shared attachment construction). Avoid a broad mailable
inheritance tree.

### 6. Migrate and remove in safe increments

Migrate one category at a time, beginning with intent-aware mailables, then
template-only adapters. After each group:

- run the focused mailable and transport tests;
- confirm no changed `EmailMailable`/permission mappings or persisted values;
- verify both intent-backed and fallback transport behavior; and
- search callers, configuration, and queue payload references before deleting any
  compatibility adapter.

Delete a specialized mailable only when it has no remaining semantic behavior and no
compatibility consumer.

## Acceptance criteria

- Every `App\\Mail` class has a documented caller and classification.
- Repeated email-intent headers and failed-intent handling have one tested owner.
- Template-only mail delivery uses a shared, explicit contract.
- Specialized mailables remain only where they contain domain-specific behavior.
- Existing subjects, views, recipients, attachments, queue behavior, permissions,
  audit records, and Graph transport outcomes are preserved by tests.

## Addenda

### Additional tasks

#### Apply a concrete Loggable type to the "loggable" models in `emails` table

- Create `Loggable` interface
- Determine if there's a common thread between these models (do they all have a `log()` method?)
- Update the polymorph relations to `Loggable` so a predictable type can be accessed.

#### *(low-priority)* Fix Email Attachment support to allow > 1 file

- Refactor how `emails` and `form_rivers_files` connect, possibly through a pivot table
- Give new Mail Manager the actual ability to attach multiple files

#### Extract `Parseable`, `Sluggable`, etc. from BuildCentral

- There's a lot of useful utility code in BC that should be extracted for Alerts / Mail
#### Look into RabbitMQ as the Queue system

