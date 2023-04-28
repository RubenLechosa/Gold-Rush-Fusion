<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BadgeHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'id_user_submited',
        'total_points',
        'badge'
    ];
}
