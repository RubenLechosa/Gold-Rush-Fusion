<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Colleges;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class CollegeController extends Controller
{
    //Esta funcion muestra el perfil del usuario
    public function getDetails(Request $request) {
        $request->validate([
            "id_college" => "required"
        ]);

        if($college = Colleges::where("id", "=", $request->id_college)->first()) {
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
}
