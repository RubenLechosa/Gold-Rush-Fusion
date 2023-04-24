<?php

namespace App\Observers;

use App\Models\Courses;
use App\Models\Colleges;

class CollegeObserver
{
    public function deleted(Colleges $college): void
    {
        $courses = Courses::where("id_college", "=", $college->id_college)->get();

        foreach ($courses as $course) {
            $course->delete();
        }
    }
}
