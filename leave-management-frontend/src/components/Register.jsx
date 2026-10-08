import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0][0];
                    setError(firstError);
                } else {
                    setError(data.message || "Registrasi gagal.");
                }

                return;
            }

            setSuccess(data.message);

            // Simpan token hasil registrasi
            localStorage.setItem("token", data.token);

            // Kosongkan form
            setFormData({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
            });

            // Redirect ke halaman login setelah registrasi berhasil
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            setError("Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">LM</div>
                    <h1 className="login-title">Buat akun baru</h1>
                    <p className="login-subtitle">
                        Isi data di bawah untuk mendaftar.
                    </p>
                </div>

                {error && (
                    <div className="login-alert-error" role="alert">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="login-alert-success" role="alert">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label htmlFor="name" className="login-label">
                            Nama
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            className="login-input"
                            placeholder="Nama lengkap"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="email" className="login-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="login-input"
                            placeholder="nama@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password" className="login-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="login-input"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password_confirmation" className="login-label">
                            Konfirmasi Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            className="login-input"
                            placeholder="••••••••"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? "Memproses..." : "Daftar"}
                    </button>
                </form>

                <p className="login-footer-text">
                    Sudah punya akun?{" "}
                    <span
                        className="login-footer-link"
                        role="button"
                        onClick={() => navigate("/login")}
                    >
                        Masuk di sini
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Register;