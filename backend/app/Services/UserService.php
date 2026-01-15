<?php

namespace App\Services;

use App\Exceptions\DataNotFoundException;
use App\Helpers\QueryHelper;
use App\Helpers\SecurityHelper;
use App\Mail\UserActivated;
use App\Models\OneTimePassword;
use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class UserService
{
    public function __construct(
        private Request $request
    ) {}

    public function setToRequest(User $user): void
    {
        $this->request->attributes->set('user', $user);
    }

    public function getFromRequest(): User
    {
        $user = $this->request->attributes->get('user');

        throw_if(is_null($user), new DataNotFoundException('User'));

        return $user;
    }

    public function getProfile(?User $user = null): array
    {
        $user ??= $this->getFromRequest();

        return [
            'name' => $user->name,
            'email' => $user->email,
        ];
    }

    public function generateAuthTokens(User $user, int $expiresIn = 86_400): array
    {
        $refreshToken = DB::transaction(function () use ($user, $expiresIn) {
            $refreshToken = QueryHelper::retryOnDuplicate(fn() => $user->refreshTokens()->create([
                'uuid' => str()->uuid(),
                'token' => str()->random(64),
                'expires_at' => now()->addSeconds($expiresIn),
            ]));

            return $refreshToken;
        });

        return array_merge(
            [
                'refreshToken' => $refreshToken->token,
                'refreshTokenExpiresIn' => $expiresIn,
            ],
            $this->generateAccessToken($user, $refreshToken),
            $this->getProfile($user)
        );
    }

    public function generateAccessToken(User $user, RefreshToken $refreshToken, int $expiresIn = 3_600): array
    {
        return [
            'accessToken' => SecurityHelper::generateJwt(
                sub: $user->uuid,
                aud: 'User',
                expiresIn: $expiresIn,
                extra: [
                    'refresh_token' => $refreshToken->uuid,
                ]
            ),
            'accessTokenExpiresIn' => $expiresIn,
        ];
    }

    public function verifyEmail(OneTimePassword $oneTimePassword): void
    {
        $oneTimePassword->load('user');
        $user = $oneTimePassword->user;

        DB::transaction(function () use ($user, $oneTimePassword) {
            $user->update([
                'email_verified_at' => now(),
            ]);

            $oneTimePassword->delete();

            Mail::to($user->email)->queue(new UserActivated($user));
        });
    }
}
