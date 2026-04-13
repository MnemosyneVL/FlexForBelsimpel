<?php

namespace App\Listeners;

use App\Events\PriceChanged;
use App\Jobs\SendPriceAlertNotification;
use App\Models\PriceAlert;
use Illuminate\Support\Facades\Log;

/**
 * Listener that handles price change events.
 *
 * When a phone's price drops, this listener checks if any users
 * have set price alerts that should now trigger. For each matching
 * alert, it dispatches an async notification job to RabbitMQ.
 *
 * Flow: PriceChanged event → this listener → SendPriceAlertNotification job → email
 */
class HandlePriceChange
{
    public function handle(PriceChanged $event): void
    {
        // Only process price DROPS (not increases)
        if ($event->newPrice >= $event->oldPrice) {
            return;
        }

        Log::info("Price dropped for phone #{$event->phoneId}: €{$event->oldPrice} → €{$event->newPrice}");

        // Find all untriggered alerts for this phone where the target price
        // has been met (the new price is at or below what the user wanted).
        $alerts = PriceAlert::where('phone_id', $event->phoneId)
            ->where('is_triggered', false)
            ->where('target_price_eur', '>=', $event->newPrice)
            ->get();

        foreach ($alerts as $alert) {
            // Dispatch notification job to the 'notifications' queue.
            // This runs asynchronously — we don't wait for emails to be sent.
            SendPriceAlertNotification::dispatch($alert->id, $event->newPrice)
                ->onQueue('notifications');
        }

        Log::info("Dispatched {$alerts->count()} price alert notifications for phone #{$event->phoneId}");
    }
}
