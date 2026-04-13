<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * PriceAlert model — "Notify me when price drops below X."
 *
 * Once the target price is hit, is_triggered flips to true
 * and we never send the same alert again.
 */
class PriceAlert extends Model
{
    protected $fillable = [
        'user_id',
        'phone_id',
        'plan_id',
        'phone_plan_id',
        'target_price_eur',
        'is_triggered',
        'triggered_at',
    ];

    protected $casts = [
        'target_price_eur' => 'decimal:2',
        'is_triggered' => 'boolean',
        'triggered_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function phone(): BelongsTo
    {
        return $this->belongsTo(Phone::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    public function phonePlan(): BelongsTo
    {
        return $this->belongsTo(PhonePlan::class);
    }

    /**
     * Scope: only alerts that haven't fired yet.
     */
    public function scopePending($query)
    {
        return $query->where('is_triggered', false);
    }
}
