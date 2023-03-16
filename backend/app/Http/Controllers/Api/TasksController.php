<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tasks;
use App\Models\Category;
use App\Models\Courses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TasksController extends Controller
{
    public function createTask(Request $request) {
        $request->validate([
            'id_category'  => 'required',
            'type' => 'required',
            'title' => 'required',
            'description' => 'required',
            'limit_date' => 'required',
            "percentage" => '',
            "max_mark" => ''
        ]);

        $task = new Tasks();
        $task->id_category = $request->id_category;
        $task->id_course_uf = 1;
        $task->type = $request->type;
        $task->title = $request->title;
        $task->description = $request->description;
        $task->limit_date = $request->limit_date;
        $task->file_rubrica = "";
        $task->contents = "{}";
        $task->percentage = $request->percentage;
        $task->max_mark = $request->max_mark;

        if($task->save()) {
            return response()->json([
                "status" => 200,
                "msg" => "¡Course creado con exito!",
                "id_course" => $task->id_course
            ]);
        }

        return response()->json([
            "status" => 400,
            "msg" => "¡No se ha creado el course!"
        ]);
    }

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

    public function editTask(Request $request) {
        $request->validate([
            'id_task' => 'required',
        ]);
        
        $set_clause_parts = [];
        foreach($request->all() as $key => $value) {
            if($key != "id_task") {
                $set_clause_parts[] = "{$key}='{$value}'";
            }
        }
                
        $set_clause = implode(', ', $set_clause_parts);
        $rows_affected = DB::update('UPDATE tasks SET '.$set_clause.' where id_tasks = ?', [$request->id_task]);

        if($rows_affected > 0) {
            return response()->json([
                "status" => 200,
                "msg"   => "Se ha actualizado con exito",
            ]);
        }

        return response()->json([
            "status" => 300,
            "msg"   => "No se ha encontrado la task para actualizar",
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
