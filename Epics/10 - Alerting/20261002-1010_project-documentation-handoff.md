I need a handoff document with specifications of the new Alert and Email structure.
I'll have another agent process it into a comprehensive ERD, process flow, and developer documentation.

- Composite Alert entity (DB `alerts` + `config/alerts.php`)
- Queue tie-in
- Command and Dispatch and output forks
- All mechanics of processing the Alert
- Email handoff
- Email build
  - New structure's mechanics to construct and queue a Message
  - Show how the old structure's existing process still works
- Mailing Permissions
  - How the old/existing process applies permissions
  - How the new system preserves continuity
    - If Permission application has also changed structure, explain its improvements.
- Review the project architecture (not code review), mention anything I've overlooked.
  - If everything is covered, proceed.

## Legacy persistence and retry behavior

- Explain that the legacy collector's output is snapshotted locally in `alert_run_legacy_payloads`, with collection status and context recorded on `alert_runs`. A retry restores this snapshot instead of querying source systems again.
- Explain that the AllRivers `alert_run_legacy_receipts` row uses the run idempotency key and a payload hash to prevent duplicate or conflicting legacy writes. The receipt and the associated DTS state, `alertTracking`, and `dimReporting` writes share an AllRivers transaction.
- Call out that NewRivers and AllRivers are separate databases and do not share a transaction. The local snapshot and AllRivers receipt support recovery across that boundary; they do not make the two commits atomic.
- Distinguish the two migrations: `database/migrations/2026_09_29_000001_create_alert_run_legacy_payloads_table.php` is local, while `database/migrations/allrivers/2026_09_29_000000_create_alert_run_legacy_receipts_table.php` is deployed to AllRivers.

## Additional architecture points to cover

- Describe `--dry-run` as preview-only and `--test` as a full lifecycle run with a generated test recipient. A run still collects and records legacy state before delivery is skipped for having no eligible recipients.
- Trace the scheduled entry point in `routes/console.php`, due-schedule selection, locked schedule update, run creation, status transitions, failure handling, and the run/email idempotency keys.
- Separate email-view permissions from alert delivery recipients. `EmailType::permissionCode()` and `EmailAccessService` govern viewing persisted email records; alert distribution uses `alert_role_recipients`, assigned user roles, and the active ADP work-email check. Mention the preserved DTS email permission code for compatibility.
- Explain the queue boundary: persist an email intent before `Mail::queue()`, attach the intent ID to `BuiltMail`, and update intent/run snapshots from sending, sent, or failed events. Note where `afterCommit()` applies.
- Identify which behavior remains on legacy mailable/job paths and which uses the registry-driven Alert runner, so readers do not mistake the migration as a single cutover.
- Distinguish the separate legacy alert-audit verification and email flow from scheduled Alert dispatch, and state whether it is part of this documentation's scope.
- Note that `tests/Feature/Services/Alerts/AlertAuditVerificationServiceTest.php` is skipped; treat that as a coverage gap if the audit flow is in scope.

## Relevant project files

This tree lists the main implementation files and the project files that reference or exercise them. It excludes dependencies and generated files.

