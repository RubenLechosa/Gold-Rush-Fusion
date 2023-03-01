<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Users_submits extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_tasks',
        'id_user',
        'submit',
        'mark',
    ];
}
