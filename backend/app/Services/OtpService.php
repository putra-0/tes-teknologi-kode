<?php

namespace App\Services;

use App\Exceptions\InvalidOtpException;
use App\Jobs\SendOtp;
use App\Models\OneTimePassword;
use App\Models\User;
use Throwable;

class OtpService
{
    public function __construct(
        private LimiterService $limiterService,
    ) {}

    public function send(string $email): int
    {
        $seconds = 60;

        $this->limiterService->attempt(
            segments: ['send_otp', $email],
            expiresIn: $seconds,
            maxAttempts: 1
        );

        try {
            $user = User::where('email', $email)->firstOrFail();
        } catch (Throwable) {
            $user = null;
        }

        if ($user instanceof User) {
            SendOtp::dispatch($user);
        }

        return $seconds;
    }

    public function verifyCode(string $email, string $code): OneTimePassword
    {
        $oneTimePassword = OneTimePassword::query()
            ->whereRelation('user', 'email', $email)
            ->where('code', $code)
            ->where('expires_at', '>', now())
            ->whereNull('code_used_at')
            ->first();

        throw_if(is_null($oneTimePassword), new InvalidOtpException);

        return $oneTimePassword;
    }
}
