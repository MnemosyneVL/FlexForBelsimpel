<?php

namespace App\GraphQL\Queries;

use App\Models\Phone;
use Illuminate\Support\Facades\Cache;

/**
 * Recommends similar phones based on specs.
 *
 * This is a content-based recommendation: "If you like THIS phone,
 * you might also like THESE phones with similar specs."
 *
 * The similarity is based on:
 *   - Same or similar price range (within 30%)
 *   - Same OS (Android users get Android recommendations)
 *   - Similar storage tier
 *   - 5G compatibility match
 *
 * Results are cached in Redis for 24 hours per phone.
 * In a production system, this could be a machine learning model.
 * For this showcase, a simple spec-based algorithm demonstrates the concept.
 */
class PhoneRecommendations
{
    public function __invoke($root, array $args): array
    {
        $phoneId = $args['phoneId'];
        $limit = min($args['limit'] ?? 4, 8);

        $cacheKey = "recommendations:{$phoneId}:{$limit}";

        return Cache::remember($cacheKey, 86400, function () use ($phoneId, $limit) {
            $phone = Phone::find($phoneId);
            if (!$phone) {
                return [];
            }

            // Find phones in a similar price range (±30%)
            $minPrice = $phone->price_eur * 0.7;
            $maxPrice = $phone->price_eur * 1.3;

            return Phone::with('phoneBrand')
                ->where('id', '!=', $phoneId)
                ->where('is_active', true)
                ->where('os', $phone->os)
                ->whereBetween('price_eur', [$minPrice, $maxPrice])
                // Prefer phones with matching 5G capability
                ->orderByRaw('(is_5g = ?) DESC', [$phone->is_5g])
                // Then by closest storage size
                ->orderByRaw('ABS(storage_gb - ?) ASC', [$phone->storage_gb])
                ->limit($limit)
                ->get()
                ->all();
        });
    }
}
