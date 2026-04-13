<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Main database seeder — orchestrates all other seeders in the correct order.
 *
 * Order matters! Brands must exist before phones (phones reference brands).
 * Providers must exist before plans. Plans and phones must exist before phone_plans.
 *
 * Run with: php artisan db:seed
 * Or for a fresh start: php artisan migrate:fresh --seed
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create a demo user for testing the wishlist feature
        User::create([
            'name' => 'Demo User',
            'email' => 'demo@flexforbelsimpel.com',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        // Seed in dependency order
        $this->call([
            PhoneBrandSeeder::class,   // 1. Brands first (phones need them)
            ProviderSeeder::class,     // 2. Providers next (plans need them)
            PhoneSeeder::class,        // 3. Phones (reference brands)
            PlanSeeder::class,         // 4. Plans + PhonePlan combos (reference providers + phones)
        ]);
    }
}
