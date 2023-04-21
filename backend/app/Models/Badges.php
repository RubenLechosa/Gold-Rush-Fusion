<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Badges extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_badge';
    protected $table = 'badges';

    protected $fillable = [
        'id_user',
        'type',
        'level',
        'expToNextLvl',
        'actualExp',
    ];
}
