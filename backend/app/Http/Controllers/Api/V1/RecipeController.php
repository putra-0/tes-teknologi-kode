<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ResponseCode;
use App\Exceptions\DataNotFoundException;
use App\Helpers\DateHelper;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Recipe\IndexRequest;
use App\Http\Requests\Api\V1\Recipe\StoreRequest;
use App\Http\Requests\Api\V1\Recipe\UpdateRequest;
use App\Models\Category;
use App\Models\Ingredient;
use App\Models\Recipe;
use App\Services\ResponseService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Throwable;

class RecipeController extends Controller
{
    public function __construct(
        private ResponseService $responseService
    ) {}

    public function index(IndexRequest $request)
    {
        $categoryId = $request->filled('category')
            ? Category::where('uuid', $request->input('category'))->value('id')
            : null;

        $ingredientId = $request->filled('ingredient')
            ? Ingredient::where('uuid', $request->input('ingredient'))->value('id')
            : null;

        $sort = $request->array('sort');

        $recipes = Recipe::query()
            ->with(['category', 'ingredients'])
            ->when($categoryId !== null, function (Builder $query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($ingredientId !== null, function (Builder $query) use ($ingredientId) {
                $query->whereHas('ingredients', function (Builder $query) use ($ingredientId) {
                    $query->where('ingredient_id', $ingredientId);
                });
            })
            ->when($request->filled('searchQuery'), function (Builder $query) use ($request) {
                $query->where(
                    $request->string('searchBy')->snake(),
                    'ilike',
                    '%' . $request->input('searchQuery') . '%'
                );
            })
            ->when($sort !== [], function ($query) use ($sort) {
                foreach ($sort as $item) {
                    $query->orderBy(str()->snake($item['by']), $item['direction']);
                }
            })
            ->paginate($request->integer('perPage'))
            ->through(fn($item) => [
                'uuid' => $item->uuid,
                'name' => $item->name,
                'category' => [
                    'uuid' => $item->category->uuid,
                    'name' => $item->category->name,
                ],
                'description' => $item->description,
                'ingredients' => $item->ingredients->map(fn($ingredient) => [
                    'uuid' => $ingredient->uuid,
                    'name' => $ingredient->name,
                    'qty' => $ingredient->pivot->qty,
                    'unit' => $ingredient->pivot->unit,
                ]),
            ]);

        return $this->responseService->paginate($recipes);
    }

    public function show(string $uuid)
    {
        $recipe = Recipe::with(['category', 'ingredients'])
            ->where('uuid', $uuid)
            ->first();

        throw_if(is_null($recipe), new DataNotFoundException('Recipe'));

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            data: [
                'uuid' => $recipe->uuid,
                'name' => $recipe->name,
                'category' => [
                    'uuid' => $recipe->category->uuid,
                    'name' => $recipe->category->name,
                ],
                'description' => $recipe->description,
                'ingredients' => $recipe->ingredients->map(fn($ingredient) => [
                    'uuid' => $ingredient->uuid,
                    'name' => $ingredient->name,
                    'qty' => $ingredient->pivot->qty,
                    'unit' => $ingredient->pivot->unit,
                ]),
                'createdAt' => DateHelper::formatIso($recipe->created_at),
            ]
        );
    }

    public function store(StoreRequest $request)
    {
        $categoryId = Category::where('uuid', $request->input('category'))->value('id');

        throw_if(is_null($categoryId), new DataNotFoundException('Category'));

        $ingredients = $request->array('ingredients');

        DB::beginTransaction();

        try {
            $recipe = QueryHelper::retryOnDuplicate(fn() => Recipe::create([
                'uuid' => str()->uuid(),
                'category_id' => $categoryId,
                'name' => $request->input('name'),
                'description' => $request->input('description'),
            ]));

            foreach ($ingredients as $item) {
                $ingredientId = Ingredient::where('uuid', $item['uuid'])->value('id');

                throw_if(is_null($ingredientId), new DataNotFoundException('Ingredient'));

                $recipe->ingredients()->attach(
                    $ingredientId,
                    ['qty' => $item['qty'] ?? null, 'unit' => $item['unit']]
                );
            }
            DB::commit();
        } catch (Throwable) {
            DB::rollBack();
            return $this->responseService->generate(ResponseCode::InternalServerError);
        }

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Recipe created successfully',
        );
    }

    public function update(UpdateRequest $request, string $uuid)
    {
        $recipe = Recipe::where('uuid', $uuid)->first();

        throw_if(is_null($recipe), new DataNotFoundException('Recipe'));

        $recipe->update([
            'name' => $request->input('name', $recipe->name),
            'description' => $request->input('description', $recipe->description),
        ]);

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Recipe updated successfully',
        );
    }

    public function destroy(string $uuid)
    {
        $recipe = Recipe::where('uuid', $uuid)->first();

        throw_if(is_null($recipe), new DataNotFoundException('Recipe'));

        $recipe->delete();

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Recipe deleted successfully',
        );
    }
}
