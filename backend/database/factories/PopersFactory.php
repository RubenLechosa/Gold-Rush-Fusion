<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class PopersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'poper_name' => fake()->firstName(),
            'skin'=>"{}",
            'stats'=>"{}",
            'abilities'=>"{}",
            'element'=>fake()->randomElement(['wild','ember','water','psyco','smog','brawny']),
            'level'=>fake()-> randomNumber(),
            'current_exp'=>fake()->randomNumber()

        ];
    }
}
