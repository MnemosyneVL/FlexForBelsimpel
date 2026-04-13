<?php

namespace App\Console\Commands;

use App\Models\Plan;
use App\Services\ElasticsearchService;
use Illuminate\Console\Command;

/**
 * Artisan command to index all plans into Elasticsearch.
 *
 * Usage: php artisan es:index-plans
 */
class IndexPlansCommand extends Command
{
    protected $signature = 'es:index-plans';
    protected $description = 'Index all active plans into Elasticsearch';

    public function handle(ElasticsearchService $elasticsearch): int
    {
        $this->info('Creating plans index...');
        $elasticsearch->createPlansIndex();

        $plans = Plan::with('provider')->where('is_active', true)->get();

        $this->info("Indexing {$plans->count()} plans...");

        $bar = $this->output->createProgressBar($plans->count());

        foreach ($plans as $plan) {
            $elasticsearch->indexPlan([
                'id' => $plan->id,
                'name' => $plan->name,
                'provider_name' => $plan->provider->name,
                'provider_slug' => $plan->provider->slug,
                'monthly_cost_eur' => $plan->monthly_cost_eur,
                'data_gb' => $plan->data_gb,
                'network_type' => $plan->network_type,
                'contract_months' => $plan->contract_months,
                'is_unlimited_data' => $plan->is_unlimited_data,
                'is_unlimited_calls' => $plan->is_unlimited_calls,
            ]);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Plan indexing complete!');

        return Command::SUCCESS;
    }
}
