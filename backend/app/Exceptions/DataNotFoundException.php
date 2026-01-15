<?php

namespace App\Exceptions;

use App\Enums\ResponseCode;
use App\Services\ResponseService;
use Exception;
use Illuminate\Http\JsonResponse;

class DataNotFoundException extends Exception
{
    public function __construct(
        private string $name
    ) {}

    public function report(): void
    {
        //
    }

    public function render(): JsonResponse
    {
        return app(ResponseService::class)->generate(
            code: ResponseCode::NotFound,
            message: $this->name . ' not found'
        );
    }
}
