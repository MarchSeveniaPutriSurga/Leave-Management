import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../App.css';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/login', {
                email,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }

            console.log('Login berhasil:', user);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Email atau password salah.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">LM</div>
                    <h1 className="login-title">Masuk ke akun kamu</h1>
                    <p className="login-subtitle">
                        Kelola pengajuan cuti dengan lebih mudah.
                    </p>
                </div>

                {error && (
                    <div className="login-alert-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="login-field">
                        <label htmlFor="email" className="login-label">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="login-input"
                            placeholder="nama@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            className="login-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={loading}
                    >
                        {loading ? 'Memproses...' : 'Login'}
                    </button>
                </form>

                <p className="login-footer-text">
                    Belum punya akun?{" "}
                    <span
                        className="login-footer-link"
                        role="button"
                        onClick={() => navigate("/register")}
                    >
                        Daftar di sini
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;