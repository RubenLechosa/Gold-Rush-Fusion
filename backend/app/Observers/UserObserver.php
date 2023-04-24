<?php

namespace App\Observers;

use App\Models\Badges;
use App\Models\Colleges;
use App\Models\User;

class UserObserver
{
    public function deleted(User $user): void
    {
        $badges = Badges::where("id_user", "=", $user->id_user)->get();

        foreach ($badges as $badge) {
            $badge->delete();
        }
    }
}
