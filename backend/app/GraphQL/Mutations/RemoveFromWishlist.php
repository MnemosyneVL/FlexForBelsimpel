<?php

namespace App\GraphQL\Mutations;

/**
 * Removes an item from the user's wishlist.
 * Only the owner can delete their own wishlist items.
 */
class RemoveFromWishlist
{
    public function __invoke($root, array $args, $context): bool
    {
        $deleted = $context->user()
            ->wishlists()
            ->where('id', $args['id'])
            ->delete();

        return $deleted > 0;
    }
}
