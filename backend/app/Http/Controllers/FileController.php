<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Courses;
use PharIo\Manifest\Url;

class FileController extends Controller
{
    public function file(Request $request){
        if($request->hasFile('img')){
            $completeFileName = $request->file('img')->getClientOriginalName();
            $filenameOnly = pathinfo($completeFileName, PATHINFO_FILENAME);
            $extenshion = $request->file('img')->getClientOriginalExtension();
            $comPic = str_replace('','_', $filenameOnly).'-'.rand() . '_'.time(). '.'.$extenshion;
            $path = $request->file('img')->storeAs('public/posts', $comPic);

            
            return ['status' => 200, 'message' => 'Post Saved Succesfully', "data" => "http://localhost:8000/storage/posts/".$comPic];
        }

        return ['status' => 500, 'message' => 'Something Went Wrong'];
    }
}
