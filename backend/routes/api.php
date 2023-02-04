<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CollegeController;
use App\Http\Controllers\Api\CoursesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', [UserController::class, 'register']);
Route::post('login', [UserController::class, 'login']);

Route::post('users/get-user', [UserController::class, 'getDetails']);
Route::post('users/edit-user', [UserController::class, 'update']);

// Courses
Route::post('users/get-courses', [CoursesController::class, 'getAllCoursesByUser']);

// College
Route::post('college/get-college', [CollegeController::class, 'getAllCoursesByUser']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
