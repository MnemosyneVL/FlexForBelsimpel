<?php

// This is Laravel's entry point — it wires together the application.
//
// In Laravel 11, this file replaces the old kernel classes. It's simpler:
// you register middleware, exception handling, and route files right here.

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        health: '/api/health',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Sanctum handles API token authentication for the wishlist feature.
        // It checks the Authorization header and loads the authenticated user.
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Exception handling can be customized here.
        // For now, Laravel's defaults are good enough.
    })
    ->create();
