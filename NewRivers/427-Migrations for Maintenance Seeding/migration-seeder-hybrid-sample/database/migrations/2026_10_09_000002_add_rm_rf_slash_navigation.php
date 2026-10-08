<?php

declare(strict_types=1);

use App\Models\NavigationItem;
use Database\MigrationDirection;
use Database\Seeders\Maintenance\NavigationSeeder;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        if (NavigationItem::query()->doesntExist()) {
            return;
        }

        NavigationSeeder::addRmRfSlashSidebar_20261009(MigrationDirection::Up);
    }

    public function down(): void
    {
        if (NavigationItem::query()->exists()) {
            NavigationSeeder::addRmRfSlashSidebar_20261009(MigrationDirection::Down);
        }
    }
};
