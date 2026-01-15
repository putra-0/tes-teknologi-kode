<?php

namespace App\Helpers;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class SecurityHelper
{
    public static function generateJwt(
        string $sub,
        string $aud,
        int $expiresIn = 900,
        array $extra = []
    ): string {
        $now = now();

        return JWT::encode(
            payload: array_merge([
                'iss' => config('app.url'),
                'sub' => $sub,
                'aud' => $aud,
                'exp' => $now->clone()->addSeconds($expiresIn)->timestamp,
                'nbf' => $now->timestamp,
                'iat' => $now->timestamp,
                'jti' => str()->uuid(),
            ], $extra),
            key: config('services.jwt.key'),
            alg: 'HS256'
        );
    }

    public static function verifyJwt(string $token): object
    {
        return JWT::decode($token, new Key(config('services.jwt.key'), 'HS256'));
    }
}
