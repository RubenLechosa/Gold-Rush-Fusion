<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Courses;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CoursesController extends Controller
{

    //Esta funcion muestra el perfil del usuario
    public function getAllCoursesByCollege(Request $request) {
        $request->validate([
            "id_college" => "required"
        ]);

        if($college = Courses::where("id_course", "=", $request->id_college)) {
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
    
        if($user = User::where("id_user", "=", $request->id_user)->first()) {
            $courses = array();

            if($user->role == "college_manager") {
                $courses = Courses::where("courses.id_college", "=", $user->id_college)->leftJoin('users', 'courses.id_teacher', '=', 'users.id_user')->get();
            } else if($user->role == "teacher") {
                $courses = Courses::where("courses.id_college", "=", $user->id_college)->where("courses.id_teacher", "=", $user->id_user)->leftJoin('users', 'courses.id_teacher', '=', 'users.id_user')->get();
            } else if($user->role == "admin") {
                $courses = Courses::leftJoin('users', 'courses.id_teacher', '=', 'users.id_user')->get();
            } else {
                foreach (json_decode($user->courses, true) as $id_course) {
                    $courses[] = Courses::where("id_course", "=", $id_course)->leftJoin('users', 'courses.id_teacher', '=', 'users.id_user')->first();
                }    
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

    public function getDetailsCourse(Request $request) {
        $request->validate([
            "id_course" => "required"
        ]);

        if($courses = Courses::where("id_course", "=", $request->id_course)->first()) {
            return response()->json([
                "status" => 200,
                "data" => $courses
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No course data"
        ]);
    }

    
    public function getRanking(Request $request) {
        $request->validate([
            "id_course" => "required"
        ]);

        if($users = User::whereJsonContains('courses', $request->id_course)->orderBy('pepas', 'desc')->get()) {
            return response()->json([
                "status" => 200,
                "data" => $users
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No ranking data"
        ]);
    }

    public function createCourses(Request $request) {
        $request->validate([
            'course_name'  => 'required|min:4|max:20',
            'id_teacher' => 'required',
            'id_college' => 'required',
            'img' => ''

        ]);

        $courses = new Courses();
        $courses->course_name = $request->course_name;
        $courses->id_teacher = $request->id_teacher;
        $courses->id_college = $request->id_college;
        $courses->img = ($request->img ? $request->img : "");
        $courses->shop = "{}";
        $courses->requests = "[]";
        $courses->code = Str::random(5);

        if($courses->save()) {
            return response()->json([
                "status" => 200,
                "msg" => "¡Course creado con exito!",
                "id_course" => $courses->id_course
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "¡No se ha creado el course!"
        ]);
    }



    public function editCourse(Request $request) {
        $request->validate([
            'id_course' => 'required',
        ]);
        
        $set_clause_parts = [];
        foreach($request->all() as $key => $value) {
            if($key != "id_course") {
                $set_clause_parts[] = "{$key}='{$value}'";
            }
        }
                
        $set_clause = implode(', ', $set_clause_parts);
        $rows_affected = DB::update('UPDATE courses SET '.$set_clause.' where id_course = ?', [$request->id_course]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el course para actualizar",
        ]);
    }

    public function deleteCourses(Request $request) {
        $request->validate([
            'id_course' => 'required'
        ]);

        $rows_affected = DB::delete('delete from courses WHERE id = ?', [$request->id_course]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha borrado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el course para borrar",
        ]);
    }

    public function getAllUsersByRequests(Request $request) {
        $request->validate([
            "id_course" => "required"
        ]);
        $users = array();
        $course = Courses::where("id_course", "=", $request->id_course)->first();

        foreach (json_decode($course->requests, true) as $id_user) {
            if($user = User::where("id_user", "=", $id_user)->first()) {
                $users[] = $user;
            }
        }

        return response()->json([
            "status" => 200,
            "data" => $users
        ]);
    }

    public function resolveRequest(Request $request) {
        $request->validate([
            "id_course" => "required",
            "id_user" => "required",
            "accepted"    => "required"
        ]);

        $course = Courses::where("id_course", "=", $request->id_course)->first();

        if($course) {
            $user_request = json_decode($course->requests, true);

            foreach ($user_request as $idx => $id_user) {
                if($id_user == $request->id_user) {
                    unset($user_request[$idx]);
                }
            }

            $rows_affected = DB::update("UPDATE courses SET requests='".json_encode($user_request)."' where id_course = ?", [$request->id_course]);
            
            if($request->accepted) {
                $user = User::where("id_user", "=", $request->id_user)->first();
                $json = json_decode($user->courses, true);
                $json_encoded = json_encode(array_merge(array($request->id_course), $json));

                $rows_affected = DB::update("UPDATE users SET courses='".$json_encoded."' where id_user = ?", [$request->id_user]);
            }
        }

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Request solved",
            ]);
        }
    }

    public function refreshCode(Request $request) {
        $request->validate([
            "id_course" => "required"
        ]);
        $new_code = false;

        $course = Courses::where("id_course", "=", $request->id_course)->first();

        if($course) {
            do {
                $new_code = Str::random(5);
            } while (!$rows_affected = DB::update("UPDATE courses SET code='".$new_code."' where id_course = ?", [$request->id_course]));
        }

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "new_code"  => $new_code
            ]);
        }

        return response()->json([
            "status" => 400,
            "message"  => "Can't update code"
        ]);
    }
}
