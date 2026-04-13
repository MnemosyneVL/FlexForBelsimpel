<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Plan model — a phone subscription plan from a telecom provider.
 *
 * Relationships:
 *   - A plan BELONGS TO a provider (every plan comes from one telecom company)
 *   - A plan BELONGS TO MANY phones through phone_plans
 */
class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'name',
        'slug',
        'monthly_cost_eur',
        'data_gb',
        'minutes',
        'sms',
        'is_unlimited_data',
        'is_unlimited_calls',
        'network_type',
        'contract_months',
        'is_active',
    ];

    protected $casts = [
        'monthly_cost_eur' => 'decimal:2',
        'data_gb' => 'decimal:1',
        'is_unlimited_data' => 'boolean',
        'is_unlimited_calls' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function provider(): BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }

    public function phones(): BelongsToMany
    {
        return $this->belongsToMany(Phone::class, 'phone_plans')
            ->withPivot(['monthly_cost_eur', 'upfront_cost_eur', 'total_cost_eur'])
            ->withTimestamps();
    }

    public function phonePlans(): HasMany
    {
        return $this->hasMany(PhonePlan::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
