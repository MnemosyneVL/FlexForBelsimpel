<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Plans table — phone subscription plans from Dutch telecom providers.
 *
 * Each plan belongs to a provider (KPN, Vodafone, etc.) and defines
 * what you get: data, minutes, SMS, and what it costs per month.
 *
 * Design decisions:
 *   - data_gb is nullable because NULL means "unlimited" — using NULL instead of
 *     a magic number (like 9999) is cleaner and avoids confusion
 *   - We have both is_unlimited_data and data_gb because some plans offer
 *     "unlimited" but with a fair-use limit (e.g., "unlimited" but throttled after 40GB)
 *   - contract_months defaults to 24 because that's the most common in NL
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained()->cascadeOnDelete();

            $table->string('name', 200);
            $table->string('slug', 200)->unique();
            $table->decimal('monthly_cost_eur', 6, 2);

            // Data allowance — NULL means unlimited
            $table->decimal('data_gb', 6, 1)->nullable();
            $table->integer('minutes')->nullable();  // NULL = unlimited
            $table->integer('sms')->nullable();       // NULL = unlimited

            $table->boolean('is_unlimited_data')->default(false);
            $table->boolean('is_unlimited_calls')->default(false);

            // Network type affects coverage and speed
            $table->enum('network_type', ['4G', '5G'])->default('4G');

            // Most Dutch contracts are 24 months, but 12 and 1 month exist too
            $table->tinyInteger('contract_months')->unsigned()->default(24);

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('monthly_cost_eur');
            $table->index('provider_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
