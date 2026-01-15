<?php

use App\Enums\ResponseCode;
use App\Http\Middleware\VerifyUserRequest;
use App\Services\ResponseService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        using: function () {
            Route::middleware(['api', 'verify.user'])
                ->prefix('api/v1')
                ->group(base_path('routes/api_v1.php'));
        },
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'verify.user' => VerifyUserRequest::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $responseService = app(ResponseService::class);

        $exceptions->render(function (AuthenticationException $e) use ($responseService) {
            return $responseService->generate(ResponseCode::Unauthorized);
        });
        $exceptions->render(function (AccessDeniedHttpException $e) use ($responseService) {
            return $responseService->generate(ResponseCode::Forbidden);
        });

        $exceptions->render(function (NotFoundHttpException $e) use ($responseService) {
            return $responseService->generate(ResponseCode::NotFound);
        });

        $exceptions->render(function (MethodNotAllowedHttpException $e) use ($responseService) {
            return $responseService->generate(ResponseCode::MethodNotAllowed);
        });

        $exceptions->render(function (ThrottleRequestsException $e) use ($responseService) {
            return $responseService->generate(ResponseCode::TooManyRequests);
        });

        $exceptions->render(function (ValidationException $e) use ($responseService) {
            return $responseService->generate(
                code: ResponseCode::BadRequest,
                data: [
                    'errors' => $e->errors(),
                ]
            );
        });

        $exceptions->render(function (Throwable $throwable) use ($responseService) {
            return $responseService->generate(ResponseCode::InternalServerError);
        });
    })
    ->create();
