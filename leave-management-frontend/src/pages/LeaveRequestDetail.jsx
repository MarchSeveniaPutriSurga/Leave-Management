import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import '../App.css';

function LeaveRequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getLeaveRequest = async () => {
            try {
                const response = await api.get(`/leave-requests/${id}`);

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
            <>
                <Navbar />
                <div className="dash-loading">
                    <div className="dash-spinner" />
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <div className="container dash-content">
                    <div className="form-alert-error">
                        {error}
                    </div>
                </div>
            </>
        );
    }

    if (!leave) {
        return (
            <>
                <Navbar />

                <div className="container dash-content">
                    <p className="text-muted">
                        Data pengajuan tidak ditemukan.
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container dash-content">
                <div className="mb-4">
                    <h2 className="dash-greeting mb-1">
                        Detail Pengajuan Cuti
                    </h2>

                    <p className="dash-subtitle mb-0">
                        Informasi lengkap mengenai pengajuan cuti.
                    </p>
                </div>

                <div className="dash-table-card p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold mb-0">
                            Informasi Pengajuan
                        </h5>

                        <span className={getStatusBadge(leave.status)}>
                            {leave.status}
                        </span>
                    </div>

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

                    <hr className="my-4" />

                    <span
                        className="nav-link-item"
                        role="button"
                        onClick={() =>
                            navigate('/leave-requests')
                        }
                    >
                        ← Kembali
                    </span>
                </div>
            </div>
        </>
    );
}

export default LeaveRequestDetail;