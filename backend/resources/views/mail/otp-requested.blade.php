<div style="background-color: #f1f1f1; padding: 40px 0; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 4px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-size: 14px; color: #36454f;">
        <p>Dear <strong>{{ $name }}</strong>,</p>

        <p>We have received a request to sign up for a new account. Please use the verification code provided below within <strong>{{ $minutes }} minutes</strong> to complete the process.</p>

        <div style="background-color: #e1ebee; padding: 12px; margin: 0; border-radius: 4px; font-size: 18px; font-weight: 600; color: #005a9c; text-align: center;">
            {{ $code }}
        </div>

        <p>For security purposes, <strong>please do not share this code with anyone</strong>. If you did not initiate this request, you may safely disregard this email. Your account remains secure and no further action is required.</p>

        <p>
            Sincerely,<br>
            {{ config('app.name') }}
        </p>
    </div>
</div>
