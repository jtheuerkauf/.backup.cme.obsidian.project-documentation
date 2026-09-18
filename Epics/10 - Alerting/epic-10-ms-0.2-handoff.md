# Epic 10 milestone 0.2: plan handoff

## Purpose

This document hands off the current planning discussion for
`epic-10-ms-0.2.md`. It records the intended scope, decisions that still need to be
made before implementation, and the recommended division into two closely coupled
milestones.

## Current milestone: email delivery foundation

Milestone 0.2 should establish a dependable, source-assistable email delivery
foundation without changing existing delivery, audit, permission, or queue behavior.
Its primary work is:

- inventory and classify every `App\Mail` class and its callers;
- characterize external behavior before refactoring, including envelope, recipients,
  headers, attachments, queueing, intent lifecycle, and Graph outcomes;
- make one owner responsible for email-intent metadata and state transitions;
- share repeated intent-aware behavior through a narrow trait, while retaining
  meaningful specialized mailables;
- consolidate genuinely template-only mail around an explicit generic contract;
- formalize immutable, typed email values and message data with explicit Laravel,
  Microsoft Graph, and persisted-`Email` adapters; and
- preserve compatibility for `EmailMailable`, generated permissions, serialized
  queue payloads, legacy arrays, and persisted values until migrations are complete.

The plan also collects related but separately scoped follow-up investigations:
`Loggable` typing for email polymorphic relations, data-model support for multiple
attachments, extraction of general utilities from BuildCentral, and RabbitMQ queue
evaluation. These must not silently expand the core consolidation refactor.

## Alert administration requirements now captured

The plan now explicitly requires a user-facing administration capability for Alerts:

- authorized users can create, view, modify, and delete alert configurations only
  within their administrative scope;
- alerts can be disabled immediately or automatically on optional expiration, with
  queued and in-flight behavior documented;
- recipient management is constrained by Role and Department, with the effective
  recipient set visible to the administrator;
- polling schedule frequency is configurable, while scheduling granularity remains a
  deliberate TBD product decision; and
- trigger configuration can later support near-real-time event-driven alerts without
  replacing the administrator-facing configuration contract.

Configuration state, authorization, recipient-resolution rules, and delivery history
must stay independently owned and auditable. The plan requires UX and authorization
tests for lifecycle operations, scoped recipient selection, disablement, expiration,
and attempts to bypass organizational constraints.

## Recommended milestone boundary

Treat this as two milestones with a deliberate handoff, not one combined delivery.

| Milestone | Owns | Does not own |
| --- | --- | --- |
| Epic 10 MS 0.2 — Email delivery foundation | Typed email/message contracts, mailables, intent lifecycle, transport adapters, compatibility, characterization and architecture tests | Alert configuration UI, alert-specific authorization policy, scheduling UI, or trigger execution |
| Follow-on milestone (suggested: Epic 10 MS 0.3 — Alert Administration) | Alert configuration CRUD/lifecycle, scoped recipient administration, RBAC/audit UI, scheduling, and event-trigger evolution | A second email envelope, delivery-intent, or transport implementation |

The alert-administration requirements should remain in the current plan as the
requirements and design boundary that protect the foundation work. Their implementation
should be scheduled as the follow-on milestone, so the mailable consolidation is not
blocked by product choices about administration UX or scheduler granularity.

## Required interface between the milestones

The administration milestone should resolve an alert configuration into explicit,
typed delivery inputs:

1. a trigger/result describing why the alert is eligible to send;
2. an authorized, effective recipient policy and resolved To/CC/BCC recipients;
3. an applicable schedule or event-trigger context;
4. alert content/template data and any delivery-intent identity; and
5. auditable configuration and delivery references.

It then hands that request to the MS 0.2 email delivery foundation. The foundation
must consume those explicit inputs and own message construction, intent lifecycle, and
transport dispatch. It must not reach back into alert configuration or invent
alert-specific authorization behavior.

Conversely, MS 0.3 must use the typed recipient, message, intent, and adapter
contracts supplied by MS 0.2. It must not introduce an alternative array-shaped
envelope, direct Graph integration, or a separate delivery-history model. This is the
key coupling and the reason to define the handoff early.

## Decisions and verification for the next agent

Before implementation, the next agent should:

- produce the complete delivery matrix and select the email-intent control-center
  owner before extracting any shared behavior;
- define typed-object invariants, serialization, legacy-array mapping, adapters, and
  migration/rollback boundaries before moving callers;
- resolve the product decision for scheduling granularity with the appropriate
  stakeholders rather than encoding a cron interval accidentally;
- specify alert administration roles, department scoping, ownership, audit retention,
  recipient visibility, and the semantics of disabling or expiring queued/in-flight
  alerts;
- document the versioned delivery-request contract between alert administration and
  the email foundation; and
- add characterization, architecture, UX, authorization, and transport tests at the
  point each corresponding contract is introduced.

The existing acceptance criteria in `epic-10-ms-0.2.md` should be separated during
execution: email-foundation criteria belong to MS 0.2; administration lifecycle,
recipient-scope, scheduling, and event-trigger criteria belong to MS 0.3.
