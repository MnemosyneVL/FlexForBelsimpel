<?php

namespace App\Jobs;

use App\Models\Plan;
use App\Services\ElasticsearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * Job: Sync a single plan to Elasticsearch.
 * Same pattern as SyncPhoneToElasticsearch.
 */
class SyncPlanToElasticsearch implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private int $planId,
        private string $action,
    ) {}

    public function handle(ElasticsearchService $elasticsearch): void
    {
        if ($this->action === 'delete') {
            $elasticsearch->deletePlan($this->planId);
            Log::info("Deleted plan #{$this->planId} from Elasticsearch");
            return;
        }

        $plan = Plan::with('provider')->find($this->planId);
        if (!$plan) {
            Log::warning("Plan #{$this->planId} not found, skipping ES sync");
            return;
        }

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

        Log::info("Synced plan #{$this->planId} to Elasticsearch");
    }
}
