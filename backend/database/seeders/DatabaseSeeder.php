<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Colleges;
use App\Models\Courses;
use App\Models\Popers;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
        Colleges::factory()->count(10)->create(); 
        User::factory()->count(10)->create(); 
        Courses::factory()->count(10)->create(); 
        Popers::factory()->count(10)->create(); 
        
        
    }
}
//php artisan db:seed