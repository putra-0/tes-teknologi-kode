<?php

namespace Database\Factories;

use DateInterval;
use Illuminate\Database\Eloquent\Factories\Factory;


class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'uuid' => fake()->uuid(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => 'password',
            'created_at' => fake()->dateTimeBetween('-1 year'),
        ];
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => (clone $attributes['created_at'])->add(
                new DateInterval(sprintf('PT%sS', random_int(60, 600)))
            ),
        ]);
    }
}
