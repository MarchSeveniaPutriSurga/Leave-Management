import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import '../App.css';

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

function AdminLeaveRequests() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const getLeaveRequests = async () => {
            try {
                const userResponse = await api.get('/user');
                const response = await api.get('/admin/leave-requests');

                setUser(userResponse.data.user);
                setLeaveRequests(response.data.data);
            } catch (error) {
                console.error(
                    'Gagal mengambil pengajuan:',
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        getLeaveRequests();
    }, []);

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

    const filteredLeaveRequests =
        statusFilter === 'all'
            ? leaveRequests
            : leaveRequests.filter(
                (leave) => leave.status === statusFilter
            );

    return (
        <div className="min-vh-100 admin-bg">
            <AdminNavbar user={user} />

            <div className="container dash-content" style={{ paddingTop: '110px', paddingBottom: '48px' }}>
                <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
                    <div>
                        <h2 className="dash-greeting mb-1">
                            Semua Pengajuan Cuti
                        </h2>

                        <p className="dash-subtitle mb-0">
                            Kelola seluruh pengajuan cuti karyawan.
                        </p>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">
                            Filter Status
                        </label>

                        <Menu>
                            <MenuButton className="status-menu-button">
                                {statusFilter === "all"
                                    ? "Semua"
                                    : statusFilter.charAt(0).toUpperCase() +
                                    statusFilter.slice(1)}

                                <ChevronDownIcon className="status-menu-icon" />
                            </MenuButton>

                            <MenuItems
                                transition
                                anchor="bottom start"
                                className="status-menu-items"
                            >
                                <MenuItem>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("all")}
                                    >
                                        Semua
                                    </button>
                                </MenuItem>

                                <MenuItem>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("pending")}
                                    >
                                        Pending
                                    </button>
                                </MenuItem>

                                <MenuItem>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("approved")}
                                    >
                                        Approved
                                    </button>
                                </MenuItem>

                                <MenuItem>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("rejected")}
                                    >
                                        Rejected
                                    </button>
                                </MenuItem>

                                <MenuItem>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("cancelled")}
                                    >
                                        Cancelled
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>

                <div className="dash-table-card">
                    {filteredLeaveRequests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
                                </svg>
                            </div>
                            <p className="text-muted mb-0">
                                Belum ada pengajuan cuti.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table dash-table align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>Karyawan</th>
                                        <th>Jenis Cuti</th>
                                        <th>Periode</th>
                                        <th>Durasi</th>
                                        <th>Status</th>
                                        <th className="text-end">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredLeaveRequests.map((leave) => (
                                        <tr key={leave.id}>
                                            <td>
                                                <div className="fw-medium">
                                                    {leave.user?.name || '-'}
                                                </div>

                                                <small className="text-muted">
                                                    {leave.user?.email || '-'}
                                                </small>
                                            </td>

                                            <td>
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
                                                <button
                                                    className="btn-outline-soft"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/leave-requests/${leave.id}`
                                                        )
                                                    }
                                                >
                                                    Detail
                                                </button>
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

export default AdminLeaveRequests;