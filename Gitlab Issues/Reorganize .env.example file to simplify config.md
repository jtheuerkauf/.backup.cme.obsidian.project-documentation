---
id: 196924754
title: Reorganize .env.example file to simplify config
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/535
project: cme-corp/newrivers#535
---

### Reorganize .env.example file to simplify config
##### Due on 

Reliance on the `.env` file has ballooned lately, and much of the config there doesn't _need_ to be. The file is mainly intended for sensitive data (thus not including `.env` in version control).

We should migrate non-secret config into `/config/*` where it can be more easily managed without clobbering each other when we add or change something. It'll also keep the `.env` load light and be less confusing when a config setting has mismatched values between `.env`, `/config/*`, and inline defaults use when fetching from the other two.

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/535)
