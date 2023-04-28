<?php

namespace App\Http\Requests\Users;

use Illuminate\Foundation\Http\FormRequest;

class changePasswordRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array {
        return [
            'id_user'           => 'required',
            'password'          => 'required',
            'new_password'      => 'required',
            'confirm_password'  => 'required',
        ];
    }
}