<?php

namespace Tests\Unit;

use App\Models\Phone;
use App\Models\PhoneBrand;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Unit tests for phone-related business logic.
 *
 * These tests verify that our models, relationships, and scopes work correctly.
 * They use RefreshDatabase to start with a clean database for each test.
 */
class PriceComparisonServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_phone_belongs_to_brand(): void
    {
        $brand = PhoneBrand::create([
            'name' => 'Samsung',
            'slug' => 'samsung',
        ]);

        $phone = Phone::create([
            'phone_brand_id' => $brand->id,
            'name' => 'Galaxy S24',
            'slug' => 'galaxy-s24',
            'price_eur' => 899.00,
            'storage_gb' => 128,
            'ram_gb' => 8,
            'os' => 'Android 14',
        ]);

        // Verify the relationship works
        $this->assertEquals('Samsung', $phone->phoneBrand->name);
    }

    public function test_phone_active_scope_filters_inactive(): void
    {
        $brand = PhoneBrand::create([
            'name' => 'Apple',
            'slug' => 'apple',
        ]);

        Phone::create([
            'phone_brand_id' => $brand->id,
            'name' => 'iPhone 16',
            'slug' => 'iphone-16',
            'price_eur' => 969.00,
            'storage_gb' => 128,
            'ram_gb' => 8,
            'os' => 'iOS 18',
            'is_active' => true,
        ]);

        Phone::create([
            'phone_brand_id' => $brand->id,
            'name' => 'iPhone 14 (Discontinued)',
            'slug' => 'iphone-14',
            'price_eur' => 699.00,
            'storage_gb' => 128,
            'ram_gb' => 6,
            'os' => 'iOS 17',
            'is_active' => false,
        ]);

        // The active scope should only return 1 phone
        $activePhones = Phone::active()->get();
        $this->assertCount(1, $activePhones);
        $this->assertEquals('iPhone 16', $activePhones->first()->name);
    }

    public function test_phone_price_is_decimal(): void
    {
        $brand = PhoneBrand::create([
            'name' => 'Google',
            'slug' => 'google',
        ]);

        $phone = Phone::create([
            'phone_brand_id' => $brand->id,
            'name' => 'Pixel 9',
            'slug' => 'pixel-9',
            'price_eur' => 899.99,
            'storage_gb' => 128,
            'ram_gb' => 12,
            'os' => 'Android 14',
        ]);

        // Verify price is stored and retrieved as a proper decimal
        $phone->refresh();
        $this->assertEquals('899.99', $phone->price_eur);
    }
}
