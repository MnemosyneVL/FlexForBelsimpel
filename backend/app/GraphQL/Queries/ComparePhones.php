<?php

namespace App\GraphQL\Queries;

use App\Models\Phone;

/**
 * Resolver for comparing multiple phones side by side.
 *
 * The frontend sends up to 4 phone IDs, and we return them with
 * their full specs and available plans loaded. Simple query,
 * but it needs to be a custom resolver because @find only works
 * for a single item.
 */
class ComparePhones
{
    public function __invoke($root, array $args): array
    {
        $ids = $args['ids'];

        // Limit to 4 phones — comparing more than that gets unreadable
        $ids = array_slice($ids, 0, 4);

        return Phone::with(['phoneBrand', 'phonePlans.plan.provider'])
            ->whereIn('id', $ids)
            ->get()
            ->all();
    }
}
