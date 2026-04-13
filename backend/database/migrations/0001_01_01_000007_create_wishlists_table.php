<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Wishlists table — lets users save phones, plans, or combinations they like.
 *
 * A user can save:
 *   - Just a phone (they like the phone but haven't decided on a plan)
 *   - Just a plan (they want this plan but haven't picked a phone)
 *   - A specific phone+plan combo (they know exactly what they want)
 *
 * We use nullable foreign keys because only one of the three needs to be set.
 * SET NULL on delete means if a phone is removed from the catalog, the wishlist
 * item stays (with a null phone_id) instead of being silently deleted.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // At least one of these should be set
            $table->foreignId('phone_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('plan_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('phone_plan_id')->nullable()
                ->constrained('phone_plans')->nullOnDelete();

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wishlists');
    }
};
