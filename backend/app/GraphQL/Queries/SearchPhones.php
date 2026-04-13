<?php

namespace App\GraphQL\Queries;

use App\Models\Phone;
use App\Services\ElasticsearchService;
use Illuminate\Support\Facades\Cache;

/**
 * Custom GraphQL resolver for phone search.
 *
 * This is where Elasticsearch does the heavy lifting. Instead of a simple
 * database query, we:
 *   1. Build an Elasticsearch query with the search term and filters
 *   2. Execute it to get matching phone IDs + facet counts
 *   3. Hydrate the IDs back into Eloquent models (so relationships work)
 *   4. Return items, total count, and facets for the filter sidebar
 *
 * Why not just use MariaDB?
 *   - MariaDB can't do fuzzy matching ("samung" → "Samsung")
 *   - MariaDB can't efficiently calculate facet counts (brand counts, price ranges)
 *   - Elasticsearch returns results in ~5ms vs ~50ms for a complex MariaDB query
 */
class SearchPhones
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

        // Cache search results for 5 minutes to reduce Elasticsearch load.
        // The cache key includes all search parameters so different searches
        // get different cache entries.
        $cacheKey = 'phone_search:' . md5(json_encode($args));

        return Cache::remember($cacheKey, 300, function () use ($query, $filters, $page, $perPage) {
            // Ask Elasticsearch for matching phone IDs and facet counts
            $searchResult = $this->elasticsearch->searchPhones($query, $filters, $page, $perPage);

            // Hydrate: load full Eloquent models from the IDs Elasticsearch returned.
            // We do this because Elasticsearch stores a simplified copy of the data,
            // but GraphQL needs the full model with relationships (brand, plans, etc.)
            $phones = [];
            if (!empty($searchResult['ids'])) {
                $phones = Phone::with('phoneBrand')
                    ->whereIn('id', $searchResult['ids'])
                    // Maintain Elasticsearch's relevance ordering
                    ->orderByRaw('FIELD(id, ' . implode(',', $searchResult['ids']) . ')')
                    ->get()
                    ->all();
            }

            return [
                'items' => $phones,
                'total' => $searchResult['total'],
                'facets' => $searchResult['facets'],
            ];
        });
    }
}
