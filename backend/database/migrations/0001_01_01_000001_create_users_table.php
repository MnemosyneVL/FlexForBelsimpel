<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Users table — stores registered accounts.
 *
 * Users need an account to use the wishlist and price alert features.
 * This is a standard Laravel users table with Sanctum token support
 * for API authentication.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // Email must be unique — you can't register twice with the same email
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            // Password is hashed (bcrypt) — we never store plain text passwords
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        // Laravel Sanctum uses personal_access_tokens for API authentication.
        // When a user logs in, they get a token like "12|abc123..." that they
        // send with every request in the Authorization header.
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
        Schema::dropIfExists('users');
    }
};
