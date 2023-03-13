<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tasks;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TasksController extends Controller
{
    public function getTaskList(Request $request) {
        $request->validate([
            "id_course" => "required"
        ]);

        if($categories = Category::where("id_course", "=", $request->id_course)->get()) {

            foreach ($categories as $idx => $category) {
                $categories[$idx]["tasks"] = Tasks::where("id_category", "=", $category["id_category"])->get();
            }

            return response()->json([
                "status" => 200,
                "data" => $categories
            ]);
        }

        return response()->json([
            "status" => 200,
            "msg" => "No tasks data"
        ]);
    }

    public function getDetails(Request $request) {
        $request->validate([
            "id_task" => "required"
        ]);

        if($task = Tasks::where("id_tasks", "=", $request->id_task)->first()) {
            return response()->json([
                "status" => 200,
                "data" => $task
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No tasks data"
        ]);
    }

    public function getCategory(Request $request) {
        $request->validate([
            "id_course" => "required"
        ]);

        if($categories = Category::where("id_course", "=", $request->id_course)->get()) {
            return response()->json([
                "status" => 200,
                "data" => $categories
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "No tasks data"
        ]);
    }

    public function delete(Request $request) {
        $request->validate([
            'id_task' => 'required'
        ]);

        $rows_affected = DB::delete('delete from tasks WHERE id_tasks = ?', [$request->id_task]);

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

}
