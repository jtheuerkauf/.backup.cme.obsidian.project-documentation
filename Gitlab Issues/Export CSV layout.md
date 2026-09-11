---
id: 202815482
title: Export CSV layout
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/672
project: cme-corp/newrivers#672
---

### Export CSV layout
##### Due on 

# BuildCentral Project Export Column Map

Export map available as of 2026-09-11.

Uncertain how to get "manager" column (Regional Sales Director's email). Follow up when resolution is available.

| `build_central_projects` Column Name | Source Type | Alt Export Data | Salesforce Column Name |
|--------------------------------------|-------------|-----------------|------------------------|
| **\<???\>** |  |  | manager |
|  |  |  | NOTES |
| `sector` | `Enum[]` | `raw_payload->$.format.sector` | Sector |
| `build_central_project_id` | UNSGN `int` |  | BCD_Project_ID__c |
| `name` | `string` |  | Name |
|  | `string` | `'Qualification'` | Project_Status__c |
| `name` | `string` |  | Account_Name__c |
| `owner_contact->'$.company.name'` | JSON |  | Owner01CompanyName |
| `tenant_contact->'$.company.name'` | JSON |  | Tenant01CompanyName |
| `state` | `string` |  | Project_State__c |
| `postal_code` | `string` |  | PostalCode |
|  |  |  | ownerid (by ZIP) |
| `owner_contact->'$.email'` |  |  | Owner Email |
| `abbreviated_value` | `string` | `raw_payload->$.format->value` | Construction_Amount_M__c |
| `end_date` | `date` | `raw_payload->$.format.endDate` | Construction_End_Date__c |
| `construction_stage` | `Enum` | `raw_payload->$.format.constructionStage` | Project_Stage__c |
| `construction_type` | JSON `int[]` | `raw_payload->$.format.constructionType` | Construction_Type__c |
| `raw_payoad` | JSON `int[]` | `raw_payload->$.medical.format.clinical_specialty` | Clinical_Specialty__c |
| `start_date` | `state` | `raw_payload->$.format.startDate` | Construction_Start_Date__c |
| `project_details` | `string` |  | Project_Details__c |
| `facility_type` | JSON `int[]` | `raw_payload->$.medical.format.level_care` | Facility_Type__c |

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/672)
