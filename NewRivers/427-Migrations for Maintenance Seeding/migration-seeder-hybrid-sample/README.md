# Migration + Maintenance Seeder Example

This is a Laravel-style example of the incremental-seeding pattern described in
`202610070020_migration-seeder-hybrid.md`.

`NavigationSeeder` is deliberately both a normal seeder and a library of
small, reversible maintenance operations:

- `run()` applies every operation needed by a fresh install.
- A migration calls exactly one operation when upgrading an **existing**
  installation.
- Every `up()` is idempotent; every `down()` removes only the records owned by
  that operation.
- Stable natural keys (`key`, `slug`, `code`) identify the records. No code
  relies on generated database IDs.

The example uses Eloquent models only to make the persistence rules visible.
Adapt the model/table names, role/permission mappings, and existing-install
predicate to the application.

## Installation layout

Copy the PHP files into the equivalent locations in a Laravel application:

```text
app/Models/NavigationItem.php
app/Models/NavigationItemRole.php
app/Models/NavigationItemPermission.php
database/MigrationDirection.php
database/Seeders/Maintenance/NavigationSeeder.php
database/Seeders/DatabaseSeeder.php
database/migrations/2026_10_06_000001_add_po_submission_navigation.php
database/migrations/2026_10_09_000002_add_rm_rf_slash_navigation.php
```

The two migrations intentionally use the normal Laravel class names
`Migration` and `Blueprint`; the sample's enum is named `MigrationDirection`
to avoid a namespace collision with `Illuminate\\Database\\Migrations\\Migration`.

## Important contract

The `down()` methods delete dependent role and permission records before their
navigation item. This assumes those dependent rows are wholly owned by this
seed operation. If another feature can create the same relationship, replace
that deletion with an ownership marker or a narrower predicate.

The migrations skip a fresh database because `NavigationItem::query()->exists()`
is false. The clean-install seed process later invokes the maintenance seeder,
so it receives the exact same final navigation state.
