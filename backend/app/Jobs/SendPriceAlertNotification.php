<?php

namespace App\Jobs;

use App\Models\PriceAlert;
use App\Notifications\PriceDropNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job: Send an email notification when a price alert triggers.
 *
 * This runs on the 'notifications' queue — a separate queue from 'search-sync'
 * because sending emails is lower priority than keeping search up to date.
 * The queue worker processes search-sync jobs first.
 *
 * In development, emails go to Mailpit (localhost:8025).
 * In production, they'd go to a real email service (SendGrid, Mailgun, etc.)
 */
class SendPriceAlertNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private int $alertId,
        private float $newPrice,
    ) {}

    public function handle(): void
    {
        $alert = PriceAlert::with(['user', 'phone.phoneBrand'])->find($this->alertId);

        if (!$alert || $alert->is_triggered) {
            return;
        }

        // Mark the alert as triggered so we don't send it again
        $alert->update([
            'is_triggered' => true,
            'triggered_at' => now(),
        ]);

        // Send the notification via Laravel's notification system.
        // The PriceDropNotification class defines how the email looks.
        $alert->user->notify(new PriceDropNotification(
            phoneName: $alert->phone?->name ?? 'Unknown Phone',
            oldPrice: (float) $alert->target_price_eur,
            newPrice: $this->newPrice,
        ));

        Log::info("Sent price alert notification to user #{$alert->user_id} for alert #{$this->alertId}");
    }
}
