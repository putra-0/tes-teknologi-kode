<?php

namespace App\Mail;

use App\Models\OneTimePassword;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpRequested extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        private User $user,
        private OneTimePassword $otp
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Register Verification Code'
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.otp-requested',
            with: [
                'name' => $this->user->name,
                'code' => $this->otp->code,
                'minutes' => (int) round($this->otp->created_at->diffInMinutes($this->otp->expires_at)),
            ]
        );
    }
}
