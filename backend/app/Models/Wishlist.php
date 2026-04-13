<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Wishlist model — a saved item (phone, plan, or combo) for a user.
 */
class Wishlist extends Model
{
    protected $fillable = [
        'user_id',
        'phone_id',
        'plan_id',
        'phone_plan_id',
        'notes',
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
}
