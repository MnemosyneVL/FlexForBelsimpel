<?php

namespace Tests\Feature\GraphQL;

use App\Models\Phone;
use App\Models\PhoneBrand;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Feature tests for GraphQL phone queries.
 *
 * These test the full GraphQL endpoint — sending actual HTTP requests
 * and verifying the JSON response. This is closer to what happens
 * in production than unit tests.
 */
class PhoneQueryTest extends TestCase
{
    use RefreshDatabase;

    private PhoneBrand $brand;

    protected function setUp(): void
    {
        parent::setUp();

        $this->brand = PhoneBrand::create([
            'name' => 'Samsung',
            'slug' => 'samsung',
        ]);
    }

    public function test_can_query_single_phone_by_slug(): void
    {
        Phone::create([
            'phone_brand_id' => $this->brand->id,
            'name' => 'Galaxy S24',
            'slug' => 'galaxy-s24',
            'price_eur' => 899.00,
            'storage_gb' => 128,
            'ram_gb' => 8,
            'os' => 'Android 14',
            'is_5g' => true,
        ]);

        // Send a GraphQL query to the /graphql endpoint
        $response = $this->postJson('/graphql', [
            'query' => '
                query {
                    phone(slug: "galaxy-s24") {
                        name
                        price_eur
                        is_5g
                        phoneBrand {
                            name
                        }
                    }
                }
            ',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.phone.name', 'Galaxy S24');
        $response->assertJsonPath('data.phone.price_eur', 899.00);
        $response->assertJsonPath('data.phone.is_5g', true);
        $response->assertJsonPath('data.phone.phoneBrand.name', 'Samsung');
    }

    public function test_can_query_paginated_phones(): void
    {
        // Create 3 phones
        foreach (['Galaxy S24', 'Galaxy A55', 'Galaxy A35'] as $i => $name) {
            Phone::create([
                'phone_brand_id' => $this->brand->id,
                'name' => $name,
                'slug' => 'galaxy-' . ($i + 1),
                'price_eur' => 899 - ($i * 200),
                'storage_gb' => 128,
                'ram_gb' => 8,
                'os' => 'Android 14',
            ]);
        }

        $response = $this->postJson('/graphql', [
            'query' => '
                query {
                    phones(first: 2) {
                        data {
                            name
                        }
                        paginatorInfo {
                            total
                            currentPage
                            hasMorePages
                        }
                    }
                }
            ',
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.phones.paginatorInfo.total', 3);
        $response->assertJsonPath('data.phones.paginatorInfo.hasMorePages', true);
        $this->assertCount(2, $response->json('data.phones.data'));
    }

    public function test_phone_returns_null_for_nonexistent_slug(): void
    {
        $response = $this->postJson('/graphql', [
            'query' => '
                query {
                    phone(slug: "does-not-exist") {
                        name
                    }
                }
            ',
        ]);

        $response->assertOk();
        $this->assertNull($response->json('data.phone'));
    }
}
