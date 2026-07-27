<?php

return [
    'paths' => ['api/*','sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:4200'],//'allowed_origins' => ['http://localhost:4200', 'https://sos-mexico.com.mx','https://testsistemas.sos-mexico.com.mx'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['X-Refreshed-Token', 'X-Refreshed-Moriah'],
    'max_age' => 0,
    'supports_credentials' => true,
];
