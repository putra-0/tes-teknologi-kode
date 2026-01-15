<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\Category;

class UniqueCategoryName implements ValidationRule
{
    protected ?string $uuid;

    public function __construct(?string $uuid = null)
    {
        $this->uuid = $uuid;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $normalized = strtolower(preg_replace('/[\s_]+/', '', $value));

        $exists = Category::query()
            ->when($this->uuid, fn($q) => $q->where('uuid', '!=', $this->uuid))
            ->get()
            ->contains(function ($cat) use ($normalized) {
                $dbNorm = strtolower(preg_replace('/[\s_]+/', '', $cat->name));
                return $dbNorm === $normalized;
            });

        if ($exists) {
            $fail('The :attribute has already been taken.');
        }
    }
}
