<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $primaryKey = 'id_user';

    protected $fillable = [
        'name',
        'last_name',
        'nick',
        'email',
        'password',
        'role',
        'pepas',
        'skills_points',
        'profile_img',
        'id_course',
        'id_poper',
        'inventory',
        'birth_date',
        'force_change_pass',
        'creation_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected function popers(): \Illuminate\Database\Eloquent\Relations\BelongsTo 
    {
        return $this->belongsTo(Popers::class);
    }
}
