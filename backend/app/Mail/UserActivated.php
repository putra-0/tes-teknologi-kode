<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserActivated extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        private User $user
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Account Has Been Activated',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.user-activated',
            with: [
                'name' => $this->user->name,
            ]
        );
    }
}
