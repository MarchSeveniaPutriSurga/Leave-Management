<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'HR Admin',
            'email' => 'admin@leave.com',
            'password' => Hash::make('admin12345'),
            'role' => 'admin',
            'annual_leave_quota' => 12,
        ]);
    }
}
