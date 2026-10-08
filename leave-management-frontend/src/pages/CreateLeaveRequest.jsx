import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import '../App.css';

function CreateLeaveRequest() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        leave_type: 'annual',
        start_date: '',
        end_date: '',
        reason: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.start_date) {
            setError('Tanggal mulai wajib diisi.');
            return;
        }

        if (!form.end_date) {
            setError('Tanggal selesai wajib diisi.');
            return;
        }

        if (form.end_date < form.start_date) {
            setError(
                'Tanggal selesai tidak boleh sebelum tanggal mulai.'
            );
            return;
        }

        if (!form.reason.trim()) {
            setError('Alasan cuti wajib diisi.');
            return;
        }

        if (form.reason.trim().length < 10) {
            setError('Alasan cuti minimal 10 karakter.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/leave-requests', form);

            alert('Pengajuan cuti berhasil dibuat.');

            navigate('/dashboard');
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Gagal membuat pengajuan cuti.'
            );
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <Navbar />

            <div className="container dash-content">
                <div className="form-page-wrapper">
                    <div className="mb-4">
                        <div className="mb-4">
                            <h2 className="dash-greeting mb-1">
                                Ajukan Cuti
                            </h2>

                            <p className="dash-subtitle">
                                Isi formulir berikut untuk mengajukan cuti.
                            </p>
                        </div>

                        <div className="dash-table-card p-4">
                            {error && (
                                <div
                                    className="form-alert-error"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="leave_type"
                                        className="field-label"
                                    >
                                        Jenis Cuti
                                    </label>

                                    <select
                                        id="leave_type"
                                        name="leave_type"
                                        className="form-select field-input"
                                        value={form.leave_type}
                                        onChange={handleChange}
                                    >
                                        <option value="annual">
                                            Cuti Tahunan
                                        </option>

                                        <option value="sick">
                                            Cuti Sakit
                                        </option>

                                        <option value="personal">
                                            Cuti Pribadi
                                        </option>
                                    </select>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label
                                            htmlFor="start_date"
                                            className="field-label"
                                        >
                                            Tanggal Mulai
                                        </label>

                                        <input
                                            id="start_date"
                                            type="date"
                                            name="start_date"
                                            className="form-control field-input"
                                            value={form.start_date}
                                            onChange={handleChange}
                                            min={today}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label
                                            htmlFor="end_date"
                                            className="field-label"
                                        >
                                            Tanggal Selesai
                                        </label>

                                        <input
                                            id="end_date"
                                            type="date"
                                            name="end_date"
                                            className="form-control field-input"
                                            value={form.end_date}
                                            onChange={handleChange}
                                            min={form.start_date}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="reason"
                                        className="field-label"
                                    >
                                        Alasan Cuti
                                    </label>

                                    <textarea
                                        id="reason"
                                        name="reason"
                                        className="form-control field-input"
                                        rows="5"
                                        value={form.reason}
                                        onChange={handleChange}
                                        placeholder="Jelaskan alasan pengajuan cuti..."
                                        minLength={10}
                                        required
                                    />
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn-outline-soft"
                                        onClick={() =>
                                            navigate('/dashboard')
                                        }
                                    >
                                        Batal
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn-primary-soft"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? 'Mengirim...'
                                            : 'Ajukan Cuti'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateLeaveRequest;