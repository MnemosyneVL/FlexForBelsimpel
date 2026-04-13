<?php

// Mail configuration.
// In development, all emails go to Mailpit (localhost:8025).
// Price alert notifications use this to send "Your phone dropped in price!" emails.

return [
    'default' => env('MAIL_MAILER', 'smtp'),
    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'mailpit'),
            'port' => env('MAIL_PORT', 1025),
            'encryption' => env('MAIL_ENCRYPTION'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
        ],
    ],
    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'hello@flexforbelsimpel.com'),
        'name' => env('MAIL_FROM_NAME', 'FlexForBelsimpel'),
    ],
];
