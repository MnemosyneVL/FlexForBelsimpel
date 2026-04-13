<?php

namespace App\GraphQL\Queries;

/**
 * Returns the authenticated user's wishlist items.
 * The @guard directive on the schema ensures only logged-in users can call this.
 */
class MyWishlist
{
    public function __invoke($root, array $args, $context): array
    {
        return $context->user()
            ->wishlists()
            ->with(['phone.phoneBrand', 'plan.provider', 'phonePlan'])
            ->latest()
            ->get()
            ->all();
    }
}
