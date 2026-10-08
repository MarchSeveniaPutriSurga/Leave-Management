<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;

class AdminLeaveRequestController extends Controller
{
    public function index(Request $request)
    {
        $leaveRequests = LeaveRequest::with('user')
            ->latest()
            ->get();

        return response()->json([
            'data' => $leaveRequests,
        ]);
    }

    public function approve(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);

        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Hanya pengajuan dengan status pending yang dapat disetujui.',
            ], 422);
        }

        $leaveRequest->update([
            'status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Pengajuan cuti berhasil disetujui.',
            'data' => $leaveRequest,
        ]);
    }

    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $leaveRequest = LeaveRequest::findOrFail($id);

        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Hanya pengajuan dengan status pending yang dapat ditolak.',
            ], 422);
        }

        $leaveRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
        ]);

        return response()->json([
            'message' => 'Pengajuan cuti berhasil ditolak.',
            'data' => $leaveRequest,
        ]);
    }
}
