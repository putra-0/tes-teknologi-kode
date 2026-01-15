<?php

namespace App\Helpers;

use Illuminate\Support\Carbon;

class DateHelper
{
    public static function formatIso(null|string|Carbon $date): ?string
    {
        return self::format($date, 'c');
    }

    private static function format(null|string|Carbon $date, string $format): ?string
    {
        if (is_string($date)) {
            $date = Carbon::parse($date);
        }

        return $date?->format($format);
    }
}
