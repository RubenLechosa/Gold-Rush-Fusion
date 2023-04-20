<?php

namespace App\Observers;

use App\Models\Category;
use App\Models\Courses;
use App\Models\Tasks;
use App\Models\Users_submits;

class CoursesObserver
{
    public function deleted(Courses $course): void
    {
        $categories = Category::where("id_course", "=", $course->id_course)->get();

        foreach ($categories as $category) {
            $tasks = Tasks::where('id_category', '=', $category->id_category)->get();
            foreach ($tasks as $task) {
                $task->delete();
            }

            $user_submits = Users_submits::where("id_course", "=", $course->id_course)->get();
    
            foreach ($user_submits as $submit) {
                $submit->delete();
            }

            $category->delete();
        }
        
    }
}
