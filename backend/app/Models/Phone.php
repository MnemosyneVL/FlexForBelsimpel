<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Phone model — the central entity of FlexForBelsimpel.
 *
 * Relationships:
 *   - A phone BELONGS TO a brand (every phone has exactly one manufacturer)
 *   - A phone BELONGS TO MANY plans through the phone_plans pivot table
 *   - A phone HAS MANY phone_plan combinations (with pricing details)
 *
 * The "belongs to many" relationship is a many-to-many: one phone can be offered
 * with many plans, and one plan can be paired with many phones.
 * The phone_plans table sits in the middle and stores the pricing for each combo.
 */
class Phone extends Model
{
    use HasFactory;

    protected $fillable = [
        'phone_brand_id',
        'name',
        'slug',
        'image_url',
        'price_eur',
        'release_year',
        'screen_size',
        'storage_gb',
        'ram_gb',
        'battery_mah',
        'camera_mp',
        'os',
        'color',
        'is_5g',
        'is_active',
    ];

    // Cast database values to proper PHP types.
    // Without this, price_eur would come back as a string "499.99"
    // instead of a float 499.99.
    protected $casts = [
        'price_eur' => 'decimal:2',
        'screen_size' => 'decimal:1',
        'is_5g' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * A phone belongs to one brand.
     * Usage: $phone->phoneBrand->name returns "Samsung"
     */
    public function phoneBrand(): BelongsTo
    {
        return $this->belongsTo(PhoneBrand::class);
    }

    /**
     * A phone can be offered with many plans (many-to-many).
     * The pivot table (phone_plans) has extra columns: monthly_cost, upfront_cost, total_cost.
     * withPivot() tells Eloquent to include these extra columns when loading the relationship.
     */
    public function plans(): BelongsToMany
    {
        return $this->belongsToMany(Plan::class, 'phone_plans')
            ->withPivot(['monthly_cost_eur', 'upfront_cost_eur', 'total_cost_eur'])
            ->withTimestamps();
    }

    /**
     * Access the phone_plans pivot records directly (useful for GraphQL).
     * This gives us the PhonePlan model with all its fields,
     * rather than the Plan model with pivot data attached.
     */
    public function phonePlans(): HasMany
    {
        return $this->hasMany(PhonePlan::class);
    }

    /**
     * Scope to only show active phones.
     * Usage: Phone::active()->get() returns only phones where is_active = true.
     * Scopes are reusable query filters — DRY principle applied to queries.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
