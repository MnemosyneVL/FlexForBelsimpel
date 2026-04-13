<?php

// Cache configuration.
//
// Caching stores frequently accessed data in a fast storage layer (Redis)
// so we don't need to query the database or Elasticsearch every time.
//
// Example: The list of phone brands rarely changes. Instead of querying
// MariaDB on every page load, we cache it in Redis for 1 hour.

return [
    // Use Redis as the default cache store.
    // Other options: 'file', 'database', 'memcached', 'array' (for testing)
    'default' => env('CACHE_STORE', 'redis'),

    'stores' => [
        'redis' => [
            'driver' => 'redis',
            'connection' => 'cache',
            'lock_connection' => 'default',
        ],

        // Array store is used in tests — it stores data in PHP memory
        // and doesn't persist between requests. Perfect for isolated tests.
        'array' => [
            'driver' => 'array',
            'serialize' => false,
        ],
    ],

    // All cache keys get this prefix to avoid collisions
    // if multiple apps share the same Redis instance.
    'prefix' => env('CACHE_PREFIX', 'flex_cache_'),
];
