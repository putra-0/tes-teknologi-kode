<?php

namespace App\Services;

use App\Enums\ResponseCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class ResponseService
{
    public function generate(
        ResponseCode $code,
        ?string $message = null,
        array $data = [],
        ?string $context = null
    ): JsonResponse {
        $status = substr($code->value, 0, 3);

        $message ??= $code->getMessage();

        if (!is_null($context)) {
            $message = sprintf('%s [%s]', $message, $context);
        }

        return response()->json(
            data: array_merge([
                'responseCode' => implode('', [
                    $status,
                    '00',
                    substr($code->value, 3),
                ]),
                'responseMessage' => $message,
            ], $data),
            status: (int) $status
        );
    }

    public function paginate(
        LengthAwarePaginator $paginator,
        ?string $message = null,
        array $data = []
    ): JsonResponse {
        return $this->generate(
            code: ResponseCode::Ok,
            message: $message,
            data: array_merge($data, [
                'items' => $paginator->items(),
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
                'perPage' => $paginator->perPage(),
                'totalItems' => $paginator->total(),
            ])
        );
    }
}
