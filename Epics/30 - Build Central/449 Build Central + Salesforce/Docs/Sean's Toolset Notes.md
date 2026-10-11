## BuildCentral Tool Notes

Two primary user-facing tools for now:  
- BuildCentral Project Workbench  
- BuildCentral Sales Review Workbench

### BuildCentral Project Workbench

- This should be the main place to work with BuildCentral projects.
	- The =={requirement}linking==, =={requirement}searching==, =={requirement}claiming==, and =={requirement}historical review== should all live in the same tool.  
- The core item is always a BuildCentral project, so these should be different views or filters rather than separate tools.

### Data Properties
#### =={term}Linking==
- A BC Project =={data}is linked== to SF Account/Project
- Includes contingent SFA/SFP =={functional}creation== for the =={data}link==
#### =={term}Assigning==
- Project =={data}is assigned== to AM by Director
#### =={term}Claiming==
- Account Manager =={data}self-assigns== a Project

### Qualifying Criteria 
#### Workflow Criteria ^workflow-inclusion-criteria
Data points that permit a BC Project to be viewed for automatic workflow inclusion:
##### =={question}Currently Unknown==

#### Matching Criteria ^matching-criteria
##### =={question}Currently Unknown==

### Primary views

##### Define View Criteria
*The separation of these views is based on "standard" parameters that automatically qualify for project workflow, and the ability to search outside those parameters for projects to bring into the workflow.*

