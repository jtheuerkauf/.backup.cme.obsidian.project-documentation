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
- A BC Project =={data}is linked== to SF Account/Project (existing or created), which must be approved.
#### =={term}Assigning==
- Project =={data}is assigned== to AM by Director, which must be approved.
#### =={term}Claiming==
- Account Manager =={data}self-assigns== a Project, which must be approved.
#### =={term}Approving==
- Sales Director *approves* SF Account/Project links
- Sales Director *approves* Account Manager claims
- Sales VP *approves* Projects to move forward and Sales Directors' assignments

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
- A set of [matching criteria](#^matching-criteria) determines =={functional}automatic matches==, the remaining are left to be =={functional}manually paired with existing or new SFA==.
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

#### Executive Review Workbench
Sales Director assignment and VP approval should be the same core tool.  
They are both working with the same project and the same review process.  
The main difference is the user's role and which projects require their action.  
Use different views and permissions rather than building two separate tools.

##### =={question}Questions==
1. Should Director be expected to create SF Account/Project or should that already be handled before this point?
2. If the latter, should the Director's queue exclude BCP with missing SF links? Or show but prevent forward progress (kick back to peons)?

##### 1. =={view}Sales Director view==
- Shows projects that are =={rule}ready for Account Manager assignment==.
- These projects =={rule}should already be linked to Salesforce accounts==.
- Include both =={data}automatically and manually selected projects==.
- =={rule}Sales Directors assign== the appropriate Account Manager.
- =={functional}Allow reassignment== where necessary.
- =={rule}Project moves out of the Director's active queue when AM is assigned==.
- Bulk assignment may be helpful depending on the number of projects.

##### 2. =={view}VP view==
- Shows projects that have =={rule}completed the Sales Director assignment== step.
- Show the =={data}BC Project==, =={data}SF Account==, assigned =={data}Account Manager==, =={data}Sales Director==, =={data}project value==, =={data}dates==, and whether the project was =={data}automatic or user selected==.
- VP can =={data}approve / reject== the project.
- VP should have the ability to =={functional}return the project== to the Sales Director for changes.
- =={functional}Bulk approval== will likely be important because there may be hundreds of projects in a quarterly cycle.

### =={rule}Quarterly process==
- BuildCentral projects should exist in the system continuously.
- The quarterly process should not control whether the project exists.
- The quarterly process should determine when eligible linked projects are sent through Sales Director and VP review.
- At the start of each quarter, Sales Directors should be =={functional}notified that projects are ready== for assignment.
- After assignment, the projects should automatically become available to the appropriate VP.
- Claimed projects should go through the same review process.
- Once approved by the VP, the project can move to Salesforce opportunity creation or update.

### Salesforce completion
- Approved projects should create a new Salesforce opportunity when one does not already exist.
- Existing BuildCentral opportunities in Salesforce should be updated rather than duplicated.
- The approved Account Manager should be used for the Salesforce ownership or assignment.
- Store the Salesforce opportunity ID back against the BuildCentral project.
- Once successfully created or updated in Salesforce, the project should be considered complete for that review.
- It should leave the active workbenches but remain available in Project Workbench history.

### Overall tool breakdown
#### BuildCentral Salesforce Workbench
- Find projects
- Review qualifying projects
- Link Salesforce accounts
- Create accounts when needed
- Claim additional projects
- View current status
- View historical projects
#### Executive Review Workbench  
- Sales Director Account Manager assignment
- VP approval
- Quarterly review queues
- Review status and progress

#### =={view}Project detail==
- All views should provide the =={requirement}same project detail page==.
- Show the =={data}BuildCentral project information==.
- Show =={rule}why the project qualified== for CME review.
- Show whether it was =={data}automatically or manually selected==.
- Show =={data}Salesforce Account association==.
- Show =={data}assigned Account Manager== if one exists.
- Show =={data}Sales Director and VP review== information.
- Show =={question}Salesforce Opportunity information== once created.
- Show a =={data}history of actions== taken on the project.

##### 1. =={view}SF Account association== (see [newrivers#489](https://gitlab.com/cme-corp/newrivers/-/work_items/489))
- =={functional}Search Salesforce Accounts== from the project.
- =={functional}Link existing SF Account== to the BuildCentral project.
- =={functional}Create new SF Account== when needed.
- Most of this functionality already exists but the dataset and workflow may need adjustment.
- Store the account association in CME records so it does not need to be determined again later.

## General direction
- Search, linking, claiming, and history are different states and actions around the same BuildCentral project, so they should remain in one tool.
- Sales Director assignment and VP approval are different stages of the same sales review process, so they should remain in one tool.
- Avoid creating separate tools for every step in the workflow.
- The user should primarily think of this as a Project Workbench and a Sales Review Workbench.

---
## Supplemental Notes

He does not create or assign projects really. =={rule}The VP authorizes creating the SF Project once they approve of the assignment suggested by the Director.==

### Basic BuildCentral Flow
- We sync BuildCentral project data into our system.
### Ryan / Assignment Tool
- Ryan reviews new qualifying BuildCentral projects.
- Ryan links each BuildCentral project to the appropriate Salesforce account.
	- If the correct Salesforce account does not exist, a new account can be created as part of the process.
### Quarterly Sales Director Assignment
- Sales Directors are notified quarterly when BuildCentral projects are ready for assignment.
- Sales Directors are presented with projects that =={rule}clearly fall within their territory== based on project address.
- Sales Directors assign an Account Manager under them to each BuildCentral project.
- Projects that cannot be =={rule}clearly assigned by territory== can be =={functional}reviewed and assigned manually==. =={question}**By whom?**==
### VP Approval
- Once a Sales Director has completed their assignments, the appropriate VP is notified that projects are ready for approval.
- The VP reviews the proposed project, account, and Account Manager assignments.
- The VP approves or rejects the projects.
### Salesforce Creation
- Once approved by the VP, the BuildCentral project is created as an Opportunity in Salesforce.
- The Salesforce account, Account Manager, Sales Director, VP, and other required project information are linked to the opportunity.
- The Salesforce opportunity ID and completed assignment information are stored back in our records.
- Completed projects no longer appear in the active assignment tools but remain available for historical review.
### Self-Service Project Assignment
- Users =={question}(Account Managers?)== can search BuildCentral for smaller or otherwise non-qualifying projects that were not automatically brought into the normal assignment queue.
- A user can select and claim one of these projects for themselves.
- Self-assigned projects are allowed as long as the user =={rule}does not exceed a defined project threshold==, with the threshold still TBD.
- The project =={rule}must still be linked== to the appropriate Salesforce account.
- Once claimed, the project is placed onto the appropriate Sales Director's board.
- From that point forward, it follows the normal process.
- Sales Director reviews the assignment.
- VP reviews and approves the project.
- After approval, the opportunity is created in Salesforce and linked to the appropriate parties.