<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\User_Submits\SubmitsCreateRequest;
use App\Http\Requests\User_Submits\SubmitsEditRequest;
use App\Http\Requests\Course\GetByCourseRequest;
use App\Http\Requests\User_Submits\SubmitsGetByIdRequest;
use App\Http\Requests\User_Submits\SubmitsGetByUserAndId;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Users_submits;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;


class Users_submitsController extends Controller
{
    public function findOne(SubmitsGetByUserAndId $request) {
        $request = $request->validated();

        if($submit = Users_submits::where("id_tasks", "=", $request["id_task"])->where("id_user", "=", $request["id_user"])->first()) {
            return response()->json([
                "status" => Response::HTTP_OK,
                "success"=> true,
                "data"  => $submit
            ]);
        }

        return response()->json([
            "status" => Response::HTTP_BAD_REQUEST,
            "success"=> false
        ]);
    }


     public function create(SubmitsCreateRequest $request) {
        $validated = $request->validated();
        if($submits = Users_submits::where("id_tasks", "=", $validated["id_tasks"])->where("id_user", "=", $validated["id_user"])->get()) {
            foreach ($submits as $idx => $submit) {
                $submit->delete();
            }
        }

        if(Users_submits::create($validated)) {
            return response()->json([
                "status" => Response::HTTP_OK,
                "success"=> true
            ]);
        }

        return response()->json([
            "status" => Response::HTTP_BAD_REQUEST,
            "success"=> false
        ]);
    }

    public function findByCourse(GetByCourseRequest $request) {
        $request = $request->validated();

        if($submits = Users_submits::where("id_course", "=", $request["id_course"])
                ->leftJoin('tasks', 'tasks.id_tasks', '=', 'users_submits.id_tasks')
                ->leftJoin('users', 'users.id_user', '=', 'users_submits.id_user')
                ->get()
        ) {
            return response()->json([
                "status" => Response::HTTP_OK,
                "success"=> true,
                "data"  => $submits
            ]);
        }

        return response()->json([
            "status" => Response::HTTP_BAD_REQUEST,
            "success"=> false
        ]);
    }

    public function update(SubmitsEditRequest $request) {
        $validated = $request->validated();

        if($submit = Users_submits::find($validated["id_users_submits"])) {
            $submit->fill($validated);

            if($submit->save()) {
                return response()->json([
                    "status" => Response::HTTP_OK,
                    "success"=> true
                ]);
            }
        }

        return response()->json([
            "status" => Response::HTTP_BAD_REQUEST,
            "success"=> false
        ]);
    }

    public function setMark(SubmitsEditRequest $request) {
        $validated = $request->validated();

        if($submit = Users_submits::find($validated["id_users_submits"])) {
            $user = User::find($submit["id_user"]);
            $user->pepas += $validated["mark"] * 10;
            $submit->fill($validated);

            if($submit->save()) {
                $user->save();
                
                return response()->json([
                    "status" => Response::HTTP_OK,
                    "success"=> true
                ]);
            }
        }

        return response()->json([
            "status" => Response::HTTP_BAD_REQUEST,
            "success"=> false
        ]);
    }

    public function delete(SubmitsGetByIdRequest $request) {
        $request = $request->validated();
        
        if($submit = Users_submits::where($request)->first()) {
            if($submit->delete()) {
                return response()->json([
                    "status" => Response::HTTP_OK,
                    "success"=> true
                ]);
            }
        }

        return response()->json([
            "status" => Response::HTTP_BAD_REQUEST,
            "success"=> false,
            "msg"   => "Submit not found",
        ]);
    }
}
