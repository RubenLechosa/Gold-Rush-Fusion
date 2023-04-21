<?php

namespace App\Providers;

use App\Models\Courses;
use App\Models\Colleges;
use App\Observers\CoursesObserver;
use App\Observers\CollegeObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Courses::observe(CoursesObserver::class);
        Colleges::observe(CollegeObserver::class);
    }
}
