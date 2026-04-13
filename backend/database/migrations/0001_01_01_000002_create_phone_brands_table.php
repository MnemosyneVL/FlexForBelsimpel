<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phone brands table — Samsung, Apple, OnePlus, etc.
 *
 * We store brands in a separate table (instead of just a string on the phone)
 * because:
 *   1. Consistent naming — "Samsung" won't accidentally become "samsung" or "SAMSUNG"
 *   2. Brand metadata — we can store logos, descriptions, etc.
 *   3. Efficient filtering — the search sidebar can show "Samsung (12)" by counting
 *      phones per brand_id, which is faster than grouping by a text column
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phone_brands', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            // Slug is the URL-friendly version: "One Plus" → "oneplus"
            // Used in URLs like /phones?brand=oneplus
            $table->string('slug', 100)->unique();
            $table->string('logo_url', 500)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phone_brands');
    }
};
