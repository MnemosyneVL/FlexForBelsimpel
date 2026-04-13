<?php

// Queue configuration.
//
// Queues let us run slow tasks in the background. When a user updates a
// phone price, we don't want them to wait while we update Elasticsearch
// AND check price alerts AND recalculate recommendations.
//
// Instead, we put those tasks on a queue (RabbitMQ), and a background
// worker picks them up one by one. The user sees "Price updated!" instantly.

return [
    // RabbitMQ is our queue driver — a dedicated message broker.
    // Belsimpel uses RabbitMQ, so we demonstrate it here.
    'default' => env('QUEUE_CONNECTION', 'rabbitmq'),

    'connections' => [
        // RabbitMQ connection — the main queue driver
        'rabbitmq' => [
            'driver' => 'rabbitmq',
            'host' => env('RABBITMQ_HOST', 'rabbitmq'),
            'port' => env('RABBITMQ_PORT', 5672),
            'user' => env('RABBITMQ_USER', 'flex'),
            'password' => env('RABBITMQ_PASSWORD', 'secret'),
            'vhost' => env('RABBITMQ_VHOST', '/'),
            'queue' => env('RABBITMQ_QUEUE', 'default'),

            'options' => [
                'queue' => [
                    // Durable queues survive RabbitMQ restarts
                    'durable' => true,
                ],
            ],
        ],

        // Sync driver runs jobs immediately (useful for debugging)
        'sync' => [
            'driver' => 'sync',
        ],
    ],

    // Failed jobs are stored in the database so we can retry them later.
    // Run `php artisan queue:retry all` to retry all failed jobs.
    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'mariadb'),
    ],
];
