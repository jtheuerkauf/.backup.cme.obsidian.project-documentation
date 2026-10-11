**Date:** August 27, 2026  
**Attendees:** Bob Charron, Joe Theuerkauf, Ryan Furtado  
**Purpose:** Determine how to display BuildCentral project contact information within the Salesforce Project object.

## Summary

The team discussed bringing BuildCentral contact information into the existing BuildCentral section of the Salesforce Project record. Available contacts vary by project and may include owners, architects, general contractors, equipment planners, consultants, engineers, and other roles.

BuildCentral sometimes combines multiple roles into one value, such as “Architect, Owner” or “Architect, Engineer.” Before Salesforce fields and mapping rules are established, the team needs to understand all role combinations contained in the data.

Joe confirmed that the API provides detailed contact and company information, including:

- Contact role
- Contact name
- Contact and company IDs
- Company name
- Street address
- City, state, and ZIP code

The complete API payload is retained, so additional functionality can be developed later without losing the underlying data.

## Agreed Approach

For the initial phase:

- BuildCentral contacts will appear as read-only information in the BuildCentral section of the Salesforce Project record.
- A contact role will only display when BuildCentral has information for that role.
- Existing Salesforce contact fields will remain unchanged.
- Users can use the displayed BuildCentral information to create or associate Salesforce contacts manually.
- The team will limit the displayed contacts to approximately four or five priority roles.
- Combined roles will be mapped to a single preferred role based on a hierarchy established by Bob. For example:
    - “Architect, Owner” may display as **Owner**.
    - “Architect, Engineer” may display as **Architect**.

Future phases may include:

- Creating Salesforce contacts directly from BuildCentral information.
- Matching companies and contacts using BuildCentral IDs.
- Preventing duplicate Salesforce contacts.
- Automatically populating existing Project contact lookup fields.

### Action Items

**Joe Theuerkauf**

- Export all BuildCentral project contacts, including the project, contact role, and associated company name.
- Include enough detail for Bob to identify combined roles and determine the appropriate role hierarchy.
- Analyze whether BuildCentral company and contact IDs are consistent across multiple projects.
- Provide the export to Bob by **Monday, August 31**, if possible.
- Meet with Ryan to determine which data preparation should occur in the data warehouse versus Salesforce.
- Schedule a separate discussion with Bob regarding project workflow and web-tool visibility parameters.

**Bob Charron**

- Review the export and identify all unique contact roles.
- Select the approximately four or five roles that should be displayed in Salesforce.
- Establish mapping and priority rules for combined roles.
- Provide the finalized role requirements to Joe and Ryan.

**Ryan Furtado**

- Confirm the Salesforce design for conditionally displaying read-only BuildCentral contact fields.
- Coordinate with Joe on the most efficient division of data transformation and Salesforce development.
- Develop the Salesforce fields and display logic after Bob finalizes the roles and mapping hierarchy.

## Open Questions

- Which BuildCentral contact roles should be displayed?
- How should each combined role be categorized?
- Are BuildCentral company and contact IDs reliable enough for future Salesforce matching?
- Should future functionality create new Salesforce contacts, match existing contacts, or support both?
- Which data-processing steps should occur before the information reaches Salesforce?
