<?php

namespace App\Helpers;

use Closure;
use Illuminate\Database\QueryException;

class QueryHelper
{
    public static function retryOnDuplicate(Closure $callback, int $maxRetry = 3): mixed
    {
        $retryCount = 0;

        do {
            $shouldRetry = false;

            try {
                return $callback();
            } catch (QueryException $e) {
                $duplicateErrorCode = match (config('database.connections.' . $e->getConnectionName() . '.driver')) {
                    'mysql' => '23000',
                    'pgsql' => '23505',
                    default => throw $e
                };

                if ($retryCount < $maxRetry && $e->getCode() === $duplicateErrorCode) {
                    $retryCount++;
                    $shouldRetry = true;
                } else {
                    throw $e;
                }
            }
        } while ($shouldRetry);
    }
}
