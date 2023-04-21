<?php

namespace App\Observers;

use App\Models\Courses;
use App\Models\College;

class CoursesObserver
{
    public function deleted(College $college): void
    {
        $courses = Courses::where("id_college", "=", $college->id_college)->get();

        foreach ($courses as $course) {
            $course->delete();
        }
    }
}
