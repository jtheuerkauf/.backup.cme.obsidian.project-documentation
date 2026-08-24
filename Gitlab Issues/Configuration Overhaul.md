---
id: 198658713
title: Configuration Overhaul
dueDate: 
webUrl: https://gitlab.com/cme-corp/newrivers/-/work_items/596
project: cme-corp/newrivers#596
---

### Configuration Overhaul
##### Due on 

### Describe the enhancement / feature. What will it do?

---

This change would clean up `.env.example`, moving most settings into `/config/*.php` files.

### Why is it needed?

---

We need to reduce dependence on `.env` as the application config. Most settings rarely or never change, but `.env` is _intended_ to be ephemeral, making it the wrong place to store long-term settings.

### Who would need to verify the feature is successful and are there any groups that need to be notified of it generally?

---

### Any specification details around it?

---

#### Proposed migration

This plan states the intended results. Some may already be in place and see no changes, but all should be reviewed.

##### General

- No config file (`/config/*`, `.env.example`, etc.) should ever hold specialized secrets. Shared local values _may be_ considered OK if they don't connect to any external or production system. Preferably though, _ALL_ secrets should be stored and shared in Keeper.
- Config will be split into environment paths so all settings within a path correspond to the configured environment: `config/{test,dev,qa,prod}/`
- **_Concise_** documentation comments are added to config options/groups as needed to explain their purpose and usage
- `.env.example` settings are grouped (per newrivers#535)
  - All settings are comment-disabled by default
  - `.env.example` settings have comments pointing to the `php` as SoT
- **_Production_** values are set by default. Other environments must override necessary settings. Production should have the fewest overrides to reduce deployment overhead.

To keep paths short, assume `/config/{env}/` is prefixed.

##### Database

- `DB_*` settings move into `db/{connection}.php`
  - (Keys are accessed with dot-syntax: `{env}.db.{connection}.setting`)
  - The connection-level separation allows for clean configurations and, if needed, persisted sub-variants.
    - Example: `config.test.db.newrivers.{unit|feature|front}`
- In order to bring local environments into alignment regardless of the virtualization system, the set of `dev` values will apply to _new_ environment installations but there's no requirement to change existing (also, local override in `.env` is still an option).

##### System

- Clear up fragmentation and crowding
- Potential sub-groupings: `services`, `syncs`, `paths`, `automation`, etc.

#### Routes (see newrivers#501)

- Organize route configs into cleaner grouping, lint any redundant middleware or other inherited settings, etc.
- Remove old/unused routes that shouldn't permit access to things like test code, internal dev info, etc.

### Special considerations?

---

[View On Gitlab](https://gitlab.com/cme-corp/newrivers/-/work_items/596)
