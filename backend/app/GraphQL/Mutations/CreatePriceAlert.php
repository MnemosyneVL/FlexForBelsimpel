<?php

namespace App\GraphQL\Mutations;

use App\Models\PriceAlert;

/**
 * Creates a price alert — "Notify me when this drops below €X."
 *
 * When a phone or plan price changes, the HandlePriceChange listener
 * checks all pending alerts and sends notifications via RabbitMQ.
 */
class CreatePriceAlert
{
    public function __invoke($root, array $args, $context): PriceAlert
    {
        $input = $args['input'];

        return $context->user()->priceAlerts()->create([
            'phone_id' => $input['phone_id'] ?? null,
            'plan_id' => $input['plan_id'] ?? null,
            'phone_plan_id' => $input['phone_plan_id'] ?? null,
            'target_price_eur' => $input['target_price_eur'],
        ]);
    }
}
