# SF Account Creation

Customer type always

Name

Type ID

(Sub?)Type: certain selections need a secondary ID

Export Project sets / email to sfadmin@cmecorp.com

Project Primary Contact hierarchy: `Owner` Role, `Tenant` Role, leave unresolved.





TICKETS:

- Extract ALL enums
  - Int-backed cases map to their individual string values from corresponding `"format"` keys.
  - Table columns are JSON with the IDs
  - `formatted_enums` column is JSON with the string output of the enum column
    Examples:
    - `commercial_real_estate = [ 1, 2, 5, 8 ]`
      `formatted_enums->'commercial_real_estate' = 'String from "format.commercialRealEstate"'`
    - `contacts[0].role = [ 111, 222 ]`
      `formatted_enums->'contacts[0].role' = 'Owner, Tenant'`
  - All the enum attributes from the model access the `formatted_enums` attribute to get their string output. We don't do any programmatic string assembly.
  - The individual enum strings will be used to isolate specific values in an array, rather than parsing the string. Given the sample above:
    - `[Commercial Real Estate |v]` select list displays each item separately so a single integer value can be found in any record.
    - `[Contact Roles |v]` likewise shows the available Roles, and searches all Contacts for the selected Role.
  - 