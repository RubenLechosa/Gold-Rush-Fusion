<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("last_name");
            $table->string("nick")->unique();
            $table->string("email")->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string("password");
            $table->enum('role',["student","teacher","college_manager","admin"]);
            $table->integer("pepas");
            $table->string("profile_img")->nullable();
            $table->integer("id_course");
            $table->integer("id_poper");
            $table->text("inventory");
            $table->date("birth_date")->nullable();
            $table->boolean("force_change_pass");
            $table->timestamp("creation_date");
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
