<?php

declare(strict_types=1);

namespace Database\Seeders\Maintenance;

use App\Models\NavigationItem;
use App\Models\NavigationItemPermission;
use App\Models\NavigationItemRole;
use Database\MigrationDirection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Reversible navigation additions that have been introduced after the original
 * clean-install seed data. Their public static methods are also migration APIs.
 */
final class NavigationSeeder extends Seeder
{
    public function run(): void
    {
        self::addPoSubmissionSidebar_20261006(MigrationDirection::Up);
        self::addRmRfSlashSidebar_20261009(MigrationDirection::Up);
    }

    public static function addPoSubmissionSidebar_20261006(
        MigrationDirection $direction,
    ): void {
        self::apply(
            direction: $direction,
            item: [
                'key' => 'po-submission',
                'label' => 'PO Submission',
                'route_name' => 'po-submissions.index',
                'icon' => 'clipboard-check',
                'sort_order' => 310,
            ],
            roles: ['purchasing-manager', 'purchasing-user'],
            permissions: ['po-submissions.view'],
        );
    }

    public static function addRmRfSlashSidebar_20261009(
        MigrationDirection $direction,
    ): void {
        self::apply(
            direction: $direction,
            item: [
                'key' => 'rm-rf-slash',
                'label' => 'RM/RF',
                'route_name' => 'rm-rf.index',
                'icon' => 'wrench-screwdriver',
                'sort_order' => 320,
            ],
            roles: ['operations-manager'],
            permissions: ['rm-rf.view'],
        );
    }

    /**
     * @param array{key: string, label: string, route_name: string, icon: string, sort_order: int} $item
     * @param list<string> $roles
     * @param list<string> $permissions
     */
    private static function apply(
        MigrationDirection $direction,
        array $item,
        array $roles,
        array $permissions,
    ): void {
        DB::transaction(function () use ($direction, $item, $roles, $permissions): void {
            if ($direction === MigrationDirection::Down) {
                self::remove($item['key']);

                return;
            }

            // updateOrCreate makes both `db:seed` and a retry of the migration safe.
            $navigation = NavigationItem::query()->updateOrCreate(
                ['key' => $item['key']],
                $item,
            );

            foreach ($roles as $roleCode) {
                NavigationItemRole::query()->firstOrCreate([
                    'navigation_item_id' => $navigation->getKey(),
                    'role_code' => $roleCode,
                ]);
            }

            foreach ($permissions as $permissionCode) {
                NavigationItemPermission::query()->firstOrCreate([
                    'navigation_item_id' => $navigation->getKey(),
                    'permission_code' => $permissionCode,
                ]);
            }
        });
    }

    private static function remove(string $key): void
    {
        $navigation = NavigationItem::query()->where('key', $key)->first();

        if ($navigation === null) {
            return; // Repeated or partial rollback remains safe.
        }

        // Delete only the relation rows whose foreign key belongs to this item.
        $navigation->permissions()->delete();
        $navigation->roles()->delete();
        $navigation->delete();
    }
}
