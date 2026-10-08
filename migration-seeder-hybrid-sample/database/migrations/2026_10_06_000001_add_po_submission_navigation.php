<?php

declare(strict_types=1);

use App\Models\NavigationItem;
use Database\MigrationDirection;
use Database\Seeders\Maintenance\NavigationSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        if (! $this->isExistingInstallation()) {
            return;
        }

        NavigationSeeder::addPoSubmissionSidebar_20261006(MigrationDirection::Up);

        // Add unrelated upgrade-only maintenance here, separately from the seeder.
        // Example: normalize a legacy relation that is not part of the seed data.
    }

    public function down(): void
    {
        if (! $this->isExistingInstallation()) {
            return;
        }

        // Perform any application-specific unlinking/preparation first.
        NavigationSeeder::addPoSubmissionSidebar_20261006(MigrationDirection::Down);
    }

    private function isExistingInstallation(): bool
    {
        // On a brand-new database no base navigation exists while migrations run.
        // The later DatabaseSeeder call supplies the same record.
        return NavigationItem::query()->exists();
    }
};
