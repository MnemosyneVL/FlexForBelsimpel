<?php

namespace App\Services;

use Elastic\Elasticsearch\Client;
use Elastic\Elasticsearch\ClientBuilder;
use Illuminate\Support\Facades\Log;

/**
 * ElasticsearchService — manages search indices and executes search queries.
 *
 * This service is the bridge between our Laravel app and Elasticsearch.
 * It handles three main tasks:
 *
 *   1. INDEX MANAGEMENT: Creating indices with proper field mappings
 *      (what type each field is: text, keyword, number, boolean)
 *
 *   2. DOCUMENT INDEXING: Sending phone/plan data to Elasticsearch
 *      so it can be searched
 *
 *   3. SEARCH QUERIES: Building and executing search requests with
 *      full-text search, filters, and aggregations (facet counts)
 *
 * Registered as a singleton in AppServiceProvider — one instance shared
 * across the entire application lifecycle.
 */
class ElasticsearchService
{
    private Client $client;
    private string $phonesIndex;
    private string $plansIndex;

    public function __construct()
    {
        // Build the Elasticsearch client with connection settings from config
        $host = config('elasticsearch.host', 'elasticsearch');
        $port = config('elasticsearch.port', 9200);
        $scheme = config('elasticsearch.scheme', 'http');

        $this->client = ClientBuilder::create()
            ->setHosts(["{$scheme}://{$host}:{$port}"])
            ->build();

        // Index names from config — prefixed to avoid collisions
        $this->phonesIndex = config('elasticsearch.indices.phones', 'flex_phones');
        $this->plansIndex = config('elasticsearch.indices.plans', 'flex_plans');
    }

    // =========================================================================
    // INDEX MANAGEMENT
    // =========================================================================

    /**
     * Create the phones index with explicit field mappings.
     *
     * Why explicit mappings? Without them, Elasticsearch guesses field types
     * when it first sees data. It might map "price_eur" as a long integer
     * instead of a float, breaking range queries. Explicit mappings ensure
     * every field is indexed exactly how we need it for search and aggregations.
     */
    public function createPhonesIndex(): void
    {
        // Delete existing index if it exists (for clean re-indexing)
        if ($this->client->indices()->exists(['index' => $this->phonesIndex])->asBool()) {
            $this->client->indices()->delete(['index' => $this->phonesIndex]);
        }

        $this->client->indices()->create([
            'index' => $this->phonesIndex,
            'body' => [
                'settings' => [
                    'number_of_shards' => 1,    // Single shard is fine for small datasets
                    'number_of_replicas' => 0,  // No replicas needed in dev
                ],
                'mappings' => [
                    'properties' => [
                        // "text" fields are analyzed for full-text search (tokenized, lowercased).
                        // The "keyword" sub-field stores the exact value for sorting and aggregations.
                        'name' => [
                            'type' => 'text',
                            'fields' => ['keyword' => ['type' => 'keyword']],
                        ],
                        'brand_name' => [
                            'type' => 'text',
                            'fields' => ['keyword' => ['type' => 'keyword']],
                        ],
                        // "keyword" fields are NOT analyzed — stored exactly as-is.
                        // Used for filtering and aggregations (facet counts).
                        'brand_slug' => ['type' => 'keyword'],
                        'price_eur' => ['type' => 'float'],
                        'storage_gb' => ['type' => 'integer'],
                        'ram_gb' => ['type' => 'integer'],
                        'battery_mah' => ['type' => 'integer'],
                        'screen_size' => ['type' => 'float'],
                        'os' => ['type' => 'keyword'],
                        'color' => ['type' => 'keyword'],
                        'is_5g' => ['type' => 'boolean'],
                        'release_year' => ['type' => 'short'],
                    ],
                ],
            ],
        ]);

        Log::info("Created Elasticsearch index: {$this->phonesIndex}");
    }

