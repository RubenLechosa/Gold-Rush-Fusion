<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Courses;

class FileController extends Controller
{
    public function file(Request $request){
    $courses = new Courses;
    if($request->hasFile('img')){
        $completeFileName = $request->file('img')->getClientOriginalName();
        $filenameOnly = pathinfo($completeFileName, PATHINFO_FILENAME);
        $extenshion = $request->file('img')->getClientOriginalExtension();
        $comPic = str_replace('','_', $filenameOnly).'-'.rand() . '_'.time(). '.'.$extenshion;
        $path = $request->file('img')->storeAs('public/posts', $comPic);
        $courses->img = $comPic;
    }
    dd($comPic);
    if($courses->save()){
        return ['status' => true, 'message' => 'Post Saved Succesfully'];
    }else{
        return ['status' => false, 'message' => 'Something Went Wrong'];

    }
    }
}
