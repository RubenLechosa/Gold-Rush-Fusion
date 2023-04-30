<?php

namespace App\Http\Controllers\Api;

use App\Models\Badges;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Badges\BadgesGivePointsRequest;
use App\Http\Requests\Course\GetByCourseRequest;
use App\Models\BadgeHistory;
use Illuminate\Http\Response;

class BadgesController extends Controller
{
    public function givePoints(BadgesGivePointsRequest $request) {
        $request = $request->validated();
        $badges = json_decode($request["badges"], true);

        foreach ($badges as $badge) {
            if($badge["value"] > 0) {
                $user = User::find($request["id_request_user"]);

                if($user->skills_points >= $badge["value"]) {
                    $user->skills_points -= $badge["value"];
                }
                
                if($user->save()) {
                    if($user_badge = Badges::where("id_user", "=", $request["id_user"])->where("type", "=", $badge["name"])->first()) {
                        $user_badge->actualExp += $badge["value"];
    
                        if($user_badge->actualExp >= $user_badge->expToNextLvl) {
                            if($user_badge->level < 5) {
                                $user_badge->level++;
                                $user_badge->actualExp = ($user_badge->actualExp - $user_badge->expToNextLvl);
                                $user_badge->expToNextLvl += 1100;
                            }
                        }
                        
                        $user_badge->save();
                    } else {
                        $user_badge = new Badges();
                        $user_badge->level = ($badge["value"] >= 1000 ? 1 : 0);
                        $user_badge->id_user = $request["id_user"];
                        $user_badge->type = $badge["name"];
                        $user_badge->actualExp = ($badge["value"] >= 1000 ? 0 : $badge["value"]);
                        $user_badge->expToNextLvl = ($badge["value"] >= 1000 ? 2100 : 1000);
    
                        $user_badge->save();
                    }

                    $user_badge_history = new BadgeHistory();
                    $user_badge_history->id_user = $request["id_request_user"];
                    $user_badge_history->id_user_submited = $request["id_user"];
                    $user_badge_history->id_course = $request["id_course"];
                    $user_badge_history->badge = $badge["name"];
                    $user_badge_history->total_points = $badge["value"];
                    $user_badge_history->save();
                }
            }
        }

        return response()->json([
            "status" => Response::HTTP_OK,
            "success"=> true
        ]);
    }
}
