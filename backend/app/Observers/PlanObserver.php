<?php

namespace App\Observers;

use App\Jobs\SyncPlanToElasticsearch;
use App\Models\Plan;

/**
 * PlanObserver — same pattern as PhoneObserver but for plans.
 * Keeps the Elasticsearch plans index in sync.
 */
class PlanObserver
{
    public function created(Plan $plan): void
    {
        SyncPlanToElasticsearch::dispatch($plan->id, 'index')
            ->onQueue('search-sync');
    }

    public function updated(Plan $plan): void
    {
        SyncPlanToElasticsearch::dispatch($plan->id, 'index')
            ->onQueue('search-sync');
    }

    public function deleted(Plan $plan): void
    {
        SyncPlanToElasticsearch::dispatch($plan->id, 'delete')
            ->onQueue('search-sync');
    }
}
