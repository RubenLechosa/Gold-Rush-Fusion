<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Courses;
use Illuminate\Http\Response;
use PharIo\Manifest\Url;

class FileController extends Controller
{
    public function store(Request $request){
        if($request->hasFile('img')){
            $name = $request->file('img')->hashName();
            $save = $request->file('img')->storeAs('public/posts', $name);
            $path = 'http://localhost:8000/storage/posts/'. $request->file('img')->hashName();

            return response()->json([
                "status" => Response::HTTP_OK,
                "success"=> true,
                "data" => $path
            ]);
        }

        return response()->json([
            "status"    => Response::HTTP_OK,
            "success" => false,
            "msg" => "No file",
            "data"  => ""
        ]);
    }
}
