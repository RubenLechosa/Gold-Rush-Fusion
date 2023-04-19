<?php

namespace Database\Factories;

use Illuminate\Support\Facades\DB;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Badges>
 */
class BadgesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $idsUser = DB::table('users')->pluck('id_user');

        return [
            'id_user' => fake()->randomElement($idsUser),
            'type'=>fake()->randomElement(['R','C','A','G','H']),
            'level' => fake()->numberBetween(1, 5),
            'expToNextLvl' => fake()->numberBetween(1, 3000),
            'acutalExp'=>fake()->numberBetween(1, 10000),
        ];
    }
}
