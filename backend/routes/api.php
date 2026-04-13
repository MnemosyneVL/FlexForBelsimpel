<?php

// API routes — these are prefixed with /api automatically.
//
// Most of our API is handled by GraphQL (Lighthouse), but we keep
// a few REST endpoints for things that don't fit the GraphQL pattern,
// like the health check.

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HealthCheckController;

// Health check endpoint — used by Docker healthchecks and monitoring tools
// to verify the application is running and can connect to its services.
Route::get('/health', HealthCheckController::class);
