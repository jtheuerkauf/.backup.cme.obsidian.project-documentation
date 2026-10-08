<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class NavigationItemPermission extends Model
{
    protected $table = 'navigation_item_permissions';

    protected $fillable = [
        'navigation_item_id',
        'permission_code',
    ];
}
