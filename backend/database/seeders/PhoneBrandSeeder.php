<?php

namespace Database\Seeders;

use App\Models\PhoneBrand;
use Illuminate\Database\Seeder;

/**
 * Seeds the phone_brands table with the major smartphone manufacturers
 * you'd find on Belsimpel's website.
 */
class PhoneBrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            ['name' => 'Samsung', 'slug' => 'samsung'],
            ['name' => 'Apple', 'slug' => 'apple'],
            ['name' => 'OnePlus', 'slug' => 'oneplus'],
            ['name' => 'Xiaomi', 'slug' => 'xiaomi'],
            ['name' => 'Google', 'slug' => 'google'],
            ['name' => 'Motorola', 'slug' => 'motorola'],
            ['name' => 'Nothing', 'slug' => 'nothing'],
        ];

        foreach ($brands as $brand) {
            PhoneBrand::create($brand);
        }
    }
}