    /**
     * Create the plans index with mappings.
     */
    public function createPlansIndex(): void
    {
        if ($this->client->indices()->exists(['index' => $this->plansIndex])->asBool()) {
            $this->client->indices()->delete(['index' => $this->plansIndex]);
        }

        $this->client->indices()->create([
            'index' => $this->plansIndex,
            'body' => [
                'settings' => [
                    'number_of_shards' => 1,
                    'number_of_replicas' => 0,
                ],
                'mappings' => [
                    'properties' => [
                        'name' => [
                            'type' => 'text',
                            'fields' => ['keyword' => ['type' => 'keyword']],
                        ],
                        'provider_name' => [
                            'type' => 'text',
                            'fields' => ['keyword' => ['type' => 'keyword']],
                        ],
                        'provider_slug' => ['type' => 'keyword'],
                        'monthly_cost_eur' => ['type' => 'float'],
                        'data_gb' => ['type' => 'float'],
                        'network_type' => ['type' => 'keyword'],
                        'contract_months' => ['type' => 'short'],
                        'is_unlimited_data' => ['type' => 'boolean'],
                        'is_unlimited_calls' => ['type' => 'boolean'],
                    ],
                ],
            ],
        ]);

        Log::info("Created Elasticsearch index: {$this->plansIndex}");
    }

    // =========================================================================
    // DOCUMENT INDEXING
    // =========================================================================

    /**
     * Index a single phone document.
     *
     * We "denormalize" data here — storing brand_name and brand_slug
     * directly in the phone document. In a relational database, you'd JOIN
     * to the brands table. But Elasticsearch doesn't do JOINs, so we
     * flatten the data structure. This is a trade-off: faster reads,
     * but we need to re-index when a brand name changes.
     */
    public function indexPhone(array $phone): void
    {
        $this->client->index([
            'index' => $this->phonesIndex,
            'id' => $phone['id'],
            'body' => [
                'name' => $phone['name'],
                'brand_name' => $phone['brand_name'],
                'brand_slug' => $phone['brand_slug'],
                'price_eur' => (float) $phone['price_eur'],
                'storage_gb' => (int) $phone['storage_gb'],
                'ram_gb' => (int) $phone['ram_gb'],
                'battery_mah' => $phone['battery_mah'] ? (int) $phone['battery_mah'] : null,
                'screen_size' => $phone['screen_size'] ? (float) $phone['screen_size'] : null,
                'os' => $phone['os'],
                'color' => $phone['color'],
                'is_5g' => (bool) $phone['is_5g'],
                'release_year' => $phone['release_year'] ? (int) $phone['release_year'] : null,
            ],
        ]);
    }

    /**
     * Index a single plan document.
     */
    public function indexPlan(array $plan): void
    {
        $this->client->index([
            'index' => $this->plansIndex,
            'id' => $plan['id'],
            'body' => [
                'name' => $plan['name'],
                'provider_name' => $plan['provider_name'],
                'provider_slug' => $plan['provider_slug'],
                'monthly_cost_eur' => (float) $plan['monthly_cost_eur'],
                'data_gb' => $plan['data_gb'] ? (float) $plan['data_gb'] : null,
                'network_type' => $plan['network_type'],
                'contract_months' => (int) $plan['contract_months'],
                'is_unlimited_data' => (bool) $plan['is_unlimited_data'],
                'is_unlimited_calls' => (bool) $plan['is_unlimited_calls'],
            ],
        ]);
    }

    /**
     * Delete a phone document from the index.
     */
    public function deletePhone(int $phoneId): void
    {
        $this->client->delete([
            'index' => $this->phonesIndex,
            'id' => $phoneId,
        ]);
    }

    /**
     * Delete a plan document from the index.
     */
    public function deletePlan(int $planId): void
    {
        $this->client->delete([
            'index' => $this->plansIndex,
            'id' => $planId,
        ]);
    }

    // =========================================================================
    // SEARCH QUERIES
    // =========================================================================

