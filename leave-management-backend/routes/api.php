<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\AdminLeaveRequestController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
    Route::get('/leave-requests/{id}', [LeaveRequestController::class, 'show']);
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
    Route::put('/leave-requests/{id}/cancel', [LeaveRequestController::class, 'cancel']);

    Route::get('/admin/leave-requests', [AdminLeaveRequestController::class, 'index']);
    Route::get('/admin/leave-requests/{id}', [LeaveRequestController::class, 'adminShow']);
    Route::post('/admin/leave-requests/{id}/approve', [AdminLeaveRequestController::class, 'approve']);
    Route::post('/admin/leave-requests/{id}/reject', [AdminLeaveRequestController::class, 'reject']);
});
