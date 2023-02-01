<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Popers extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'skin',
        'level',
        'current_exp',
        'stats',
        'abilities',
        'element',
    ];

}
