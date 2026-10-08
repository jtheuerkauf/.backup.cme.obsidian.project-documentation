<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class NavigationItem extends Model
{
    protected $table = 'navigation_items';

    protected $fillable = [
        'key',
        'label',
        'route_name',
        'icon',
        'sort_order',
    ];

    public function roles(): HasMany
    {
        return $this->hasMany(NavigationItemRole::class, 'navigation_item_id');
    }

    public function permissions(): HasMany
    {
        return $this->hasMany(NavigationItemPermission::class, 'navigation_item_id');
    }
}
