<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\Badges\GetBadgeHistoryRequest;
use App\Http\Requests\Course\GetByCourseRequest;
use App\Models\BadgeHistory;
use App\Models\User;
use Illuminate\Http\Response;

class BadgeHistoryController extends Controller
{
    public function getByCourse(GetBadgeHistoryRequest $request) {
        $request = $request->validated();
        $badges = BadgeHistory::orderBy('created_at', 'desc');
        $badges = $badges->where("id_course", "=", $request["id_course"]);

        if(isset($request["filters"]) && count($request["filters"])) {
            foreach ($request["filters"] as $idx => $filter) {
                if($filter != "") {
                    $badges = $badges->where($idx, $filter);
                }
            }
        }

        $badges = $badges->get();

        if($badges) {
            foreach ($badges as $idx => $badge) {
                $badges[$idx]["user"] = User::find($badge->id_user);
                $badges[$idx]["user_submited"] = User::find($badge->id_user_submited);
            }
        }
        
        return response()->json([
            "status" => Response::HTTP_OK,
            "success"=> true,
            "data" => $badges
        ]);
    }


    public function remove(Request $request) {
        $badge = BadgeHistory::where("id_badge_history", "=", $request["id_badge_history"])->first();

        if($user_give_points = User::find($badge->id_user_submited)) {
            $user_give_points->skills_points = $badge->total_points;
            $user_give_points->save();
        }

        if($badge->delete()) {
            return response()->json([
                "status" => Response::HTTP_OK,
                "success"=> true
            ]);
        }
    }
}
