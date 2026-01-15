<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class UniqueNormalized implements ValidationRule
{
    protected string $modelClass;
    protected ?string $uuid;
    protected string $column;

    public function __construct(string $modelClass, ?string $uuid = null, string $column = 'name')
    {
        $this->modelClass = $modelClass;
        $this->uuid       = $uuid;
        $this->column     = $column;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $model = new $this->modelClass;

        $normalized = strtolower(preg_replace('/[\s_]+/', '', $value));

        $exists = $model->newQuery()
            ->when(
                $this->uuid,
                fn($q) =>
                $q->where('uuid', '!=', $this->uuid)
            )
            ->get()
            ->contains(function ($row) use ($normalized) {
                $dbNorm = strtolower(preg_replace('/[\s_]+/', '', $row->{$this->column}));
                return $dbNorm === $normalized;
            });

        if ($exists) {
            $fail("The :attribute has already been taken.");
        }
    }
}
