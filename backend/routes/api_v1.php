<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\IngredientController;
use App\Http\Controllers\Api\V1\ListController;
use App\Http\Controllers\Api\V1\RecipeController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)
    ->prefix('auth')
    ->group(function () {
        Route::withoutMiddleware('verify.user')->group(function () {
            Route::post('register', 'register');
            Route::post('login', 'login');
            Route::post('verify-otp', 'verifyOtp');
        });

        Route::post('logout', 'logout')->name('logout');
        Route::get('profile', 'getProfile');
    });

Route::controller(CategoryController::class)
    ->prefix('categories')
    ->group(function () {
        Route::get('', 'index');
        Route::post('', 'store');
        Route::put('{uuid}', 'update');
        Route::delete('{uuid}', 'destroy');
    });

Route::controller(IngredientController::class)
    ->prefix('ingredients')
    ->group(function () {
        Route::get('', 'index');
        Route::post('', 'store');
        Route::put('{uuid}', 'update');
        Route::delete('{uuid}', 'destroy');
    });

Route::controller(RecipeController::class)
    ->prefix('recipes')
    ->group(function () {
        Route::get('', 'index');
        Route::get('{uuid}', 'show');
        Route::post('', 'store');
        Route::put('{uuid}', 'update');
        Route::delete('{uuid}', 'destroy');
    });

Route::controller(ListController::class)
    ->prefix('lists')
    ->group(function () {
        Route::get('categories', 'categories');
        Route::get('ingredients', 'ingredients');
    });
