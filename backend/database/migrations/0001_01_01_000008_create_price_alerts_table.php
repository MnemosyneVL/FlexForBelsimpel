<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Price alerts table — "Notify me when this phone drops below €500."
 *
 * This is where RabbitMQ shines. When a phone's price changes:
 *   1. The PhoneObserver fires a PriceChanged event
 *   2. The HandlePriceChange listener checks this table for matching alerts
 *   3. For each match, it dispatches a SendPriceAlertNotification job to RabbitMQ
 *   4. The queue worker sends the email via Mailpit (dev) or a real mail service (prod)
 *
 * The user never waits for any of this — it all happens in the background.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // What to watch — at least one should be set
            $table->foreignId('phone_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('plan_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('phone_plan_id')->nullable()
                ->constrained('phone_plans')->nullOnDelete();

            // The target price — "alert me when it drops below this"
            $table->decimal('target_price_eur', 8, 2);

            // Once triggered, we don't send the notification again
            $table->boolean('is_triggered')->default(false);
            $table->timestamp('triggered_at')->nullable();

            $table->timestamps();

            // Composite index for the price alert check query:
            // "Find all untriggered alerts for this phone where target_price >= new_price"
            $table->index(['is_triggered', 'phone_id']);
            $table->index(['is_triggered', 'plan_id']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_alerts');
    }
};
