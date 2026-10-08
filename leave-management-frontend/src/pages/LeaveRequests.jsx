import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import '../App.css';

function LeaveRequests() {
    const navigate = useNavigate();

    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLeaveRequests = async () => {
            try {
                const response = await api.get('/leave-requests');

                setLeaveRequests(response.data.data);
            } catch (error) {
                console.error('Gagal mengambil pengajuan:', error);
            } finally {
                setLoading(false);
            }
        };

        getLeaveRequests();
    }, []);

    const handleCancel = async (id) => {
        const confirmed = window.confirm(
            'Yakin ingin membatalkan pengajuan cuti ini?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.put(`/leave-requests/${id}/cancel`);

            alert('Pengajuan cuti berhasil dibatalkan.');

            setLeaveRequests((prev) =>
                prev.map((leave) =>
                    leave.id === id
                        ? { ...leave, status: 'cancelled' }
                        : leave
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Gagal membatalkan pengajuan.'
            );
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'status-badge status-pending',
            approved: 'status-badge status-approved',
            rejected: 'status-badge status-rejected',
            cancelled: 'status-badge status-cancelled',
        };

        return badges[status] || 'status-badge status-cancelled';
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="dash-loading">
                    <div className="dash-spinner" />
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container dash-content">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                    <div>
                        <h2 className="dash-greeting mb-1">
                            Riwayat Pengajuan Cuti
                        </h2>

                        <p className="dash-subtitle mb-0">
                            Lihat status dan riwayat pengajuan cuti kamu.
                        </p>
                    </div>

                    <button
                        className="btn-primary-soft"
                        onClick={() =>
                            navigate('/leave-requests/create')
                        }
                    >
                        <span>+</span> Ajukan Cuti
                    </button>
                </div>

                <div className="dash-table-card">
                    {leaveRequests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                                </svg>
                            </div>

                            <h5 className="mb-1">Belum ada pengajuan cuti</h5>

                            <p className="text-muted mb-3">
                                Kamu belum memiliki riwayat pengajuan cuti.
                            </p>

                            <button
                                className="btn-primary-soft"
                                onClick={() =>
                                    navigate(
                                        '/leave-requests/create'
                                    )
                                }
                            >
                                Ajukan Cuti
                            </button>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table dash-table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Jenis Cuti</th>
                                        <th>Tanggal</th>
                                        <th>Durasi</th>
                                        <th>Status</th>
                                        <th className="text-end">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {leaveRequests.map((leave) => (
                                        <tr key={leave.id}>
                                            <td className="fw-medium">
                                                {leave.leave_type}
                                            </td>

                                            <td className="text-muted">
                                                {leave.start_date}
                                                {' – '}
                                                {leave.end_date}
                                            </td>

                                            <td>
                                                {leave.total_days} hari
                                            </td>

                                            <td>
                                                <span className={getStatusBadge(leave.status)}>
                                                    {leave.status}
                                                </span>
                                            </td>

                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className="btn-outline-soft"
                                                        onClick={() =>
                                                            navigate(
                                                                `/leave-requests/${leave.id}`
                                                            )
                                                        }
                                                    >
                                                        Detail
                                                    </button>

                                                    {leave.status ===
                                                        'pending' && (
                                                            <button
                                                                className="btn-reject-soft"
                                                                onClick={() =>
                                                                    handleCancel(
                                                                        leave.id
                                                                    )
                                                                }
                                                            >
                                                                Cancel
                                                            </button>
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default LeaveRequests;