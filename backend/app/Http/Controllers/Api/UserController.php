<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Colleges;
use App\Models\Courses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //Esta funcion introduce un nuevo usuario a la BD
    public function register(Request $request) {
        $request->validate([
            'nick'  => 'required|unique:users',
            'name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:users',
            'college'=> 'required',
            'password' => 'required|confirmed|min:6'
        ]);

        $user = new User();
        $user->nick = $request->nick;
        $user->name = $request->name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->role = 'college_manager';
        $user->inventory = "{}";
        $user->courses = "{}";
        $user->password = Hash::make($request->password);

        $college = new Colleges();
        $college->college_name = $request->college;
        $college->logo = '/assets/img/default_logo_college.png';
        $college->save();

        $user->id_college = $college->id;
        
        if($user->save()) {
            return response()->json([
                "status" => 200,
                "msg" => "¡Registro de usuario exitoso!",
                "id_user" => $user->id_user
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "¡Registro Fallido!"
        ]);
    }

    //Esta funcion comprueba que el usuario existe y lo autentica con un token
    public function login(Request $request) {
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        $user = User::where("email", "=", $request->email)->first();
        if(isset($user->id_user)){
            if(Hash::check($request->password, $user->password)){

                return response()->json([
                    "status" => 200,
                    "id_user" => $user->id_user,
                    "access_token" => "logged"
                ]);
            }else{
                return response()->json([
                    "status" => 401,
                    "msg" => "La password es incorrecta",
                ]);
            }
        }else{
            return response()->json([
                "status" => 401,
                "msg" => "Usuario no registrado",
            ]);
        }
    }

    public function update(Request $request) {
        $request->validate([
            'id_user' => 'required',
        ]);
        
        $set_clause_parts = [];
        foreach($request->all() as $key => $value) {
            if($key != "id_user") {
                $set_clause_parts[] = "{$key}='{$value}'";
            }
        }
                
        $set_clause = implode(', ', $set_clause_parts);
        $rows_affected = DB::update('UPDATE users SET '.$set_clause.' where id_user = ?', [$request->id_user]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el profesor para actualizar",
        ]);
    }

        // Delete specific product
        public function delete(Request $request) {
            $request->validate([
                'id_user' => 'required'
            ]);
    
            $rows_affected = DB::delete('delete from users WHERE id_user = ?', [$request->id_user]);
    
            if($rows_affected > 0) {
                return response()->json([
                    "status" => 200,
                    "msg"   => "Se ha borrado con exito",
                ]);
            }
    
            return response()->json([
                "status" => 300,
                "msg"   => "No se ha encontrado el producto para borrar",
            ]);
        }

    //Esta funcion muestra el perfil del usuario
    public function getDetails(Request $request) {
        $request->validate([
            "id_user" => "required"
        ]);

        $user = User::where("id_user", "=", $request->id_user)->leftJoin('colleges', 'users.id_college', '=', 'colleges.id_college')->first();

        if($user) {
            return response()->json([
                "status" => 200,
                "data" => $user
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }

    public function getAllUsersByCourse(Request $request) {
        $request->validate([
            "id_course" => "required"
        ]);

        $users = User::whereJsonContains('courses', $request->id_course)->leftJoin('colleges', 'users.id_college', '=', 'colleges.id_college')->get();

        if($users) {
            return response()->json([
                "status" => 200,
                "data" => $users
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No users data"
        ]);
    }

    public function getAllUsersByCollege(Request $request) {
        $request->validate([
            "id_college" => "required"
        ]);

        $users = User::where("id_college", "=", $request->id_college)->get();

        if($users) {
            return response()->json([
                "status" => 200,
                "data" => $users
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }

    public function getAllTeachersByCollege(Request $request) {
        $request->validate([
            "id_college" => "required"
        ]);

        $user = User::where("id_college", "=", $request->id_college)->get();

        if($user) {
            return response()->json([
                "status" => 200,
                "data" => $user
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }

    public function addCourseToUser(Request $request) {
        $request->validate([
            "id_course" => "required",
            "id_user" => "required"
        ]);

        $user = User::where("id_user", "=", $request->id_user)->first();
        $json = json_decode($user->courses, true);
        $json_encoded = json_encode(array_merge(array($request->id_course), $json));

        $rows_affected = DB::update("UPDATE users SET courses='".$json_encoded."' where id_user = ?", [$request->id_user]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }

    public function removeCourseToUser(Request $request) {
        $request->validate([
            "id_course" => "required",
            "id_user" => "required"
        ]);

        $user = User::where("id_user", "=", $request->id_user)->first();
        $json = json_decode($user->courses, true);
        if (in_array($request->id_course, $json)) {
            unset($json[array_search($request->id_course ,$json)]);
        }

        $json_encoded = json_encode($json);
        $rows_affected = DB::update("UPDATE users SET courses='".$json_encoded."' where id_user = ?", [$request->id_user]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }

    public function modifyGems(Request $request) {
        $request->validate([
            "id_user" => "required",
            "pepas" => "required",
            "action"=> "required"
        ]);

        $user = User::where("id_user", "=", $request->id_user)->first();
        if($request->action == "sum") {
            $pepas = $user->pepas + $request->pepas;
        } else if($request->action == "res") {
            $pepas = $user->pepas - $request->pepas;
        } else {
            $pepas = $request->pepas;
        }

        if($pepas < 0) {
            $pepas = 0;
        }

        $rows_affected = DB::update("UPDATE users SET pepas='".$pepas."' where id_user = ?", [$request->id_user]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }

    public function joinCourseByCode(Request $request) {
        $request->validate([
            "id_user" => "required",
            "code" => "required"
        ]);

        $user = User::where("id_user", "=", $request->id_user)->first();
        if($course = Courses::where("code", "=", $request->code)->first()) {
            $json = json_decode($user->courses, true);
            $json_encoded = json_encode(array_merge(array($course->id_course), $json));
    
            $rows_affected = DB::update("UPDATE users SET courses='".$json_encoded."' where id_user = ?", [$request->id_user]);
    
            if($rows_affected > 0) {
                return response()->json([
                    "status" => 200,
                    "msg"   => "Se ha actualizado con exito",
                ]);
            }
        }

        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }
}
