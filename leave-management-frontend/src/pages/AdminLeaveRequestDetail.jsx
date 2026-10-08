import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import '../App.css';

function AdminLeaveRequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const getLeaveRequest = async () => {
            try {
                const userResponse = await api.get('/user');
                const response = await api.get(
                    `/admin/leave-requests/${id}`
                );

                setUser(userResponse.data.user);
                setLeave(response.data.data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    'Gagal mengambil detail pengajuan.'
                );
            } finally {
                setLoading(false);
            }
        };

        getLeaveRequest();
    }, [id]);

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
            <div className="dash-loading">
                <div className="dash-spinner" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-vh-100 admin-bg">
                <AdminNavbar user={user} />
                <div className="container dash-content" style={{ paddingTop: '110px' }}>
                    <div className="alert alert-danger">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!leave) {
        return (
            <div className="min-vh-100 admin-bg">
                <AdminNavbar user={user} />
                <div className="container dash-content" style={{ paddingTop: '110px' }}>
                    <p className="text-muted">Data pengajuan tidak ditemukan.</p>
                </div>
            </div>
        );
    }

    const handleApprove = async () => {
        const confirmed = window.confirm(
            'Yakin ingin menyetujui pengajuan cuti ini?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.post(`/admin/leave-requests/${id}/approve`);

            alert('Pengajuan cuti berhasil disetujui.');

            setLeave((prev) => ({
                ...prev,
                status: 'approved',
            }));
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Gagal menyetujui pengajuan.'
            );
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Alasan penolakan wajib diisi.');
            return;
        }

        const confirmed = window.confirm(
            'Yakin ingin menolak pengajuan cuti ini?'
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.post(`/admin/leave-requests/${id}/reject`, {
                rejection_reason: rejectionReason,
            });

            alert('Pengajuan cuti berhasil ditolak.');

            setLeave((prev) => ({
                ...prev,
                status: 'rejected',
                rejection_reason: rejectionReason,
            }));
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Gagal menolak pengajuan.'
            );
        }
    };

    return (
        <div className="min-vh-100 admin-bg">
            <AdminNavbar user={user} />

            <div className="container dash-content" style={{ paddingTop: '110px', paddingBottom: '48px' }}>
                <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
                    <div>
                        <h2 className="dash-greeting mb-1">
                            Detail Pengajuan Cuti
                        </h2>

                        <p className="dash-subtitle mb-0">
                            Periksa informasi pengajuan sebelum memberikan keputusan.
                        </p>
                    </div>

                    <span
                        className="nav-link-item"
                        role="button"
                        onClick={() => navigate('/admin/leave-requests')}
                    >
                        ← Kembali
                    </span>
                </div>

                <div className="dash-table-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h5 className="fw-bold mb-1">
                                {leave.user?.name || '-'}
                            </h5>

                            <p className="text-muted mb-0">
                                {leave.user?.email || '-'}
                            </p>
                        </div>

                        <span className={getStatusBadge(leave.status)}>
                            {leave.status}
                        </span>
                    </div>

                    <hr />

                    <div className="row g-4">
                        <div className="col-md-6">
                            <small className="detail-label">
                                Jenis Cuti
                            </small>

                            <p className="detail-value mb-0">
                                {leave.leave_type}
                            </p>
                        </div>

                        <div className="col-md-6">
                            <small className="detail-label">
                                Durasi
                            </small>

                            <p className="detail-value mb-0">
                                {leave.total_days} hari
                            </p>
                        </div>

                        <div className="col-md-6">
                            <small className="detail-label">
                                Tanggal Mulai
                            </small>

                            <p className="detail-value mb-0">
                                {leave.start_date}
                            </p>
                        </div>

                        <div className="col-md-6">
                            <small className="detail-label">
                                Tanggal Selesai
                            </small>

                            <p className="detail-value mb-0">
                                {leave.end_date}
                            </p>
                        </div>

                        <div className="col-12">
                            <small className="detail-label">
                                Alasan Cuti
                            </small>

                            <p className="mb-0">
                                {leave.reason}
                            </p>
                        </div>

                        {leave.rejection_reason && (
                            <div className="col-12">
                                <div className="rejection-note">
                                    <strong>
                                        Alasan Penolakan
                                    </strong>

                                    <p className="mb-0 mt-1">
                                        {leave.rejection_reason}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    {leave.status === 'pending' && (
                        <div className="mt-4">
                            <label
                                htmlFor="rejection_reason"
                                className="form-label fw-semibold"
                            >
                                Alasan Penolakan
                            </label>

                            <textarea
                                id="rejection_reason"
                                className="form-control mb-3 detail-textarea"
                                rows="4"
                                placeholder="Masukkan alasan jika pengajuan ditolak..."
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                }
                            />

                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    className="btn-reject-soft"
                                    onClick={handleReject}
                                >
                                    Tolak Pengajuan
                                </button>

                                <button
                                    className="btn-approve-soft"
                                    onClick={handleApprove}
                                >
                                    Setujui Pengajuan
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminLeaveRequestDetail;