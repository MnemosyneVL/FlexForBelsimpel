<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Email notification sent when a phone's price drops below the user's target.
 *
 * This uses Laravel's built-in notification system which supports
 * multiple channels (email, SMS, Slack, database, etc.)
 * We use the 'mail' channel to send an email.
 */
class PriceDropNotification extends Notification
{
    use Queueable;

    public function __construct(
        private string $phoneName,
        private float $oldPrice,
        private float $newPrice,
    ) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $savings = $this->oldPrice - $this->newPrice;

        return (new MailMessage)
            ->subject("Price Drop Alert: {$this->phoneName}")
            ->greeting("Good news, {$notifiable->name}!")
            ->line("The {$this->phoneName} has dropped in price.")
            ->line("Your target: €" . number_format($this->oldPrice, 2))
            ->line("New price: €" . number_format($this->newPrice, 2))
            ->line("You save: €" . number_format($savings, 2))
            ->action('View Phone', url('/'))
            ->line('Happy shopping!');
    }
}
