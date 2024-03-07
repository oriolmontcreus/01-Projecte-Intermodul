<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('questiontype')->insert([
            ['typeName' => 'Text'],
            ['typeName' => 'True or False'],
            ['typeName' => 'Slider'],
            ['typeName' => 'Selection'],
        ]);
    }
}
