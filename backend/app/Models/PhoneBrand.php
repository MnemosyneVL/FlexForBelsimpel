<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * PhoneBrand model — represents a phone manufacturer (Samsung, Apple, etc.)
 *
 * Relationships:
 *   - A brand HAS MANY phones (Samsung has Galaxy S24, Galaxy A55, etc.)
 *
 * This is a one-to-many relationship: one brand → many phones.
 * In the database, each phone row has a phone_brand_id column pointing back to this table.
 */
class PhoneBrand extends Model
{
    use HasFactory;

    // $fillable lists which columns can be mass-assigned.
    // This is a security feature — it prevents someone from sending a crafted
    // request that sets columns you didn't intend (like setting is_admin = true).
    protected $fillable = [
        'name',
        'slug',
        'logo_url',
    ];

    /**
     * A brand has many phones.
     * Usage: $brand->phones returns a collection of all phones from this brand.
     */
    public function phones(): HasMany
    {
        return $this->hasMany(Phone::class);
    }
}
