<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BadgeHistory extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_badge_history';

    protected $fillable = [
        'id_user',
        'id_user_submited',
        'id_course',
        'total_points',
        'badge'
    ];
}
