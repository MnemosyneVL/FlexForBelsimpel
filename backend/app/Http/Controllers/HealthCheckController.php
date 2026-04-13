<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Health check endpoint that verifies all services are reachable.
 *
 * Docker and Kubernetes use this to know if the application is healthy.
 * If MariaDB or Redis is down, this returns a 503 (Service Unavailable)
 * so the orchestrator can restart the container.
 */
class HealthCheckController
{
    public function __invoke(): JsonResponse
    {
        $status = ['status' => 'ok'];
        $httpCode = 200;

        // Check MariaDB connection
        try {
            DB::connection()->getPdo();
            $status['database'] = 'connected';
        } catch (\Exception $e) {
            $status['database'] = 'error: ' . $e->getMessage();
            $httpCode = 503;
        }

        // Check Redis connection
        try {
            Cache::store('redis')->put('health_check', true, 10);
            $status['redis'] = 'connected';
        } catch (\Exception $e) {
            $status['redis'] = 'error: ' . $e->getMessage();
            $httpCode = 503;
        }

        if ($httpCode !== 200) {
            $status['status'] = 'degraded';
        }

        return response()->json($status, $httpCode);
    }
}
