<?php

namespace App\GraphQL\Queries;

/**
 * Returns the authenticated user's price alerts.
 */
class MyPriceAlerts
{
    public function __invoke($root, array $args, $context): array
    {
        return $context->user()
            ->priceAlerts()
            ->with(['phone.phoneBrand', 'plan.provider'])
            ->latest()
            ->get()
            ->all();
    }
}
