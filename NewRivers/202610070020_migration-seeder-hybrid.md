# Incremental Seeding

We don't currently have a stable mechanism to add seed data as new items get code representation. Example: migrating an old Allrivers Alert into `alerts` and related tables, or adding new `navigation` items.

I want to introduce a pattern that uses migrations to run one-time seeds, but the execution itself is held in a
separate class so that installation seeding and migration seeding can both access it.

It would look something like this in the `./database/` directory tree:

```
database/
|- seeders/
   |- maintenance/
   |  |- Alerts.php
   |  |- Navigation.php
   |- DatabaseSeeder.php
|- migrations/
   |- 000000001_add-sidebar-link-to-posubmission.php
   |- 000000002_add-sidebar-link-to-self-destruct.php
|- MigrationEnum.php
```

- The Maintenance classes look like normal Seeders with a `public function run()`
- The difference is, `run()` is populated with calls to local `static` methods.
- The `up`/`down` action of a calling migration is easily handled with a simple enum.

```php
namespace Database;

enum Migration {
    case Up;
    case Down;
}

```

```php
namespace Database\Seeders\Maintenance;

final readonly class Navigation extends Seeder {
    public function run(): void {
        self::addPoSubmissionSidebar_20261006(Migration::Up);
        self::addRmRfSlashSidebar_20261009(Migration::Up);
    }

    public ststic function addPoSubmissionSidebar_20261006(Migration $upDown): void {
        if ($upDown === Migration::Up) {
            // Navigation::create() ...
            // NavigationRole::create() ...
            // NavigationPermission::create() ...
        } else {
            // Delete
        }
    }

    public static function addRmRfSlashSidebar_20261009(Migration $upDown): void {
        // etc.
    }
}
```

- The migration only needs to check whether the database state is new or already populated.
- This lets the migration reasonably control its specific seed record(s).
- There shouldn't be any code that depends on specific IDs, so if the migration needs to rollback,
  related records should be set up to handle the change: set null, cascade, restrict as circumstances dictate.
  - One shortcoming: when the migration runs `up()` again, the records that used to be linked to it may be left orphaned
    if additional data work isn't done. That would be situation-specific maintenance for the `up()` method to
    check if such maintenance is necessary and perform it in addition to (but separate from!) the seeding call.

```php
// 000000001_add-sidebar-link-to-posubmission.php

return new class() extends Migration {
    public function up(): void {
        // Whatever condition qualifies as "existing installation"
        if (Navigation::count(1)) {
           \Database\Seeders\Maintenance\Navigation::addPoSubmissionSidebar_20261006(Migration::Up);

           if ("other data maintenance is needed") {
               // Do it separately.
           }
        }
    }

    public function down(): void {
        if (Navigation::count(1)) {
            if ("deletion preparation is needed") {
                // Do it separately.
            }

            \Database\Seeders\Maintenance\Navigation::addPoSubmissionSidebar_20261006(Migration::Down);
        }
    }
};

```

- Lastly, a clean install. Seeding runs after all migrations, but we don't want seeder migrations to run
  during a clean install (hence `if table has data`). We DO want them to run _after_ migrations with the
  full seed process.

```php
// DatabaseSeeder.php

public function run(): void {
    $this->call([
        CleanInstallSeeder01::class,
        CleanInstallSeeder02::class,
    ]);

    $this->maintenance();
}

private function maintenance(): void {
    // Execution can be the entire maintenance seeder or a specific order of method calls.

    $this->call([
        // Run this entire maintenance seeder, which calls its static methods in run()
        \Database\Seeders\Maintenance\MaintenanceSeeder01::class,
    ]);
    // Or run a specific seed function sequence
    // New menu item required before whatever thing that depends on it...
    \Database\Seeders\Maintenance\Alerts::addSomeOldAndBustedAllriversAlert(Migration::Up);
    \Database\Seeders\Maintenance\Navigation::addRmRfSlashSidebar_20261009(Migration::Up);
}
```

