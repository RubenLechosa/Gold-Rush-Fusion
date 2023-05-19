<?php

namespace Database\Factories;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Courses>
 */
class CoursesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $idsTeacher = DB::table('users')->pluck('id_user');
        $idsCollege = DB::table('colleges')->pluck('id_college');
        $items = DB::table('items')->pluck('id');

        return [
            'course_name' => fake()->firstName(),
            'id_teacher' => fake()->randomElement($idsTeacher),
            'id_college' => fake()->randomElement($idsCollege),
            'shop' => json_encode(["items" => fake()->randomElements($items, fake()->numberBetween(1, 5))]),
            'code'=>    fake()->regexify('[A-Za-z0-9]{5}'),
            'requests'=> json_encode(fake()->randomElements($idsTeacher, fake()->numberBetween(0, 5))),
            'tasks'=>"{}",

        ];
    }
}
