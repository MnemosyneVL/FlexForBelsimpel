<?php

// Elasticsearch configuration.
//
// This is a custom config file (not part of Laravel by default).
// It defines how to connect to Elasticsearch and the index settings
// for our phone and plan search.

return [
    // Connection settings — in Docker, "elasticsearch" resolves to the ES container
    'host' => env('ELASTICSEARCH_HOST', 'elasticsearch'),
    'port' => env('ELASTICSEARCH_PORT', 9200),
    'scheme' => env('ELASTICSEARCH_SCHEME', 'http'),

    // Index names — prefixed to avoid collisions if the ES instance is shared
    'indices' => [
        'phones' => 'flex_phones',
        'plans' => 'flex_plans',
    ],

    // Default search settings
    'search' => [
        // How many results per page
        'default_size' => 12,
        // Maximum results per page (to prevent abuse)
        'max_size' => 100,
        // Fuzziness level for typo tolerance: "AUTO" means Elasticsearch
        // decides based on word length (1 typo for 3-5 chars, 2 for 6+)
        'fuzziness' => 'AUTO',
    ],
];