    /**
     * Search phones with full-text search, filters, and faceted aggregations.
     *
     * This is the core search method. It builds an Elasticsearch query with:
     *
     *   1. MUST clause: full-text search on name and brand_name
     *      - Uses multi_match to search across multiple fields
     *      - "fuzziness: AUTO" enables typo tolerance
     *
     *   2. FILTER clauses: exact matches on brand, price range, storage, etc.
     *      - Filters don't affect relevance scoring (just include/exclude)
     *
     *   3. AGGREGATIONS: count documents per brand, price range, storage, OS
     *      - These become the facet counts in the filter sidebar
     *      - They run on the FILTERED results, so counts update as you filter
     *
     * Returns: ['ids' => [...], 'total' => int, 'facets' => [...]]
     */
    public function searchPhones(string $query, array $filters, int $page, int $perPage): array
    {
        $body = [
            'from' => ($page - 1) * $perPage,
            'size' => $perPage,
        ];

        // Build the bool query — Elasticsearch's way of combining conditions
        $must = [];
        $filter = [];

        // Full-text search: search across phone name and brand name
        if (!empty($query)) {
            $must[] = [
                'multi_match' => [
                    'query' => $query,
                    'fields' => ['name^2', 'brand_name'],  // ^2 means name matches are twice as important
                    'fuzziness' => config('elasticsearch.search.fuzziness', 'AUTO'),
                    'prefix_length' => 1,  // First character must match (prevents too many fuzzy results)
                ],
            ];
        }

        // Apply filters — these narrow results without affecting relevance score
        if (!empty($filters['brandSlugs'])) {
            $filter[] = ['terms' => ['brand_slug' => $filters['brandSlugs']]];
        }
        if (isset($filters['minPrice'])) {
            $filter[] = ['range' => ['price_eur' => ['gte' => $filters['minPrice']]]];
        }
        if (isset($filters['maxPrice'])) {
            $filter[] = ['range' => ['price_eur' => ['lte' => $filters['maxPrice']]]];
        }
        if (isset($filters['minStorage'])) {
            $filter[] = ['range' => ['storage_gb' => ['gte' => $filters['minStorage']]]];
        }
        if (isset($filters['minRam'])) {
            $filter[] = ['range' => ['ram_gb' => ['gte' => $filters['minRam']]]];
        }
        if (isset($filters['is5g'])) {
            $filter[] = ['term' => ['is_5g' => $filters['is5g']]];
        }
        if (!empty($filters['os'])) {
            $filter[] = ['term' => ['os' => $filters['os']]];
        }

        // Combine must and filter into a bool query
        $boolQuery = [];
        if (!empty($must)) {
            $boolQuery['must'] = $must;
        } else {
            // If no search query, match everything (just apply filters)
            $boolQuery['must'] = [['match_all' => new \stdClass()]];
        }
        if (!empty($filter)) {
            $boolQuery['filter'] = $filter;
        }

        $body['query'] = ['bool' => $boolQuery];

        // Aggregations — these generate the facet counts for the filter sidebar.
        // Each aggregation runs on all matching documents and groups them.
        $body['aggs'] = [
            // Count phones per brand: "Samsung (12), Apple (8), ..."
            'brands' => [
                'terms' => ['field' => 'brand_slug', 'size' => 20],
            ],
            // Count phones per price range: "€0-300 (5), €300-600 (8), ..."
            'price_ranges' => [
                'range' => [
                    'field' => 'price_eur',
                    'ranges' => [
                        ['key' => '0-300', 'to' => 300],
                        ['key' => '300-600', 'from' => 300, 'to' => 600],
                        ['key' => '600-900', 'from' => 600, 'to' => 900],
                        ['key' => '900-1200', 'from' => 900, 'to' => 1200],
                        ['key' => '1200+', 'from' => 1200],
                    ],
                ],
            ],
            // Count phones per storage option: "64GB (3), 128GB (15), ..."
            'storage_options' => [
                'terms' => ['field' => 'storage_gb', 'size' => 10],
            ],
            // Count phones per OS: "Android 14 (18), iOS 18 (5), ..."
            'operating_systems' => [
                'terms' => ['field' => 'os', 'size' => 10],
            ],
        ];

        // Execute the search
        $response = $this->client->search([
            'index' => $this->phonesIndex,
            'body' => $body,
        ])->asArray();

        // Extract phone IDs from search hits
        $ids = array_map(
            fn($hit) => (int) $hit['_id'],
            $response['hits']['hits']
        );

        // Format aggregation results into a simple key-count structure
        $facets = [
            'brands' => $this->formatTermsAgg($response['aggregations']['brands']),
            'priceRanges' => $this->formatRangeAgg($response['aggregations']['price_ranges']),
            'storageOptions' => $this->formatTermsAgg($response['aggregations']['storage_options']),
            'operatingSystems' => $this->formatTermsAgg($response['aggregations']['operating_systems']),
        ];

        return [
            'ids' => $ids,
            'total' => $response['hits']['total']['value'],
            'facets' => $facets,
        ];
    }

