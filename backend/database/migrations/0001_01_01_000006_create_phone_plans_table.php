<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phone-Plan combinations (pivot table with extra data).
 *
 * This is the heart of Belsimpel's business: "How much does it cost to get
 * THIS phone with THIS plan?" A regular pivot table just stores phone_id + plan_id.
 * We add pricing columns because the cost of a phone changes depending on which
 * plan you pair it with.
 *
 * Example:
 *   Samsung Galaxy S24 + KPN Unlimited = €0 upfront, €65/month for 24 months
 *   Samsung Galaxy S24 + Simpel 5GB    = €350 upfront, €15/month for 24 months
 *
 * total_cost_eur is pre-calculated: upfront + (monthly * contract_months)
 * This avoids recalculating it on every page load and makes sorting by total cost fast.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('phone_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('phone_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained()->cascadeOnDelete();

            // Monthly cost for this specific phone+plan combo
            $table->decimal('monthly_cost_eur', 6, 2);
            // One-time payment when you get the phone
            $table->decimal('upfront_cost_eur', 8, 2)->default(0);
            // Pre-calculated total: upfront + (monthly * contract_months)
            $table->decimal('total_cost_eur', 8, 2);

            $table->timestamps();

            // Each phone+plan combination should only exist once
            $table->unique(['phone_id', 'plan_id']);
            // Index for sorting by total cost (cheapest deals first)
            $table->index('total_cost_eur');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('phone_plans');
    }
};
