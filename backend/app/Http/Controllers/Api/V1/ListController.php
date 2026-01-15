<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\ResponseCode;
use App\Http\Controllers\Controller;
use App\Services\ResponseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListController extends Controller
{
    public function __construct(
        private ResponseService $responseService
    ) {}

    public function categories()
    {
        return $this->responseService->generate(
            code: ResponseCode::Ok,
            data: DB::table('categories')->select('uuid', 'name')->orderBy('name')->get()->toArray()
        );
    }

    public function ingredients()
    {
        return $this->responseService->generate(
            code: ResponseCode::Ok,
            data: DB::table('ingredients')->select('uuid', 'name')->orderBy('name')->get()->toArray()
        );
    }
}
