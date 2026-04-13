<?php

namespace App\Jobs;

use App\Models\Phone;
use App\Services\ElasticsearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job: Sync a single phone to Elasticsearch.
 *
 * This job runs asynchronously via RabbitMQ. When a phone is created,
 * updated, or deleted, the PhoneObserver dispatches this job.
 * The queue worker picks it up and updates the Elasticsearch index.
 *
 * ShouldQueue interface tells Laravel "don't run this now, put it on the queue."
 * Without ShouldQueue, the job would run synchronously (blocking the HTTP response).
 */
class SyncPhoneToElasticsearch implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @param int $phoneId  The phone to sync
     * @param string $action  'index' to add/update, 'delete' to remove
     */
    public function __construct(
        private int $phoneId,
        private string $action,
    ) {}

    public function handle(ElasticsearchService $elasticsearch): void
    {
        if ($this->action === 'delete') {
            $elasticsearch->deletePhone($this->phoneId);
            Log::info("Deleted phone #{$this->phoneId} from Elasticsearch");
            return;
        }

        // Load the phone with its brand relationship
        $phone = Phone::with('phoneBrand')->find($this->phoneId);
        if (!$phone) {
            Log::warning("Phone #{$this->phoneId} not found, skipping ES sync");
            return;
        }

        $elasticsearch->indexPhone([
            'id' => $phone->id,
            'name' => $phone->name,
            'brand_name' => $phone->phoneBrand->name,
            'brand_slug' => $phone->phoneBrand->slug,
            'price_eur' => $phone->price_eur,
            'storage_gb' => $phone->storage_gb,
            'ram_gb' => $phone->ram_gb,
            'battery_mah' => $phone->battery_mah,
            'screen_size' => $phone->screen_size,
            'os' => $phone->os,
            'color' => $phone->color,
            'is_5g' => $phone->is_5g,
            'release_year' => $phone->release_year,
        ]);

        Log::info("Synced phone #{$this->phoneId} to Elasticsearch");
    }
}
