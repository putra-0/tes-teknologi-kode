<?php

namespace App\Services;

use App\Exceptions\TooManyAttemptsException;
use Illuminate\Support\Facades\RateLimiter;

class LimiterService
{
    public function getKey(string|array $segments): string
    {
        return collect($segments)->prepend('limiter')->implode(':');
    }

    public function increment(string $key, int $expiresIn = 900): int
    {
        return RateLimiter::increment($key, $expiresIn);
    }

    public function attempt(string|array $segments, int $expiresIn = 900, int $maxAttempts = 3): string
    {
        $key = $this->getKey($segments);

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            throw new TooManyAttemptsException(RateLimiter::availableIn($key));
        }

        $this->increment($key, $expiresIn);

        return $key;
    }

    public function clear(string $key): void
    {
        RateLimiter::clear($key);
    }
}
