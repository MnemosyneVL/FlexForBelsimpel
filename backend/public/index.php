<?php

// This is the single entry point for all HTTP requests to the Laravel backend.
// Nginx points here for /graphql and /graphiql routes.
// Every request goes through this file → Laravel router → your controller/resolver.

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Check if the application is in maintenance mode
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Load Composer's autoloader — this makes all PHP classes available
require __DIR__ . '/../vendor/autoload.php';

// Boot the Laravel application and handle the incoming request
$app = require_once __DIR__ . '/../bootstrap/app.php';

$app->handleRequest(Request::capture());
