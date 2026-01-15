<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ResponseCode;
use App\Helpers\DateHelper;
use App\Helpers\QueryHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Category\IndexRequest;
use App\Http\Requests\Api\V1\Category\StoreRequest;
use App\Http\Requests\Api\V1\Category\UpdateRequest;
use App\Models\Category;
use App\Services\ResponseService;
use Illuminate\Database\Eloquent\Builder;

class CategoryController extends Controller
{
    public function __construct(
        private ResponseService $responseService
    ) {}

    public function index(IndexRequest $request)
    {
        $sort = $request->array('sort');

        $categories = Category::query()
            ->when($sort !== [], function (Builder $query) use ($sort) {
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

        return $this->responseService->paginate($categories);
    }

    public function store(StoreRequest $request)
    {
        QueryHelper::retryOnDuplicate(fn() => Category::create([
            'uuid' => str()->uuid(),
            'name' => $request->input('name'),
        ]));

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Category created successfully.'
        );
    }

    public function update(UpdateRequest $request, string $uuid)
    {
        $category = Category::where('uuid', $uuid)->first();

        if (is_null($category)) {
            return $this->responseService->generate(
                code: ResponseCode::NotFound,
                message: 'Category not found.'
            );
        }

        $category->update($request->validated());

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Category updated successfully.'
        );
    }

    public function destroy(string $uuid)
    {
        $category = Category::where('uuid', $uuid)->first();

        if (is_null($category)) {
            return $this->responseService->generate(
                code: ResponseCode::NotFound,
                message: 'Category not found.'
            );
        }

        $category->delete();

        return $this->responseService->generate(
            code: ResponseCode::Ok,
            message: 'Category deleted successfully.'
        );
    }
}
