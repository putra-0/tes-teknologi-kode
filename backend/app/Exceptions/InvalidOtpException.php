<?php

namespace App\Exceptions;

use App\Enums\ResponseCode;
use App\Services\ResponseService;
use Exception;
use Illuminate\Http\JsonResponse;

class InvalidOtpException extends Exception
{
    public function report(): void
    {
        //
    }

    public function render(): JsonResponse
    {
        return app(ResponseService::class)->generate(ResponseCode::InvalidOtp);
    }
}
