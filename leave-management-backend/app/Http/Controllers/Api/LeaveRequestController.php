<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        $leaveRequests = $request->user()
            ->leaveRequests()
            ->latest()
            ->get();

        return response()->json([
            'data' => $leaveRequests,
        ]);
    }

    public function show(Request $request, $id)
    {
        $leaveRequest = $request->user()
            ->leaveRequests()
            ->findOrFail($id);

        return response()->json([
            'data' => $leaveRequest,
        ]);
    }

    public function adminShow($id)
    {
        $leaveRequest = LeaveRequest::with('user')->findOrFail($id);

        return response()->json([
            'data' => $leaveRequest
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $leaveRequest = $request->user()
            ->leaveRequests()
            ->findOrFail($id);

        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Hanya pengajuan dengan status pending yang dapat dibatalkan.',
            ], 422);
        }

        $leaveRequest->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Pengajuan cuti berhasil dibatalkan.',
            'data' => $leaveRequest,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'leave_type' => 'required|in:annual,sick,personal',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:1000',
        ]);

        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);

        $totalDays = $startDate->diffInDays($endDate) + 1;

        $user = $request->user();

        if ($validated['leave_type'] === 'annual') {
            $usedLeaveDays = LeaveRequest::where('user_id', $user->id)
                ->where('leave_type', 'annual')
                ->whereIn('status', ['pending', 'approved'])
                ->sum('total_days');

            $remainingLeave = $user->annual_leave_quota - $usedLeaveDays;

            if ($totalDays > $remainingLeave) {
                return response()->json([
                    'message' => 'Pengajuan cuti melebihi sisa kuota cuti tahunan.',
                    'remaining_leave' => $remainingLeave,
                ], 422);
            }
        }

        $hasConflict = LeaveRequest::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'approved'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [
                    $validated['start_date'],
                    $validated['end_date']
                ])
                    ->orWhereBetween('end_date', [
                        $validated['start_date'],
                        $validated['end_date']
                    ])
                    ->orWhere(function ($query) use ($validated) {
                        $query->where('start_date', '<=', $validated['start_date'])
                            ->where('end_date', '>=', $validated['end_date']);
                    });
            })
            ->exists();

        if ($hasConflict) {
            return response()->json([
                'message' => 'Tanggal pengajuan cuti bertabrakan dengan pengajuan yang sudah ada.',
            ], 422);
        }

        $leaveRequest = LeaveRequest::create([
            'user_id' => $user->id,
            'leave_type' => $validated['leave_type'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_days' => $totalDays,
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Pengajuan cuti berhasil dibuat.',
            'data' => $leaveRequest,
        ], 201);
    }
}
