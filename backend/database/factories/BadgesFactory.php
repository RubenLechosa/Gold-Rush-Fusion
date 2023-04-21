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
        $level = fake()->numberBetween(1, 5);

        return [
            'id_user' => fake()->randomElement($idsUser),
            'type'=>fake()->randomElement(['R','C','A','G','H']),
            'level' => $level,
            'expToNextLvl' => $level * 1100,
            'acutalExp'=> fake()->numberBetween(0, $level * 1099),
        ];
    }
}
