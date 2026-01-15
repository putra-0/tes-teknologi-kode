<?php

namespace App\Jobs;

use App\Helpers\NumberHelper;
use App\Helpers\QueryHelper;
use App\Mail\OtpRequested;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendOtp implements ShouldQueue
{
    use Queueable;

    public function __construct(
        private User $user,
        private int $expirationMinutes = 5
    ) {
        $this->user = $user->withoutRelations();
    }

    public function handle(): void
    {
        $otp = QueryHelper::retryOnDuplicate(fn () => $this->user->oneTimePasswords()->create([
            'code' => NumberHelper::random(6),
            'token' => str()->random(64),
            'expires_at' => now()->addMinutes($this->expirationMinutes),
        ]));

        Mail::to($this->user->email)->send(new OtpRequested($this->user, $otp));
    }
}
