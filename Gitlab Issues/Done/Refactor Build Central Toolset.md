---
id: 195035720
title: Refactor Build Central Toolset
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/449
project: cme-corp/newrivers#449
---

### Refactor Build Central Toolset
##### Due on 

Describe the new feature and what it will do briefly
---------------
  Build a Laravel 12 implementation in newrivers for the BuildCentral integration currently living in allrivers app. This includes replacing the existing sync process that ingests BuildCentral project data into datasync.buildCentralProjects and
  replacing the current rough internal review/search interface with a maintainable NewRivers UI.

  The new feature will:

  - Sync BuildCentral project data on a scheduled basis
  - Normalize and persist project records for internal use
  - Provide an internal interface to search, filter, and review BuildCentral projects
  - Support the current account-matching/review workflow now handled in the legacy interface
  - Create a clear cutover path away from the legacy scripts and UI
------------------
  Access control and who will be using it?
---------------------
  This should be an internal-only feature in NewRivers.

  Expected users:

  - Sales and business development users reviewing BuildCentral opportunities
  - Operations/admin users supporting data review and troubleshooting
  - Developers/IT for support, monitoring, and maintenance

  Access should be restricted to authenticated internal users with role-based permission to view BuildCentral data and, if needed, a narrower permission for any matching/review actions.
---------------------
  Data collection- is the data synthesized from other sources or created by the feature?
---------------------
  The primary data is synthesized from external and internal sources rather than created manually by end users.

  Sources include:

  - BuildCentral API project/report data
  - Existing internal database storage in datasync.buildCentralProjects
  - Internal Salesforce-related account data used for match suggestions/review

  The feature will ingest, normalize, store, and present this data in NewRivers. Some workflow metadata may be created by the feature if we add review status, assignment, or audit history as part of the refactor.
---------------------
  Release strategy? Outside of the code being put into production what else needs to happen?
---------------------
  Release should be handled as a staged migration rather than a same-day replacement.

  Required steps outside production deploy:

  - Confirm BuildCentral credentials/configuration are available in NewRivers
  - Define and run any required database migrations
  - Validate field mapping and sync parity against the legacy script
  - Confirm scheduler/queue configuration for recurring sync jobs
  - UAT with internal users on search, filtering, detail view, and account match workflow
  - Validate any downstream dependency that currently relies on datasync.buildCentralProjects
  - Decide cutover timing from the legacy interface and legacy sync job
  - Prepare rollback plan in case sync parity or workflow parity is not met
  - Communicate release and workflow changes to the internal users
---------------------
  Who needs to sign off on it prior to its release?
---------------------
  Recommended sign-off:

  - Product/business owner for BuildCentral workflow
  - Sales or business development stakeholder(s) who use the interface
  - Technical owner for NewRivers / Laravel implementation
  - Any stakeholder responsible for Salesforce-side downstream usage, if that dependency remains in scope
  - QA/UAT confirmation from the internal users validating parity and usability
---------------------
  Relevant screenshots, design, or supporting documentation?
---------------------
  Relevant legacy references:

  - Legacy sync: allrivers/syncJobs/buildCentral/syncProjects.php
  - Shared helper/API logic: allrivers/syncJobs/buildCentral/buildCentralHelper.php
  - Legacy review/search interface: allrivers/syncJobs/buildCentral/buildCentralTest.php
  - Legacy downstream dependency: allrivers/syncJobs/salesforce/updateSFProjects.php
---------------------
  Supporting notes:
---------------------
  - Current primary storage table is datasync.buildCentralProjects
  - The legacy interface appears to be the “rough” BuildCentral review tool being replaced in NewRivers
  - Screenshots of the current interface and any desired NewRivers mockups should be attached to this parent ticket before implementation begins

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/449)
