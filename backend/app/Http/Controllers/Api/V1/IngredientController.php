<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ResponseCode;
use App\Exceptions\DataNotFoundException;
use App\Helpers\DateHelper;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Ingredient\IndexRequest;
use App\Http\Requests\Api\V1\Ingredient\StoreRequest;
use App\Http\Requests\Api\V1\Ingredient\UpdateRequest;
use App\Models\Ingredient;
use App\Services\ResponseService;

class IngredientController extends Controller
{
    public function __construct(
        private ResponseService $responseService,
    ) {}

    public function index(IndexRequest $request)
    {
        $sort = $request->array('sort');

        $ingredients = Ingredient::query()
            ->when($sort !== [], function ($query) use ($sort) {
                foreach ($sort as $item) {
                    $query->orderBy(str()->snake($item['by']), $item['direction']);
                }
            })
            ->paginate($request->integer('perPage'))
            ->through(fn($item) => [
                'uuid' => $item->uuid,
                'name' => $item->name,
                'createdAt' => DateHelper::formatIso($item->created_at),
            ]);

        return $this->responseService->paginate($ingredients);
    }

    public function store(StoreRequest $request)
    {
        QueryHelper::retryOnDuplicate(fn() => Ingredient::create([
            'uuid' => str()->uuid(),
            'name' => $request->input('name'),
        ]));

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Ingredient created successfully.'
        );
    }

    public function update(UpdateRequest $request, string $uuid)
    {
        $ingredient = Ingredient::where('uuid', $uuid)->first();

        throw_if(is_null($ingredient), new DataNotFoundException('Ingredient'));

        $ingredient->update(['name' => $request->input('name', $ingredient->name)]);

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Ingredient updated successfully.'
        );
    }

    public function destroy(string $uuid)
    {
        $ingredient = Ingredient::where('uuid', $uuid)->first();

        throw_if(is_null($ingredient), new DataNotFoundException('Ingredient'));

        $ingredient->delete();

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Ingredient deleted successfully.'
        );
    }
}
