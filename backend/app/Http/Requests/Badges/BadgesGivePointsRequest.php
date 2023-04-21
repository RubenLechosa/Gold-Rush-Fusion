<?php

namespace App\Http\Requests\Badges;

use Illuminate\Foundation\Http\FormRequest;

class BadgesGivePointsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'id_user' => 'required',
            'id_request_user'=> 'required',
            'badges' => 'required',
        ];
    }
}
