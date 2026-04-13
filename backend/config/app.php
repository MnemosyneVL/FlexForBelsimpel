<?php

// Main application configuration.
// Laravel reads values from the .env file using the env() helper.
// The second argument is the default if the .env variable isn't set.

return [
    'name' => env('APP_NAME', 'FlexForBelsimpel'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    'timezone' => 'Europe/Amsterdam',
    'locale' => 'en',
    'fallback_locale' => 'en',
    'faker_locale' => 'nl_NL',
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
    'maintenance' => [
        'driver' => 'file',
    ],
];
