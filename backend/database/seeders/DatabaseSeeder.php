<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Category;
use App\Models\Colleges;
use App\Models\Course_uf;
use App\Models\Courses;
use App\Models\Popers;
use App\Models\Tasks;
use App\Models\User;
use App\Models\Users_submits;
use App\Models\Badges;
use App\Models\Item;
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
        Item::factory()->count(30)->create(); 
        Colleges::factory()->count(10)->create();
        Popers::factory()->count(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'Myke',
            'email' => 'test@test.com',
            'last_name' => 'Towers',
            'nick'=> 'MykeTowers69',
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'role'=> 'admin',
            'id_college' => 1,
            'id_poper' => 1
        ]);

        User::factory()->count(10)->create();
        Courses::factory()->count(10)->create(); 
        Category::factory()->count(10)->create();
        Course_uf::factory()->count(10)->create();
        Tasks::factory()->count(10)->create();
        Users_submits::factory()->count(10)->create();
        Badges::factory()->count(10)->create();


        $users = User::get();
        $courses = Courses::get();

        foreach ($users as $user) {
            $course = array();
            for ($i=0; $i < 2; $i++) { 
                $course[] = strval(rand(1, count($courses)));
            }

            $user->courses = json_encode($course);
            $user->save();
        }
        
        
    }
}
//php artisan db:seed