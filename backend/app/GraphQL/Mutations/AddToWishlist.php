<?php

namespace App\GraphQL\Mutations;

use App\Models\Wishlist;

/**
 * Adds a phone, plan, or phone+plan combo to the user's wishlist.
 */
class AddToWishlist
{
    public function __invoke($root, array $args, $context): Wishlist
    {
        $input = $args['input'];

        return $context->user()->wishlists()->create([
            'phone_id' => $input['phone_id'] ?? null,
            'plan_id' => $input['plan_id'] ?? null,
            'phone_plan_id' => $input['phone_plan_id'] ?? null,
            'notes' => $input['notes'] ?? null,
        ]);
    }
}
