<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Colleges;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class CollegeController extends Controller
{
    //Esta funcion muestra el perfil del usuario
    public function getDetailsCollege(Request $request) {
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
            "msg" => "No college data"
        ]);
    }

    public function createCollege(Request $request) {
        $request->validate([
            'name'  => 'required|min:4|max:20',
            'logo' => 'required',
        ]);

        $college = new Colleges();
        $college->name = $request->name;
        $college->logo = $request->logo;
 

        
        if($college->save()) {
            return response()->json([
                "status" => 200,
                "msg" => "¡College creado con exito!",
                "id_college" => $college->id
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "¡No se ha creado el college!"
        ]);
    }



    public function editCollege(Request $request) {
        $request->validate([
            'id_college' => 'required',
        ]);
        
        $set_clause_parts = [];
        foreach($request->all() as $key => $value) {
            if($key != "id_college") {
                $set_clause_parts[] = "{$key}='{$value}'";
            }
        }
                
        $set_clause = implode(', ', $set_clause_parts);
        $rows_affected = DB::update('UPDATE colleges SET '.$set_clause.' where id = ?', [$request->id_college]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el college para actualizar",
        ]);
    }


    
    public function deleteCollege(Request $request) {
        $request->validate([
            'id_college' => 'required'
        ]);

        $rows_affected = DB::delete('delete from colleges WHERE id = ?', [$request->id_college]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha borrado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el college para borrar",
        ]);
    }
}
