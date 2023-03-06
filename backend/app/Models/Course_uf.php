<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course_uf extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'total_points',
    ];
    protected $table = 'course_uf';
}
