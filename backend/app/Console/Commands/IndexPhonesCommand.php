<?php

namespace App\Console\Commands;

use App\Models\Phone;
use App\Services\ElasticsearchService;
use Illuminate\Console\Command;

/**
 * Artisan command to index all phones into Elasticsearch.
 *
 * Usage: php artisan es:index-phones
 *
 * This creates (or recreates) the phones index and bulk-indexes all active phones.
 * Run this after seeding the database or when you need to rebuild the search index.
 */
class IndexPhonesCommand extends Command
{
    protected $signature = 'es:index-phones';
    protected $description = 'Index all active phones into Elasticsearch';

    public function handle(ElasticsearchService $elasticsearch): int
    {
        $this->info('Creating phones index...');
        $elasticsearch->createPhonesIndex();

        $phones = Phone::with('phoneBrand')->where('is_active', true)->get();

        $this->info("Indexing {$phones->count()} phones...");

        // Use a progress bar so you can see indexing progress in the terminal
        $bar = $this->output->createProgressBar($phones->count());

        foreach ($phones as $phone) {
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
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Phone indexing complete!');

        return Command::SUCCESS;
    }
}
