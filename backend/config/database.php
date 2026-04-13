<?php

// Database configuration.
//
// We use MariaDB as our primary database (Belsimpel's choice).
// The "mariadb" connection is essentially the same as "mysql" —
// MariaDB is a fork of MySQL and uses the same protocol/driver.

return [
    'default' => env('DB_CONNECTION', 'mariadb'),

    'connections' => [
        // MariaDB — primary database for all structured data
        'mariadb' => [
            'driver' => 'mariadb',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'flexforbelsimpel'),
            'username' => env('DB_USERNAME', 'flex'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
        ],
    ],

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],

    // Redis connections — used for cache, sessions, and rate limiting.
    // We define separate "databases" (0, 1, 2) to keep data isolated:
    //   database 0: general cache
    //   database 1: sessions
    //   database 2: queue (not used since we use RabbitMQ, but kept as fallback)
    'redis' => [
        'client' => env('REDIS_CLIENT', 'phpredis'),

        'default' => [
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', 6379),
            'database' => env('REDIS_DB', 0),
        ],

        'cache' => [
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', 6379),
            'database' => env('REDIS_CACHE_DB', 1),
        ],

        'session' => [
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', 6379),
            'database' => env('REDIS_SESSION_DB', 2),
        ],
    ],
];
