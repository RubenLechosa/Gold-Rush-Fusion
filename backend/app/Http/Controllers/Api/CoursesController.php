<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Courses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class CoursesController extends Controller
{

    //Esta funcion muestra el perfil del usuario
    public function getAllCoursesByCollege(Request $request) {
        $request->validate([
            "id_college" => "required"
        ]);

        if($college = Courses::where("id_college", "=", $request->id_college)->first()) {
            return response()->json([
                "status" => 200,
                "data" => $college
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }

    //Esta funcion muestra el perfil del usuario
    public function getAllCoursesByUser(Request $request) {
        $request->validate([
            "id_user" => "required"
        ]);
    
        if($user = User::where("id", "=", $request->id_user)->first()) {
            $courses = array();

            foreach (json_decode($user->courses, true) as $id_course) {
                $courses[] = Courses::where("id", "=", $id_course)->first();
            }
            
            return response()->json([
                "status" => 200,
                "data" => $courses
            ]);
        }
    
        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }
}
