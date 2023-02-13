<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CollegeController;
use App\Http\Controllers\Api\CoursesController;
use App\Http\Controllers\Api\PopersController;
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
Route::post('users/modify-gems', [UserController::class, 'modifyGems']);
Route::post('users/get-users-college', [UserController::class, 'getAllUsersByCollege']);
Route::post('users/get-teachers-college', [UserController::class, 'getAllTeachersByCollege']);
Route::post('users/add-course', [UserController::class, 'addCourseToUser']);
Route::post('users/remove-course', [UserController::class, 'removeCourseToUser']);

// Courses
Route::post('users/get-courses', [CoursesController::class, 'getAllCoursesByUser']);
Route::post('users/join-course', [UserController::class, 'joinCourseByCode']);
Route::post('course/create-course', [CoursesController::class, 'createCourses']);
Route::post('course/save-course', [CoursesController::class, 'editCourse']);
Route::post('course/get-details', [CoursesController::class, 'getDetailsCourse']);
Route::post('course/get-users', [UserController::class, 'getAllUsersByCourse']);
Route::post('course/get-ranking', [CoursesController::class, 'getRanking']);

//Requests Course
Route::post('course/get-requests', [CoursesController::class, 'getAllUsersByRequests']);
Route::post('course/resolve-request', [CoursesController::class, 'resolveRequest']);

// Popers
Route::post('popers/create-poper', [PopersController::class, 'createPoper']);
// College
Route::post('college/get-college', [CollegeController::class, 'getAllCoursesByUser']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
