<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Popers;
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
            'name'  => 'required|min:4|max:20',
            'skin' => 'required',
            'level' => 'required',
            'current_exp' => 'required',
            'stats'=> 'required',
            'stats_base'=>'required',
            'abilities' => 'required',
            'element' => 'required'
        ]);

        $poper = new Popers();
        $poper->name = $request->name;
        $poper->skin = $request->skin;
        $poper->level = $request->level;
        $poper->current_exp = $request->current_exp;
        $poper->stats = $request->stats;
        $poper->abilities = $request->abilities;
        $poper->element = $request->element;

        
        if($poper->save()) {
            return response()->json([
                "status" => 200,
                "msg" => "¡Poper creado con exito!",
                "id_poper" => $poper->id
            ]);
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


