The way I read the data, each `contact` is its own entity that connects to up to 3 other entities: company, location, and name. There may be >1 location or name, but as far as I can tell, only 1 company.

I separate the company from the connecting `project_contact` entity because the latter holds the `role` - which may change for a given company from project to project.


```
      +-------------------------------------------+
      | build_central_projects                    |
      |-------------------------------------------|
 +--|<| id                       | PK   | Laravel |
 |    | build_central_project_id | UIDX | "$.id"  |
 |    +-------------------------------------------+                            +-----------------------------------------------------+
 |                                                                             | build_central_companies                             |
 |      +----------------------------------------------------+                 |-----------------------------------------------------|
 |      | build_central_project_contacts                     |           +---o<| id           | PK   | Laravel                       |
 |      |----------------------------------------------------|           |     | company_id   | UIDX | "contact.company.id"          |------------+---+
 |      | id                        | PK   | Laravel         |           |     | name         |      | "contact.company.name"        |            |   |
 |      | contact_id                | UIDX | "$.id"          |           |     | website      |      | "contact.company.url"         |           >o- >o-
 |      | role                      | JSON | "contact.role"  |           |     | updated_date |      | "contact.company.updatedDate" |            |   |
 +----|<| build_central_project_id  | FK   | bc_projects.id  |           |     +-----------------------------------------------------+            |   |
        | build_central_company_id  | FK   | bc_companies.id |-||--------+                                                                        |   |
        | build_central_name_id     | FK   | bc_names.id     |>o------------+    +--------------------------------+                               |   |
        | build_central_location_id | FK   | bc_locations.id |>o-------+    |    | build_central_names            |                               |   |
        | formatted                 | JSON |                 |         |    |    |----------------------------------------------------------|     |   |
        | raw_payload               | JSON | "contact" obj   |         |    +--o<| id            | PK   | Laravel                           |     |   |
        +----------------------------------------------------+         |         | name_id       | UIDX | "contact.contactName.id"          |     |   |
        | UNIQUE INDEX                                       |         |         | first_name    |      | "contact.contactName.firstName"   |     |   |
        +- - - - - - - - - - - - - - - - - - - - - - - - - - +         |         | last_name     |      | "contact.contactName.lastName"    |     |   |
        | build_central_project_id                           |         |         | full_name     |      | "contact.contactName.fullName"    |     |   |
        | contact_id                                         |         |         | title         |      | "contact.contactName.title"       |     |   |
        +----------------------------------------------------+         |         | email         |      | "contact.contactName.email"       |     |   |
                                                                       |         | company_id    | FK   | bc_companies.id                   |-||--+   |
                                                                       |         |               |      | "contact.contactName.companyId"   |         |
                                                                       |         | updated_date  |      | "contact.contactName.updatedDate" |         |
                                                                       |         +----------------------------------------------------------+         |
                                                                       |         
                                                                       |         
                                                                       |         
                                                                       |         +-------------------------+
                                                                       |         | build_central_locations |
                                                                       |         |-------------------------| LOCATIONS!
                                                                       |         | id                      |



```


