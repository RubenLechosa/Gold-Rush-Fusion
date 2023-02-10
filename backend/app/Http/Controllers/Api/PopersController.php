<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Popers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PopersController extends Controller
{
    
    public function getDetailsPopers(Request $request) {
        $request->validate([
            "id_poper" => "required"
        ]);

        if($poper = Popers::where("id", "=", $request->id_poper)->first()) {
            return response()->json([
                "status" => 200,
                "data" => $poper
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No poper data"
        ]);
    }



    public function createPoper(Request $request) {
        $request->validate([
            'poper_name'  => 'required|min:4|max:20',
            'skin' => 'required',
            'stats'=> 'required',
            'element' => 'required'
        ]);

        $poper = new Popers();
        $poper->poper_name = $request->poper_name;
        $poper->skin = $request->skin;
        $poper->level = 1;
        $poper->current_exp = 0;
        $poper->stats = $request->stats;
        $poper->stats_base = '{"health": "200", "strength": "50"}';
        $poper->abilities = '{}';
        $poper->element = $request->element;
        
        if($poper->save()) {
            $user = User::where("id_user", "=", $request->id_user)->first();
            $user->id_poper = $poper->id;

            if($user->save()) {
                return response()->json([
                    "status" => 200,
                    "msg" => "¡Poper creado con exito!",
                    "id_poper" => $poper->id
                ]);
            }
        }

        return response()->json([
            "status" => 400,
            "msg" => "¡Poper no creado!"
        ]);
    }

    public function editPoper(Request $request) {
        $request->validate([
            'id_poper' => 'required',
        ]);
        
        $set_clause_parts = [];
        foreach($request->all() as $key => $value) {
            if($key != "id_poper") {
                $set_clause_parts[] = "{$key}='{$value}'";
            }
        }
                
        $set_clause = implode(', ', $set_clause_parts);
        $rows_affected = DB::update('UPDATE popers SET '.$set_clause.' where id = ?', [$request->id_poper]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el poper para actualizar",
        ]);
    }


    public function deletePoper(Request $request) {
        $request->validate([
            'id_poper' => 'required'
        ]);

        $rows_affected = DB::delete('delete from popers WHERE id = ?', [$request->id_poper]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha borrado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el poper para borrar",
        ]);
    }





}


