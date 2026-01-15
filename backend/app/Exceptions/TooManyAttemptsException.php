<?php

namespace App\Exceptions;

use App\Enums\ResponseCode;
use App\Services\ResponseService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Carbon;

class TooManyAttemptsException extends Exception
{
    public function __construct(
        private int $seconds
    ) {}

    public function report(): void
    {
        //
    }

    public function render(): JsonResponse
    {
        $seconds = max($this->seconds, 2);

        $availableAt = now()
            ->addSeconds($seconds)
            ->diffForHumans(syntax: Carbon::DIFF_ABSOLUTE, parts: 7);

        return app(ResponseService::class)->generate(
            code: ResponseCode::TooManyRequests,
            message: 'Too many attempts. Please try again in ' . $availableAt,
            data: [
                'retryIn' => $seconds,
            ]
        );
    }
}
