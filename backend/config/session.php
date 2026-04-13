<?php

// Session configuration.
//
// Sessions track who is logged in. When a user logs in, Laravel creates
// a session ID (stored as a cookie in the browser) and maps it to their
// user data. We store this mapping in Redis for speed.

return [
    // Redis sessions are faster than database or file sessions.
    // Every request checks "is this user logged in?" — that check
    // takes <1ms with Redis vs ~5ms with a database query.
    'driver' => env('SESSION_DRIVER', 'redis'),

    'lifetime' => env('SESSION_LIFETIME', 120),
    'expire_on_close' => false,
    'encrypt' => false,
    'connection' => 'session',
    'table' => 'sessions',
    'store' => null,
    'lottery' => [2, 100],
    'cookie' => env('SESSION_COOKIE', 'flex_session'),
    'path' => '/',
    'domain' => env('SESSION_DOMAIN'),
    'secure' => env('SESSION_SECURE_COOKIE'),
    'http_only' => true,
    'same_site' => 'lax',
];
