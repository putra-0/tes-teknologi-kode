<?php

namespace App\Helpers;

use Exception;

class NumberHelper
{
    public static function random(int $length): string
    {
        throw_if($length < 2, new Exception('Length must be at least 2'));

        return collect()
            ->range(1, $length)
            ->transform(fn() => random_int(0, 9))
            ->implode('');
    }
}
