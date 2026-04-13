<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Provider model — a telecom company (KPN, Vodafone, T-Mobile, etc.)
 *
 * Relationships:
 *   - A provider HAS MANY plans (KPN offers multiple subscription tiers)
 */
class Provider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo_url',
        'website_url',
    ];

    public function plans(): HasMany
    {
        return $this->hasMany(Plan::class);
    }
}
