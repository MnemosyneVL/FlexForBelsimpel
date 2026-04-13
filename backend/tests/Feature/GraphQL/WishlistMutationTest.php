<?php

namespace Tests\Feature\GraphQL;

use App\Models\Phone;
use App\Models\PhoneBrand;
use App\Models\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Feature tests for wishlist GraphQL mutations.
 *
 * These test the authentication-protected endpoints.
 * We use Sanctum's actingAs() to simulate a logged-in user.
 */
class WishlistMutationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_add_to_wishlist(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $brand = PhoneBrand::create(['name' => 'Apple', 'slug' => 'apple']);
        $phone = Phone::create([
            'phone_brand_id' => $brand->id,
            'name' => 'iPhone 16',
            'slug' => 'iphone-16',
            'price_eur' => 969.00,
            'storage_gb' => 128,
            'ram_gb' => 8,
            'os' => 'iOS 18',
        ]);

        // Simulate an authenticated request using Sanctum
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/graphql', [
                'query' => '
                    mutation($input: WishlistInput!) {
                        addToWishlist(input: $input) {
                            id
                            phone {
                                name
                            }
                        }
                    }
                ',
                'variables' => [
                    'input' => [
                        'phone_id' => (string) $phone->id,
                        'notes' => 'Want this for Christmas',
                    ],
                ],
            ]);

        $response->assertOk();
        $response->assertJsonPath('data.addToWishlist.phone.name', 'iPhone 16');

        // Verify it's in the database
        $this->assertDatabaseHas('wishlists', [
            'user_id' => $user->id,
            'phone_id' => $phone->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_add_to_wishlist(): void
    {
        // Without actingAs(), the request is unauthenticated
        $response = $this->postJson('/graphql', [
            'query' => '
                mutation {
                    addToWishlist(input: { phone_id: "1" }) {
                        id
                    }
                }
            ',
        ]);

        // Should return an authentication error
        $response->assertOk(); // GraphQL always returns 200
        $this->assertNotNull($response->json('errors'));
    }
}
