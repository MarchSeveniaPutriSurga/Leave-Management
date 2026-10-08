import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../App.css';

function Navbar() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Logout gagal:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            navigate('/login');
        }
    };

    return (
        <nav className={`navbar navbar-expand-lg fixed-top app-navbar ${scrolled ? 'app-navbar-scrolled' : ''}`}>
            <div className="container">
                <button
                    className="navbar-brand btn btn-link text-decoration-none fw-bold p-0"
                    onClick={() => navigate('/dashboard')}
                >
                    Leave Management
                </button>

                <div className="d-flex align-items-center gap-3">
                    <span
                        className="btn btn-link text-decoration-none text-dark"
                        onClick={() => navigate('/dashboard')}
                    >
                        Dashboard
                    </span>

                    <span
                        className="btn btn-link text-decoration-none text-dark"
                        onClick={() => navigate('/leave-requests')}
                    >
                        Pengajuan Cuti
                    </span>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;