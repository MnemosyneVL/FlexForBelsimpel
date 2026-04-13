<?php

namespace App\GraphQL\Queries;

use App\Models\Plan;
use App\Services\ElasticsearchService;
use Illuminate\Support\Facades\Cache;

/**
 * Custom resolver for plan search — same pattern as SearchPhones
 * but queries the plans Elasticsearch index instead.
 */
class SearchPlans
{
    public function __construct(
        private ElasticsearchService $elasticsearch
    ) {}

    public function __invoke($root, array $args): array
    {
        $query = $args['query'] ?? '';
        $filters = $args['filters'] ?? [];
        $page = $args['page'] ?? 1;
        $perPage = $args['perPage'] ?? 12;

        $cacheKey = 'plan_search:' . md5(json_encode($args));

        return Cache::remember($cacheKey, 300, function () use ($query, $filters, $page, $perPage) {
            $searchResult = $this->elasticsearch->searchPlans($query, $filters, $page, $perPage);

            $plans = [];
            if (!empty($searchResult['ids'])) {
                $plans = Plan::with('provider')
                    ->whereIn('id', $searchResult['ids'])
                    ->orderByRaw('FIELD(id, ' . implode(',', $searchResult['ids']) . ')')
                    ->get()
                    ->all();
            }

            return [
                'items' => $plans,
                'total' => $searchResult['total'],
                'facets' => $searchResult['facets'],
            ];
        });
    }
}
