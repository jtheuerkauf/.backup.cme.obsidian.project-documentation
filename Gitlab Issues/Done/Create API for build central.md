---
id: 195036111
title: Create API for build central
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/451
project: cme-corp/newrivers#451
---

### Create API for build central
##### Due on 

-----------
  Describe the new feature and what it will do briefly
-----------

Create an internal API in NewRivers for the BuildCentral integration. This API will ingest BuildCentral project data, normalize and persist it, and expose endpoints for the NewRivers interface to search, filter, review, and retrieve BuildCentral
  project records. It should also support the existing account-matching/review workflow currently handled by the legacy BuildCentral tooling.

-----------
  Access control and who will be using it?
-----------
This should be an internal-only API.

  Expected users/consumers:

  - Internal NewRivers UI for BuildCentral search and review
  - Authenticated internal users in sales and business development
  - Operations/admin users supporting data review and troubleshooting
  - Developers/IT for support and maintenance

  Access should be restricted to authenticated internal users and internal application consumers. Role-based permissions should control who can view BuildCentral data, with narrower permissions for any match/review or status-update actions.

-----------
  Data collection- is the data synthesized from other sources or created by the feature?
-----------

  The API primarily works with synthesized data rather than user-created data.

  Sources include:

  - BuildCentral API project/report data
  - Existing internal storage currently represented in datasync.buildCentralProjects
  - Internal Salesforce-related account data used for match suggestions/review

  The feature will ingest, normalize, store, and return this data through API endpoints. If review workflow state is included, the API may also create internal metadata such as review status, assignment, notes, or audit history.

-----------

  Release strategy? Outside of the code being put into production what else needs to happen?
  Release should be staged and validated before legacy cutover.
-----------
  Required steps outside production deploy:

  - Confirm BuildCentral credentials/configuration are available in NewRivers
  - Define and run required database migrations
  - Finalize endpoint contract for the NewRivers frontend and any internal consumers
  - Validate field mapping and sync parity against the legacy BuildCentral sync process
  - Confirm scheduler/queue configuration for recurring sync jobs if API-triggered sync is included
  - UAT for API-backed search, filtering, detail retrieval, and account match workflow
  - Validate any downstream dependency currently tied to datasync.buildCentralProjects
  - Decide cutover timing from the legacy sync/scripts and legacy review interface
  - Document API authentication, permissions, and expected response structure
  - Prepare rollback plan if parity or workflow support is incomplete

-----------

  Who needs to sign off on it prior to its release?
  Recommended sign-off:

  - Product/business owner for the BuildCentral workflow
  - Sales/business development stakeholder(s) using the workflow
  - Technical owner for NewRivers / Laravel implementation
  - Any stakeholder responsible for Salesforce-side downstream dependencies
  - QA/UAT confirmation from internal users validating parity and usability

-----------
Relevant screenshots, design, or supporting documentation?
  Current BuildCentral references:

  - Current sync job: \\wsl$\Ubuntu-22.04\var\www\html\allrivers\syncJobs\buildCentral\syncProjects.php
  - Legacy shared helper/API logic: allrivers/syncJobs/buildCentral/buildCentralHelper.php
  - Legacy review/search interface: allrivers/syncJobs/buildCentral/buildCentralTest.php
  - Legacy downstream dependency: allrivers/syncJobs/salesforce/updateSFProjects.php

  Relevant current NewRivers API examples to review before implementation:

  - Route structure and internal protected API patterns in routes/api.php:1
  - Internal token issuance and Sanctum authentication in app/Http/Controllers/Api/AuthenticationController.php:1
  - List/detail/action endpoint pattern in app/Http/Controllers/Api/POSubmissionApiController.php:1
  - Search endpoint pattern in app/Http/Controllers/Api/CpqProductUploadController.php:1
  - Validation and external integration response pattern in app/Http/Controllers/Api/SalesForceVendorController.php:1
  - Multi-service decisioning endpoint pattern in app/Http/Controllers/Api/WarehouseRouterApiController.php:1

  Examples from the current codebase that should inform the BuildCentral API design:

  - GET /api/po-submissions and GET /api/po-submissions/{id} for paginated list/detail responses
  - POST /api/po-submissions/{id}/claim and related action endpoints for review workflow actions
  - POST /api/cpq-product-upload/search for filtered search requests
  - POST /api/salesforce/vendors for validated create/sync behavior against external systems
  - POST /api/warehouse-router/resolve for orchestration endpoints that combine internal data and external service logic

  Supporting notes:

  - The current sync logic to be replaced starts in syncProjects.php, so field mapping, scheduling behavior, failure handling, and downstream writes in that script should be reviewed during implementation.
  - No BuildCentral-specific API currently appears to exist in NewRivers, so this ticket should define the first endpoint contract for this domain.
  - Current primary storage table is datasync.buildCentralProjects.

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/451)
