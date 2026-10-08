import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import '../App.css';

function AdminDashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const userResponse = await api.get('/user');
                const leaveResponse = await api.get('/admin/leave-requests');

                setUser(userResponse.data.user);
                setLeaveRequests(leaveResponse.data.data);
            } catch (error) {
                console.error(
                    'Gagal mengambil data admin:',
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        getDashboardData();
    }, []);

    const statusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'status-badge status-approved';
            case 'rejected':
                return 'status-badge status-rejected';
            default:
                return 'status-badge status-pending';
        }
    };

    if (loading) {
        return (
            <div className="dash-loading">
                <div className="dash-spinner" />
            </div>
        );
    }

    return (
        <div className="min-vh-100 admin-bg">
            <AdminNavbar user={user} />

            <div className="container py-5 dash-content">
                {user && (
                    <div className="welcome-banner mb-4">
                        <div className="welcome-avatar">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <h2 className="welcome-greeting mb-1">
                                Selamat datang, {user.name}!
                            </h2>
                            <p className="welcome-subtitle mb-0">
                                Kelola dan pantau pengajuan cuti karyawan.
                            </p>
                        </div>
                    </div>
                )}

                <div className="row g-3 mb-5">
                    <div className="col-6 col-md-3">
                        <div className="stat-card stat-neutral h-100">
                            <div className="stat-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <p className="stat-label">Total Pengajuan</p>
                            <h3 className="stat-value">{leaveRequests.length}</h3>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card stat-pending h-100">
                            <div className="stat-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <p className="stat-label">Pending</p>
                            <h3 className="stat-value">
                                {leaveRequests.filter((leave) => leave.status === 'pending').length}
                            </h3>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card stat-approved h-100">
                            <div className="stat-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            <p className="stat-label">Approved</p>
                            <h3 className="stat-value">
                                {leaveRequests.filter((leave) => leave.status === 'approved').length}
                            </h3>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card stat-rejected h-100">
                            <div className="stat-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </div>
                            <p className="stat-label">Rejected</p>
                            <h3 className="stat-value">
                                {leaveRequests.filter((leave) => leave.status === 'rejected').length}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="dash-table-card">
                    <div className="d-flex justify-content-between align-items-center mb-3 px-2 pt-2">
                        <h5 className="section-title mb-0">
                            Pengajuan Terbaru
                        </h5>

                        <button
                            className="btn-outline-soft"
                            onClick={() => navigate('/admin/leave-requests')}
                        >
                            Lihat Semua
                        </button>
                    </div>

                    {leaveRequests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                                </svg>
                            </div>
                            <p className="text-muted mb-0">Belum ada pengajuan cuti.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table dash-table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Karyawan</th>
                                        <th>Jenis Cuti</th>
                                        <th>Tanggal</th>
                                        <th>Durasi</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {leaveRequests.slice(0, 5).map((leave) => (
                                        <tr key={leave.id}>
                                            <td className="fw-medium">
                                                {leave.user?.name || '-'}
                                            </td>
                                            <td>{leave.leave_type}</td>
                                            <td className="text-muted">
                                                {leave.start_date} – {leave.end_date}
                                            </td>
                                            <td>{leave.total_days} hari</td>
                                            <td>
                                                <span className={statusBadgeClass(leave.status)}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;