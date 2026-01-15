<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ResponseCode;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Http\Requests\Api\V1\Auth\VerifyOtpRequest;
use App\Models\RefreshToken;
use App\Models\User;
use App\Services\LimiterService;
use App\Services\OtpService;
use App\Services\ResponseService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Throwable;

class AuthController extends Controller
{
    public function __construct(
        private LimiterService $limiterService,
        private OtpService $otpService,
        private ResponseService $responseService,
        private UserService $userService,
    ) {}

    public function register(RegisterRequest $request)
    {
        $email = $request->input('email');

        $user = User::where('email', $email)->first();

        if (is_null($user)) {
            $user = QueryHelper::retryOnDuplicate(fn() => User::create([
                'uuid' => str()->uuid(),
                'name' => $request->input('name'),
                'email' => $email,
                'password' => $request->input('password'),
            ]));
        } else {
            if (!is_null($user->email_verified_at)) {
                return $this->responseService->generate(
                    code: ResponseCode::BadRequest,
                    message: 'Email already registered'
                );
            }

            $user->update([
                'name' => $request->input('name'),
                'password' => $request->input('password'),
            ]);
        }

        $seconds = $this->otpService->send($user->email);

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'We have sent an OTP to your email',
            data: [
                'retryIn' => $seconds,
            ]
        );
    }

    public function login(LoginRequest $request)
    {
        $email = $request->input('email');

        $limiter = $this->limiterService->attempt(['login', $email, $request->ip()]);

        try {
            $user = User::where('email', $email)->firstOrFail();

            throw_if(is_null($user->email_verified_at));

            throw_unless(Hash::check($request->input('password'), $user->password));
        } catch (Throwable) {
            return $this->responseService->generate(
                code: ResponseCode::BadRequest,
                message: 'Email or password does not match our records'
            );
        }

        $this->limiterService->clear($limiter);

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            data: $this->userService->generateAuthTokens($user)
        );
    }

    public function verifyOtp(VerifyOtpRequest $request)
    {
        $email = $request->input('email');

        $limiter = $this->limiterService->attempt(['verify_otp', $email, $request->ip()]);

        $oneTimePassword = $this->otpService->verifyCode(
            email: $email,
            code: $request->input('code')
        );

        $this->limiterService->clear($limiter);

        $this->userService->verifyEmail($oneTimePassword);

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Your account has been activated'
        );
    }

    public function logout(Request $request)
    {
        RefreshToken::where('uuid', $request->input('refreshToken'))->delete();

        return $this->responseService->generate(ResponseCode::Ok);
    }

    public function getProfile()
    {
        return $this->responseService->generate(
            code: ResponseCode::Ok,
            data: $this->userService->getProfile()
        );
    }
}
