<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phones table — the core of the application.
 *
 * Each row represents a specific phone model (e.g., "Samsung Galaxy S24 Ultra 256GB").
 * Different storage/color variants are separate rows because they have different prices.
 *
 * Design decisions:
 *   - price_eur uses DECIMAL(8,2) not FLOAT — floats have rounding errors with money
 *     (0.1 + 0.2 = 0.30000000000000004), DECIMAL stores exact values
 *   - camera_mp is a string because modern phones have multiple cameras ("108+12+5")
 *   - is_active lets us "soft-hide" discontinued phones without deleting them
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phones', function (Blueprint $table) {
            $table->id();

            // Foreign key to phone_brands — CASCADE means if you delete a brand,
            // all its phones get deleted too (prevents orphaned records)
            $table->foreignId('phone_brand_id')->constrained()->cascadeOnDelete();

            $table->string('name', 200);
            $table->string('slug', 200)->unique();
            $table->string('image_url', 500)->nullable();

            // Price in euros — DECIMAL(8,2) means up to 999,999.99
            // This is the SIM-free (without contract) price
            $table->decimal('price_eur', 8, 2);

            $table->smallInteger('release_year')->unsigned()->nullable();
            $table->decimal('screen_size', 3, 1)->nullable();  // e.g., 6.7 inches
            $table->smallInteger('storage_gb')->unsigned();
            $table->smallInteger('ram_gb')->unsigned();
            $table->integer('battery_mah')->unsigned()->nullable();
            $table->string('camera_mp', 100)->nullable();  // "108+12+5" for triple camera
            $table->string('os', 50)->default('Android');
            $table->string('color', 50)->nullable();
            $table->boolean('is_5g')->default(false);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Indexes for common queries — these speed up filtering and sorting
            $table->index('price_eur');
            $table->index('phone_brand_id');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phones');
    }
};
