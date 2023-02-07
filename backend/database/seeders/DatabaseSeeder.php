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

        Colleges::factory()->count(10)->create();
        Popers::factory()->count(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'Myke',
            'email' => 'test@duki.com',
            'last_name' => 'Towers',
            'nick'=> 'MykeTowers69',
            'email_verified_at' => now(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'remember_token' => 'gsknxgwkdj',
            'role'=> 'admin',
            'pepas'=>fake()-> randomNumber(),
            'id_college' => 1,
            'courses' => "{}",
            'id_poper' => 1,
            'inventory' => "{}",
            'birth_date'=>fake()->date(),
            'force_change_pass' =>fake()->boolean()
        ]);

        User::factory()->count(10)->create(); 
        Courses::factory()->count(10)->create(); 
         
        
        
    }
}
//php artisan db:seed