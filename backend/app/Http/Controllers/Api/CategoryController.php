<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class CategoryController extends Controller
{


    public function getDetailsCategory(Request $request) {
        $request->validate([
            "id_category" => "required"
        ]);

        if($category = Category::where("id", "=", $request->id_category)->first()) {
            return response()->json([
                "status" => 200,
                "data" => $category
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No category data"
        ]);
    }


     public function createCategory(Request $request) {
        $request->validate([
            'title'  => 'required',
            'id_course' => 'required',
        ]);

        $category = new Category();
        $category->title = $request->title;
        $category->id_course = $request->id_course;
        
        if($category->save()) {
            return response()->json([
                "status" => 200,
                "msg" => "Category creada con exito!",
                "id_category" => $category->id
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "¡Category no creada!"
        ]);
    }

    public function editCategory(Request $request) {
        $request->validate([
            'id_category' => 'required',
        ]);
        
        $set_clause_parts = [];
        foreach($request->all() as $key => $value) {
            if($key != "id_category") {
                $set_clause_parts[] = "{$key}='{$value}'";
            }
        }
                
        $set_clause = implode(', ', $set_clause_parts);
        $rows_affected = DB::update('UPDATE category SET '.$set_clause.' where id = ?', [$request->id_category]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el category para actualizar",
        ]);
    }

    public function deleteCategory(Request $request) {
        $request->validate([
            'id_category' => 'required'
        ]);

        $rows_affected = DB::delete('delete from category WHERE id = ?', [$request->id_category]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha borrado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado el category para borrar",
        ]);
    }





}