    /**
     * Search plans — same pattern as searchPhones but for the plans index.
     */
    public function searchPlans(string $query, array $filters, int $page, int $perPage): array
    {
        $body = [
            'from' => ($page - 1) * $perPage,
            'size' => $perPage,
        ];

        $must = [];
        $filter = [];

        if (!empty($query)) {
            $must[] = [
                'multi_match' => [
                    'query' => $query,
                    'fields' => ['name^2', 'provider_name'],
                    'fuzziness' => 'AUTO',
                    'prefix_length' => 1,
                ],
            ];
        }

        if (!empty($filters['providerSlugs'])) {
            $filter[] = ['terms' => ['provider_slug' => $filters['providerSlugs']]];
        }
        if (isset($filters['maxMonthlyCost'])) {
            $filter[] = ['range' => ['monthly_cost_eur' => ['lte' => $filters['maxMonthlyCost']]]];
        }
        if (isset($filters['minData'])) {
            $filter[] = ['range' => ['data_gb' => ['gte' => $filters['minData']]]];
        }
        if (!empty($filters['networkType'])) {
            $filter[] = ['term' => ['network_type' => $filters['networkType']]];
        }
        if (isset($filters['isUnlimitedData'])) {
            $filter[] = ['term' => ['is_unlimited_data' => $filters['isUnlimitedData']]];
        }
        if (isset($filters['contractMonths'])) {
            $filter[] = ['term' => ['contract_months' => $filters['contractMonths']]];
        }

        $boolQuery = [];
        if (!empty($must)) {
            $boolQuery['must'] = $must;
        } else {
            $boolQuery['must'] = [['match_all' => new \stdClass()]];
        }
        if (!empty($filter)) {
            $boolQuery['filter'] = $filter;
        }

        $body['query'] = ['bool' => $boolQuery];

        $body['aggs'] = [
            'providers' => [
                'terms' => ['field' => 'provider_slug', 'size' => 10],
            ],
            'network_types' => [
                'terms' => ['field' => 'network_type', 'size' => 5],
            ],
            'data_ranges' => [
                'range' => [
                    'field' => 'data_gb',
                    'ranges' => [
                        ['key' => '0-5GB', 'to' => 5],
                        ['key' => '5-15GB', 'from' => 5, 'to' => 15],
                        ['key' => '15-40GB', 'from' => 15, 'to' => 40],
                        ['key' => '40GB+', 'from' => 40],
                    ],
                ],
            ],
        ];

        $response = $this->client->search([
            'index' => $this->plansIndex,
            'body' => $body,
        ])->asArray();

        $ids = array_map(fn($hit) => (int) $hit['_id'], $response['hits']['hits']);

        $facets = [
            'providers' => $this->formatTermsAgg($response['aggregations']['providers']),
            'networkTypes' => $this->formatTermsAgg($response['aggregations']['network_types']),
            'dataRanges' => $this->formatRangeAgg($response['aggregations']['data_ranges']),
        ];

        return [
            'ids' => $ids,
            'total' => $response['hits']['total']['value'],
            'facets' => $facets,
        ];
    }

    // =========================================================================
    // HELPERS
    // =========================================================================

    /**
     * Format a terms aggregation into simple key-count pairs.
     * Input: { buckets: [{ key: "samsung", doc_count: 12 }, ...] }
     * Output: [{ key: "samsung", count: 12 }, ...]
     */
    private function formatTermsAgg(array $agg): array
    {
        return array_map(
            fn($bucket) => ['key' => (string) $bucket['key'], 'count' => $bucket['doc_count']],
            $agg['buckets']
        );
    }

    /**
     * Format a range aggregation into key-count pairs.
     * Input: { buckets: [{ key: "0-300", doc_count: 5 }, ...] }
     * Output: [{ key: "0-300", count: 5 }, ...]
     */
    private function formatRangeAgg(array $agg): array
    {
        return array_map(
            fn($bucket) => ['key' => $bucket['key'], 'count' => $bucket['doc_count']],
            $agg['buckets']
        );
    }
}
