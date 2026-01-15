<?php

namespace App\Http\Requests\Api\V1\Recipe;

use App\Traits\HasValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */

    use HasValidationRules;
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
        return array_merge(
            $this->category(),
            [
                'name' => ['bail', 'required', 'string', 'max:100'],
                'description' => ['bail', 'nullable', 'string'],
                'ingredients' => ['bail', 'required', 'array', 'min:1'],
                'ingredients.*.uuid' => ['bail', 'required', 'string', 'exists:ingredients,uuid'],
                'ingredients.*.qty' => ['bail', 'nullable', 'numeric', 'min:0' ],
                'ingredients.*.unit' => ['bail', 'required', 'string', 'max:50' ],
            ]
        );
    }
}
