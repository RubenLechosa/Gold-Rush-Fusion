<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Courses extends Model
{
    use HasFactory;
    protected $primaryKey = 'id_courses';

    protected $fillable = [
        'name',
        'id_teacher',
        'id_college',
        'img',
        'shop',
    ];

}