#### =={term}Work Queues==
##### 1. =={view}Needs Account Link==
- Shows BuildCentral projects that meet the [ standard CME criteria](#^workflow-inclusion-criteria) but are not yet linked to a SFA.
	- This should be a constant working queue, ***not*** something that only appears quarterly.
- A set of [matching criteria](#^matching-criteria) determines =={functional}automatic matches==, the remaining are left to be manually paired with existing or new SFA.
- As new qualifying projects come in, they should appear here automatically.
- **Once =={data}linked to a SF Account==, =={rule}BCP leaves this queue==.**  

##### 2. =={view}Project Search==
- Allows users to search the broader BuildCentral project dataset.
	- =={rule}This includes projects== that do not meet the [normal workflow criteria](#^workflow-inclusion-criteria).
	- Users can find projects they believe CME should pursue.
- A project can be linked to an existing Salesforce Account or have a =={data}new Account created==.
- The project can then be claimed or selected for the sales review process.

##### 3. =={view}User Selected / Claimed==
- Shows projects that were =={rule}manually selected rather than automatically identified== by the standard BuildCentral criteria.
- Store =={data}who selected the project and when==.
- Possibly store a =={data}short reason or note== for why the project was selected.  

##### 4. =={view}Linked Projects==
- Shows projects already =={data}linked to Salesforce accounts==.
- Useful for reviewing projects that are =={rule}moving toward a quarterly sales review==.

##### 5. =={view}Completed / History==
- Allows users to search =={data}projects that completed the process==.
- =={rule}Completed projects should not continue appearing in active work queues==. They should remain available here for future review.

#### =={view}Project detail==
- All views should use the =={requirement}same project detail page==.
- Show the =={data}BuildCentral project information==.
- Show =={rule}why the project qualified== for CME review.
- Show whether it was =={data}automatically or manually selected==.
- Show =={data}Salesforce Account association==.
- Show =={data}assigned Account Manager== if one exists.
- Show =={data}Sales Director and VP review== information.
- Show =={question}Salesforce Opportunity information== once created.
- Show a =={data}history of actions== taken on the project.

##### 1. SF Account association
- =={functional}Search Salesforce Accounts== from the project.
- Link the BuildCentral project to an existing Account.
- Allow creation of a new Salesforce account where needed.
- Most of this functionality already exists but the dataset and workflow may need adjustment.
- Store the account association in CME records so it does not need to be determined again later.

##### BuildCentral Sales Review Workbench:
Sales Director assignment and VP approval should be the same core tool.  
They are both working with the same project and the same review process.  
The main difference is the user's role and which projects require their action.  
Use different views and permissions rather than building two separate tools.

Sales Director view:

Shows projects that are ready for Account Manager assignment.  
These projects should already be linked to Salesforce accounts.  
Include both automatically selected projects and manually selected projects.  
Sales Directors assign the appropriate Account Manager.  
Allow reassignment where necessary.  
Once the Account Manager has been assigned, the project should move out of the Director's active queue and into the VP review stage.  
Bulk assignment may be helpful depending on the number of projects.

VP view:

Shows projects that have completed the Sales Director assignment step.  
Show the BuildCentral project information, Salesforce account, assigned Account Manager, Sales Director, project value, dates, and whether the project was automatic or user selected.  
VP can approve the project.  
VP can reject the project.  
VP may need the ability to return the project to the Sales Director for changes.  
Bulk approval will likely be important because there may be hundreds of projects in a quarterly cycle.

Quarterly process:

BuildCentral projects should exist in the system continuously.  
The quarterly process should not control whether the project exists.  
The quarterly process should determine when eligible linked projects are sent through Sales Director and VP review.  
At the start of each quarter, Sales Directors should be notified that projects are ready for assignment.  
After assignment, the projects should automatically become available to the appropriate VP.  
User selected projects should go through the same review process.  
Once approved by the VP, the project can move to Salesforce opportunity creation or update.

Salesforce completion:

Approved projects should create a new Salesforce opportunity when one does not already exist.  
Existing BuildCentral opportunities in Salesforce should be updated rather than duplicated.  
The approved Account Manager should be used for the Salesforce ownership or assignment.  
Store the Salesforce opportunity ID back against the BuildCentral project.  
Once successfully created or updated in Salesforce, the project should be considered complete for that review.  
It should leave the active workbenches but remain available in Project Workbench history.

Overall tool breakdown:

BuildCentral Project Workbench:  
Find projects  
Review qualifying projects  
Link Salesforce accounts  
Create accounts when needed  
Claim additional projects  
View current status  
View historical projects  
BuildCentral Sales Review Workbench:  
Sales Director Account Manager assignment  
VP approval  
Quarterly review queues  
Review status and progress

General direction:

Search, linking, claiming, and history are different states and actions around the same BuildCentral project, so they should remain in one tool.  
Sales Director assignment and VP approval are different stages of the same sales review process, so they should remain in one tool.  
Avoid creating separate tools for every step in the workflow.  
The user should primarily think of this as a Project Workbench and a Sales Review Workbench.

Lets talk this through after standup and we can hopefully get the core outline done and your tickets laid out.

Nothing here is too declarative if you already have some better ideas we can walk what you have but if not I've got a throughline now at least.

---
## Supplemental Notes

Ryan may create accounts but many times he will simply be linking them. For account creation we will want to understand what fields he uses to create them, things like how does he know what AM will own it etc.

He does not create or assign projects really, that is what the VP step will be, once they approve of the assignment suggested by the director, we create the project.

This flow write up is better than what I said above. 

Basic BuildCentral Flow:

- We sync BuildCentral project data into our system.
- Ryan / Assignment Tool:
- Ryan reviews new qualifying BuildCentral projects.
- Ryan links each BuildCentral project to the appropriate Salesforce account.
- If the correct Salesforce account does not exist, a new account can be created as part of the process.
- Quarterly Sales Director Assignment:
- Sales Directors are notified quarterly when BuildCentral projects are ready for assignment.
- Sales Directors are presented with projects that clearly fall within their territory based on project address.
- Sales Directors assign an Account Manager under them to each BuildCentral project.
- Projects that cannot be clearly assigned by territory can be reviewed and assigned manually.
- VP Approval:
- Once a Sales Director has completed their assignments, the appropriate VP is notified that projects are ready for approval.
- The VP reviews the proposed project, account, and Account Manager assignments.
- The VP approves or rejects the projects.
- Salesforce Creation:
- Once approved by the VP, the BuildCentral project is created as an opportunity in Salesforce.
- The Salesforce account, Account Manager, Sales Director, VP, and other required project information are linked to the opportunity.
- The Salesforce opportunity ID and completed assignment information are stored back in our records.
- Completed projects no longer appear in the active assignment tools but remain available for historical review.

Self-Service Project Assignment:

- Users can search BuildCentral for smaller or otherwise non-qualifying projects that were not automatically brought into the normal assignment queue.
- A user can select and claim one of these projects for themselves.
- Self-assigned projects are allowed as long as the user does not exceed a defined project threshold, with the threshold still TBD.
- The project must still be linked to the appropriate Salesforce account.
- Once claimed, the project is placed onto the appropriate Sales Director's board.
- From that point forward, it follows the normal process.
- Sales Director reviews the assignment.
- VP reviews and approves the project.
- After approval, the opportunity is created in Salesforce and linked to the appropriate parties.