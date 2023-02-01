<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    //Esta funcion introduce un nuevo usuario a la BD
    public function register(Request $request) {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'role' => 'required'
        ]);
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();
        return response()->json([
            "status" => 1,
            "msg" => "¡Registro de usuario exitoso!",
        ]);
    }

    //Esta funcion comprueba que el usuario existe y lo autentica con un token
    public function login(Request $request) {
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);
        $user = User::where("email", "=", $request->email)->first();
        if( isset($user->id) ){
            if(Hash::check($request->password, $user->password)){
                //creamos el token
                $token = $user->createToken("auth_token")->plainTextToken;
                //si está todo ok
                return response()->json([
                    "status" => 1,
                    "msg" => "¡Usuario logueado exitosamente!",
                    "access_token" => $token
                ]);
            }else{
                return response()->json([
                    "status" => 0,
                    "msg" => "La password es incorrecta",
                ], 404);
            }
        }else{
            return response()->json([
                "status" => 0,
                "msg" => "Usuario no registrado",
            ], 404);
        }
    }
    //Esta funcion muestra el perfil del usuario
    public function userProfile() {
        return response()->json([
            "status" => 1,
            "msg" => "Acerca del perfil de usuario",
            "data" => auth()->user()
        ]);
    }
    //Esta funcion cierra la sesion el usuario
    public function logout() {
        Auth::user()->tokens->each(function($token, $key) {
            $token->delete();
        });
        return response()->json([
            "status" => 1,
            "msg" => "Cierre de Sesión",
        ]);
    }
}
