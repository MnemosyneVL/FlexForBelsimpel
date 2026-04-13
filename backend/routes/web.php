<?php

// Web routes — these handle browser requests.
//
// In our architecture, we don't use web routes much because:
//   - The frontend is a separate React app (handled by Node.js)
//   - The API is handled by GraphQL (Lighthouse registers its own routes)
//
// This file exists mainly for Laravel's health check and any future
// server-rendered pages we might need.

use Illuminate\Support\Facades\Route;

// The root URL redirects to the React frontend.
// Nginx handles this routing, but this is a fallback in case
// someone hits Laravel directly.
Route::get('/', function () {
    return response()->json([
        'name' => 'FlexForBelsimpel API',
        'version' => '1.0.0',
        'graphql' => url('/graphql'),
        'graphiql' => url('/graphiql'),
    ]);
});
