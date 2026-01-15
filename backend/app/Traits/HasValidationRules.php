<?php

namespace App\Traits;

use App\Rules\StrictIn;

trait HasValidationRules
{
    private function pagination(int $min = 10, int $max = 100): array
    {
        return [
            'page' => ['bail', 'required', 'integer', 'min:1'],
            'perPage' => ['bail', 'required', 'integer', 'min:' . $min, 'max:' . $max],
        ];
    }

    private function search(string|array $columns): array
    {
        return [
            'searchBy' => ['bail', 'nullable', 'required_with:searchQuery', new StrictIn($columns)],
            'searchQuery' => ['bail', 'nullable', 'string', 'max:100'],
        ];
    }

    private function sort(string|array $columns): array
    {
        return [
            'sort' => ['bail', 'required', 'array'],
            'sort.*.by' => ['bail', 'required', 'distinct', new StrictIn($columns)],
            'sort.*.direction' => ['bail', 'required', new StrictIn(['asc', 'desc'])],
        ];
    }

    private function category(
        bool $isRequired = true,
        bool $allowMultiple = false,
        bool $useSometimes = false,
        int $maxItems = 100
    ): array {
        return $this->filterRule(
            singular: 'category',
            plural: 'categories',
            isRequired: $isRequired,
            allowMultiple: $allowMultiple,
            useSometimes: $useSometimes,
            rules: ['uuid'],
            maxItems: $maxItems,
        );
    }

    private function ingredient(
        bool $isRequired = true,
        bool $allowMultiple = false,
        bool $useSometimes = false,
        int $maxItems = 100
    ): array {
        return $this->filterRule(
            singular: 'ingredient',
            plural: 'ingredients',
            isRequired: $isRequired,
            allowMultiple: $allowMultiple,
            useSometimes: $useSometimes,
            rules: ['uuid'],
            maxItems: $maxItems,
        );
    }

    private function requiredRule(bool $isRequired = true): string
    {
        return $isRequired ? 'required' : 'nullable';
    }

    private function filterRule(
        string $singular,
        string $plural,
        bool $isRequired,
        bool $allowMultiple,
        bool $useSometimes,
        array $rules,
        int $maxItems,
    ): array {
        $baseRules = ['bail', $this->requiredRule($isRequired)];

        if ($useSometimes) {
            array_splice($baseRules, 1, 0, 'sometimes');
        }

        if ($allowMultiple) {
            return [
                $plural => array_merge($baseRules, ['array', 'max:' . $maxItems]),
                $plural . '.*' => array_merge(['bail', 'distinct'], $rules),
            ];
        }

        return [
            $singular => array_merge($baseRules, $rules),
        ];
    }
}
