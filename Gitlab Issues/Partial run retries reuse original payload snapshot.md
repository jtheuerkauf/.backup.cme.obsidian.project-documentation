---
id: 204744884
title: Partial run retries reuse original payload snapshot
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/742
project: cme-corp/newrivers#742
---

### Partial run retries reuse original payload snapshot
##### Due on 

Alerts should take a snapshot of first-run payload and the intended "full package" to finish the run successfully. If a Run fails and is recorded as a Partial completion, the snapshot should be reused instead of fetching fresh data to support getting initial Alert info to all intended recipients. It also assures idempotency when recording the run to legacy data (`allrivers.[alertTracking|dimReporting]`)

Future development may want control over this strategy to always fetch fresh data that is time/timing sensitive.

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/742)
