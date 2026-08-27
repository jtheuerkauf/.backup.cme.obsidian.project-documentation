---
id: 196278646
title: Defect - Email Dashboard > "Subject/ Body" search field is not filtering as expected
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/497
project: cme-corp/newrivers#497
---

### Defect - Email Dashboard > "Subject/ Body" search field is not filtering as expected
##### Due on 

### Describe the bug generally. What is the problem and what is the correct behavior?

Entering keywords with valid matches into the Subject/ Body field is not generating a filtered list of matching results

Entering keywords with invalid matches into the Subject/ Body field is not generating "No Results found" messaging.

In both instances the email table results remain unchanged

---

### Any location information? URL, file, etc.

Tested on Email Dashboard page in Prod

---

### Any relevant details of other useful information or screen shots?

STR:

* Go to Email Dashboard page in Prod
  * Note populated list of sent emails
* Click on "Subject/ Body Search field
* Enter a keyword into the Search field that matches a word in the Subject line of one or more sent emails
  * Note: Page does not refresh and only show matches
* Click on "Subject/ Body Search field
* Enter "NinjaTurtle" into Search Field
  * Note: Page does not refresh and show "No matches Found" messaging

Results:

Expected: Search field should correctly filter for matching keywords, or show messaging if no matches are found

Actual: Subject/ Body search does not appear to be affecting results

---

### Suggested fixes or line numbers of bug?

---

### Who can be contacted to ensure the resolution is correct?

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/497)
