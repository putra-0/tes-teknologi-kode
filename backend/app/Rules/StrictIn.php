<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class StrictIn implements ValidationRule
{
    public function __construct(
        private array|string|int $values
    ) {}

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!in_array($value, (array) $this->values, true)) {
            $fail('The :attribute field is invalid.');
        }
    }
}
