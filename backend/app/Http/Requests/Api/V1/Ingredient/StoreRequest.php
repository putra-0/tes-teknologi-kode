<?php

namespace App\Http\Requests\Api\V1\Ingredient;

use App\Models\Ingredient;
use App\Rules\UniqueNormalized;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'bail',
                'required',
                'string',
                new UniqueNormalized(Ingredient::class),
                'max:100'
            ],
        ];
    }
}
