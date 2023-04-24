<?php

namespace App\Providers;

use App\Models\Courses;
use App\Models\Colleges;
use App\Models\User;
use App\Observers\CoursesObserver;
use App\Observers\CollegeObserver;
use App\Observers\UserObserver;
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
        User::observe(UserObserver::class);
    }
}
