<?php

declare(strict_types=1);

namespace Database\Seeders;

use Database\Seeders\Maintenance\NavigationSeeder;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            InitialRolesSeeder::class,
            InitialPermissionsSeeder::class,
            InitialNavigationSeeder::class,
        ]);

        // Kept last so it can rely on all clean-install prerequisites.
        $this->call(NavigationSeeder::class);
    }
}
