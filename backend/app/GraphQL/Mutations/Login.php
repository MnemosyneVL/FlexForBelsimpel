<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * Handles user login via GraphQL.
 *
 * On success, creates a Sanctum personal access token and returns it.
 * The frontend stores this token and sends it with every request
 * in the Authorization header: "Bearer 12|abc123..."
 */
class Login
{
    public function __invoke($root, array $args): array
    {
        $user = User::where('email', $args['email'])->first();

        // Check if user exists and password matches
        if (!$user || !Hash::check($args['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create a new Sanctum token for this session.
        // 'auth-token' is just a name/label for the token.
        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
        ];
    }
}
