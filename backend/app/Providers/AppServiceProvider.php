<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use App\Models\Phone;
use App\Models\Plan;
use App\Observers\PhoneObserver;
use App\Observers\PlanObserver;
use App\Services\ElasticsearchService;
use App\Events\PriceChanged;
use App\Listeners\HandlePriceChange;
use Illuminate\Support\Facades\Event;

/**
 * The AppServiceProvider is the central place to register application services.
 *
 * Think of it as the "setup" class that runs when the application boots.
 * We use it to:
 *   1. Register the Elasticsearch service as a singleton (one instance shared everywhere)
 *   2. Register model observers (watch for data changes to sync Elasticsearch)
 *   3. Set up rate limiting for the GraphQL API
 */
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register services into the application container.
     *
     * "Registering" means telling Laravel: "When someone asks for an
     * ElasticsearchService, give them THIS specific instance."
     */
    public function register(): void
    {
        // Singleton = only one instance exists for the entire application lifecycle.
        // We don't need multiple Elasticsearch clients — one connection is enough.
        $this->app->singleton(ElasticsearchService::class, function ($app) {
            return new ElasticsearchService();
        });
    }

    /**
     * Bootstrap services — this runs after ALL providers are registered.
     */
    public function boot(): void
    {
        // Model observers watch for create/update/delete events on Eloquent models.
        // When a phone is updated, the observer dispatches a job to sync Elasticsearch.
        Phone::observe(PhoneObserver::class);
        Plan::observe(PlanObserver::class);

        // Event listeners — when a price changes, check if any alerts should fire.
        // This decouples the "price changed" event from the "notify user" logic.
        Event::listen(PriceChanged::class, HandlePriceChange::class);

        // Rate limiting prevents API abuse.
        // Guests get 60 requests per minute, authenticated users get 120.
        // This is backed by Redis for fast, distributed counting.
        RateLimiter::for('graphql', function (Request $request) {
            return $request->user()
                ? Limit::perMinute(120)->by($request->user()->id)
                : Limit::perMinute(60)->by($request->ip());
        });
    }
}
