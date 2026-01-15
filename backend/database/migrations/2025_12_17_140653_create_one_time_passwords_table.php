<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('one_time_passwords', function (Blueprint $table) {
            $table->id();
            $table->char('code', 6);
            $table->char('token', 64)->unique();
            $table->timestamp('code_used_at')->nullable();
            $table->timestamp('expires_at');
            $table->foreignId('user_id')->index()->constrained();
            $table->timestamps();

            $table->unique(['code', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('one_time_passwords');
    }
};
