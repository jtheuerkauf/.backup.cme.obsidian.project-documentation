<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class NavigationItemRole extends Model
{
    protected $table = 'navigation_item_roles';

    protected $fillable = [
        'navigation_item_id',
        'role_code',
    ];
}
