<?php

namespace App\Events;

use Illuminate\Foundation\Events\Dispatchable;

/**
 * Event fired when a phone's price changes.
 *
 * Events are Laravel's way of decoupling "something happened" from
 * "what should we do about it." The PhoneObserver fires this event,
 * and the HandlePriceChange listener reacts to it.
 *
 * This decoupling means we can add more reactions later (e.g., logging,
 * analytics) without modifying the observer.
 */
class PriceChanged
{
    use Dispatchable;

    public function __construct(
        public int $phoneId,
        public float $oldPrice,
        public float $newPrice,
    ) {}
}
