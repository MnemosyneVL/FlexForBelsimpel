<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Handles user registration.
 * Creates a new user account and returns an auth token.
 */
class Register
{
    public function __invoke($root, array $args): array
    {
        // Check if email is already taken
        if (User::where('email', $args['email'])->exists()) {
            throw ValidationException::withMessages([
                'email' => ['This email is already registered.'],
            ]);
        }

        // Validate password confirmation
        if ($args['password'] !== $args['password_confirmation']) {
            throw ValidationException::withMessages([
                'password' => ['Password confirmation does not match.'],
            ]);
        }

        $user = User::create([
            'name' => $args['name'],
            'email' => $args['email'],
            'password' => Hash::make($args['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
        ];
    }
}
