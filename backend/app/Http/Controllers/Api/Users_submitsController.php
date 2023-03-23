<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Users_submits;
use Illuminate\Support\Facades\DB;


class Users_submitsController extends Controller
{
    public function getDetailsSubmits(Request $request) {
        $request->validate([
            "id_users_submits" => "required"
        ]);

        if($submits = Users_submits::where("id", "=", $request->submits)->first()) {
            return response()->json([
                "status" => 200,
                "data" => $submits
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No submits data"
        ]);
    }


     public function createSubmits(Request $request) {
        $request->validate([
            'id_tasks'  => 'required',
            'id_user' => 'required',
            'submit'  => 'required',
            'mark' => 'required',
        ]);

        $submits = new Users_submits();
        $submits->id_tasks = $request->id_tasks;
        $submits->id_user = $request->id_user;
        $submits->submit = $request->submit;
        $submits->mark = $request->mark;
        
        if($submits->save()) {
            $submits = Users_submits::where("id_user", "=", $request->id_user)->first();
            $submits->id_users_submits = $submits->id;

            if($submits->save()) {
                return response()->json([
                    "status" => 200,
                    "msg" => "submits creada con exito!",
                    "id_users_submits" => $submits->id
                ]);
            }
        }

        return response()->json([
            "status" => 400,
            "msg" => "Submit no creada!"
        ]);
    }

    public function getAllSubmitsByTask(Request $request) {
        $request->validate([
            "id_task" => "required"
        ]);

        $submits = Users_submits::where("id_task", "=", $request->id_task)->get();

        if($submits) {
            return response()->json([
                "status" => 200,
                "data" => $submits
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No user data"
        ]);
    }


    public function editSubmit(Request $request) {
        $request->validate([
            'id_users_submits' => 'required',
        ]);
        
        $set_clause_parts = [];
        foreach($request->all() as $key => $value) {
            if($key != "id_users_submits") {
                $set_clause_parts[] = "{$key}='{$value}'";
            }
        }
                
        $set_clause = implode(', ', $set_clause_parts);
        $rows_affected = DB::update('UPDATE users_submits SET '.$set_clause.' where id = ?', [$request->id_users_submits]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el submit para actualizar",
        ]);
    }

    public function deleteSubmit(Request $request) {
        $request->validate([
            'id_users_submits' => 'required'
        ]);

        $rows_affected = DB::delete('delete from users_submits WHERE id = ?', [$request->id_users_submits]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha borrado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el submit para borrar",
        ]);
    }
}
