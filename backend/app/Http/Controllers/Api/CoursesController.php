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
        $courses->img = ($request->img ? $request->img : null);
        $courses->shop = "{}";
        $courses->code = Str::random(4);



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

}
