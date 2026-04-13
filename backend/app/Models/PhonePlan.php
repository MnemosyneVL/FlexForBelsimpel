<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PhonePlan model — a specific phone + plan combination with pricing.
 *
 * This is the "pivot model" for the many-to-many relationship between
 * phones and plans. It's more than a simple pivot because it stores
 * calculated pricing data (monthly cost, upfront cost, total cost).
 *
 * Example: "Samsung Galaxy S24 + KPN 15GB" might cost €45/month with €99 upfront.
 * The total_cost_eur = 99 + (45 * 24 months) = €1,179
 */
class PhonePlan extends Model
{
    protected $fillable = [
        'phone_id',
        'plan_id',
        'monthly_cost_eur',
        'upfront_cost_eur',
        'total_cost_eur',
    ];

    protected $casts = [
        'monthly_cost_eur' => 'decimal:2',
        'upfront_cost_eur' => 'decimal:2',
        'total_cost_eur' => 'decimal:2',
    ];

    public function phone(): BelongsTo
    {
        return $this->belongsTo(Phone::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }
}
