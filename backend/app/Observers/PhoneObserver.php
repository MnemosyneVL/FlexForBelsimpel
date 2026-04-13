<?php

namespace App\Observers;

use App\Events\PriceChanged;
use App\Jobs\SyncPhoneToElasticsearch;
use App\Models\Phone;

/**
 * PhoneObserver watches for changes to Phone models.
 *
 * Observers are Laravel's way of reacting to model events (created, updated, deleted).
 * Registered in AppServiceProvider::boot().
 *
 * When a phone is created or updated, we:
 *   1. Dispatch a job to sync the phone to Elasticsearch (so search stays current)
 *   2. Fire a PriceChanged event if the price actually changed (for price alerts)
 *
 * Both of these happen asynchronously via RabbitMQ — the HTTP response isn't delayed.
 */
class PhoneObserver
{
    /**
     * A new phone was added to the database.
     */
    public function created(Phone $phone): void
    {
        // Sync to Elasticsearch on the 'search-sync' queue
        SyncPhoneToElasticsearch::dispatch($phone->id, 'index')
            ->onQueue('search-sync');
    }

    /**
     * A phone was updated (price change, spec correction, etc.)
     */
    public function updated(Phone $phone): void
    {
        // Always sync to Elasticsearch when any field changes
        SyncPhoneToElasticsearch::dispatch($phone->id, 'index')
            ->onQueue('search-sync');

        // If the price specifically changed, fire the PriceChanged event.
        // isDirty('price_eur') checks if price_eur was modified in this update.
        if ($phone->isDirty('price_eur')) {
            $oldPrice = $phone->getOriginal('price_eur');
            $newPrice = $phone->price_eur;

            event(new PriceChanged(
                phoneId: $phone->id,
                oldPrice: (float) $oldPrice,
                newPrice: (float) $newPrice,
            ));
        }
    }

    /**
     * A phone was deleted from the database.
     */
    public function deleted(Phone $phone): void
    {
        // Remove from Elasticsearch so it doesn't appear in search results
        SyncPhoneToElasticsearch::dispatch($phone->id, 'delete')
            ->onQueue('search-sync');
    }
}
