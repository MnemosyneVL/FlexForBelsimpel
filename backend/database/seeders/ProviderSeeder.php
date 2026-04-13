<?php

namespace Database\Seeders;

use App\Models\Provider;
use Illuminate\Database\Seeder;

/**
 * Seeds Dutch telecom providers — the companies whose plans Belsimpel compares.
 * These are real companies operating in the Netherlands.
 */
class ProviderSeeder extends Seeder
{
    public function run(): void
    {
        $providers = [
            [
                'name' => 'KPN',
                'slug' => 'kpn',
                'website_url' => 'https://www.kpn.com',
            ],
            [
                'name' => 'Vodafone',
                'slug' => 'vodafone',
                'website_url' => 'https://www.vodafone.nl',
            ],
            [
                'name' => 'T-Mobile',
                'slug' => 't-mobile',
                'website_url' => 'https://www.t-mobile.nl',
            ],
            [
                'name' => 'Tele2',
                'slug' => 'tele2',
                'website_url' => 'https://www.tele2.nl',
            ],
            [
                'name' => 'Simpel',
                'slug' => 'simpel',
                'website_url' => 'https://www.simpel.nl',
            ],
        ];

        foreach ($providers as $provider) {
            Provider::create($provider);
        }
    }
}