```text
.
├── app
│   ├── Application
│   │   └── EmailDashboard
│   │       └── EmailCollector.php
│   ├── Console
│   │   └── Commands
│   │       └── Alerts
│   │           ├── DispatchDueAlerts.php
│   │           ├── AlertAuditEmails.php
│   │           └── SendBillingHoldAlert.php
│   ├── DTO
│   │   ├── Alerts
│   │   │   ├── AlertDataConfig.php
│   │   │   ├── AlertDeliveryDefinition.php
│   │   │   ├── AlertMessageBoundary.php
│   │   │   ├── AlertPreview.php
│   │   │   ├── AlertRunOutcome.php
│   │   │   └── AlertSourceConfig.php
│   │   └── Email
│   │       ├── EmailAddress.php
│   │       ├── EmailBuildRequest.php
│   │       ├── Recipient.php
│   │       └── Recipients.php
│   ├── Enums
│   │   ├── Alerts
│   │   │   ├── AlertType.php
│   │   │   └── ScheduleType.php
│   │   ├── ProcessStatus.php
│   │   └── Email
│   │       ├── EmailFamily.php
│   │       ├── EmailStatus.php
│   │       └── EmailType.php
│   ├── Http
│   │   └── Middleware
│   │       ├── EmailDashboardAccess.php
│   │       └── EmailMessageAccess.php
│   ├── Jobs
│   │   ├── SendBillingHoldAlertJob.php
│   │   └── SendDtsTrackerAssignmentAlertJob.php
│   ├── Listeners
│   │   └── Email
│   │       ├── MarkIntentEmailSending.php
│   │       └── MarkIntentEmailSent.php
│   ├── Mail
│   │   ├── Builders
│   │   │   ├── MailBuilder.php
│   │   │   └── Alert
│   │   │       └── AlertMailBuilder.php
│   │   ├── BuiltMail.php
│   │   ├── AlertAuditVerifyMail.php
│   │   ├── DtsOver20kAlertMail.php
│   │   ├── GenericAlertMail.php
│   │   ├── Interfaces
│   │   │   └── TypedMailable.php
│   │   └── Transport
│   │       └── MicrosoftGraphTransport.php
│   ├── Models
│   │   ├── Alerts
│   │   │   ├── Alert.php
│   │   │   ├── AlertRun.php
│   │   │   └── AlertSchedule.php
│   │   ├── AlertAudit.php
│   │   ├── AlertAuditVerification.php
│   │   ├── AllRivers
│   │   │   ├── AlertTracking.php
│   │   │   ├── DimReporting.php
│   │   │   └── DtsOver14KAlert.php
│   │   ├── Datasync
│   │   │   └── AdpUser.php
│   │   ├── Email.php
│   │   ├── Permission.php
│   │   ├── Role.php
│   │   └── User.php
│   ├── Providers
│   │   ├── EventServiceProvider.php
│   │   └── MicrosoftGraphMailServiceProvider.php
│   ├── Queries
│   │   └── Dashboards
│   │       └── EmailSearchQuery.php
│   ├── Services
│   │   ├── Alerts
│   │   │   ├── AlertDeliveryPlanner.php
│   │   │   ├── AlertExecutionStrategyResolver.php
│   │   │   ├── AlertMessageDispatcher.php
│   │   │   ├── AlertMessageSnapshot.php
│   │   │   ├── AlertRecipientResolver.php
│   │   │   ├── AlertRunExecutionException.php
│   │   │   ├── AlertRunner.php
│   │   │   ├── AlertsRegistry.php
│   │   │   ├── Audit
│   │   │   │   └── AlertAuditVerificationService.php
│   │   │   ├── BoundaryPlanners
│   │   │   │   └── BroadcastAlertBoundaryPlanner.php
│   │   │   ├── Collectors
│   │   │   │   └── Legacy
│   │   │   │       └── DtsOver20kAlertCollector.php
│   │   │   ├── Formatters
│   │   │   │   └── DtsOver20kAlertDataFormatter.php
│   │   │   ├── Interfaces
│   │   │   │   ├── AlertBoundaryPlanner.php
│   │   │   │   ├── AlertCollector.php
│   │   │   │   ├── AlertEmailDataFormatter.php
│   │   │   │   ├── AlertExecutionStrategy.php
│   │   │   │   ├── AlertRunProcessor.php
│   │   │   │   └── LegacyAlertCollector.php
│   │   │   ├── Legacy
│   │   │   │   ├── AlertRunner.php
│   │   │   │   ├── AlertTracker.php
│   │   │   │   ├── LegacyAlertExecutionStrategy.php
│   │   │   │   └── RunProcessor.php
│   │   │   ├── NoopAlertCollector.php
│   │   │   ├── StandardAlertExecutionStrategy.php
│   │   │   └── UnknownAlertType.php
│   │   └── Email
│   │       ├── EmailAccessService.php
│   │       └── EmailService.php
│   ├── Support
│   │   └── Email
│   │       └── EmailMetadataResolver.php
│   └── View
│       └── Emails
│           ├── EmailView.php
│           └── Alerts
│               └── DtsOver20kAlert.php
├── config
│   └── alerts.php
├── database
│   ├── migrations
│   │   ├── 2026_01_24_001149_create_emails_table.php
│   │   ├── 2026_02_13_000001_add_email_intent_columns_to_emails_table.php
│   │   ├── 2026_09_22_000000_create_alerts_tables.php
│   │   ├── 2026_09_29_000001_create_alert_run_legacy_payloads_table.php
│   │   ├── 2026_09_30_120000_convert_email_mailable_to_email_type_enum.php
│   │   └── allrivers
│   │       └── 2026_09_29_000000_create_alert_run_legacy_receipts_table.php
│   └── seeders
│       ├── Alerts
│       │   ├── AbstractAlertSeeder.php
│       │   └── DtsOver20kAlertSeeder.php
│       ├── DatabaseSeeder.php
│       ├── EmailDashboardNavigationSeeder.php
│       └── EmailPermissionsSeeder.php
├── resources
│   └── views
│       └── emails
│           ├── alert-audit
│           │   └── review.blade.php
│           └── alerts
│               └── dts-over-20k.blade.php
├── routes
│   ├── console.php
│   └── web.php
└── tests
    ├── Feature
    │   ├── Console
    │   │   └── Alerts
    │   │       └── DispatchDueAlertsTest.php
    │   ├── Models
    │   │   └── AllRivers
    │   │       └── AlertTrackingTest.php
    │   ├── Email
    │   │   └── EmailServiceTest.php
    │   ├── Jobs
    │   │   ├── PMHub
    │   │   │   └── SendDtsTrackerAssignmentAlertJobTest.php
    │   │   └── SendBillingHoldAlertJobTest.php
    │   ├── Listeners
    │   │   └── Email
    │   │       └── MarkIntentEmailSendingTest.php
    │   ├── Mail
    │   │   └── MicrosoftGraphTransportTest.php
    │   ├── Queries
    │   │   └── Dashboards
    │   │       └── EmailSearchQueryTest.php
    │   └── Services
    │       └── Alerts
    │           ├── AlertRecipientResolverTest.php
    │           ├── AlertRunnerDeliveryPlanTest.php
    │           ├── AlertAuditVerificationServiceTest.php
    │           └── DtsOver20KAlertCollectorTest.php
    └── Unit
        ├── Alerts
        │   ├── AbstractAlertSeederTest.php
        │   ├── AlertDeliveryPlannerTest.php
        │   ├── AlertsRegistryTest.php
        │   └── LegacyAlertTrackerTest.php
        ├── Application
        │   └── Email
        │       ├── EmailFamilyTest.php
        │       └── EmailTypeTest.php
        └── Models
            └── Alerts
                └── AlertScheduleTest.php
```
