import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (!form.email || !form.password) { setError('All fields are required.'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', form);
            login(res.data.data.token, res.data.data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div className="card-base card-auth" style={styles.card}>
                <h1 style={styles.title}>🏨 Welcome Back</h1>
                <p style={styles.subtitle}>Sign in to your account</p>

                {error && <div style={styles.error}>{error}</div>}

                <div style={styles.field}>
                    <label className="label-base" style={styles.label}>Email</label>
                    <input name="email" type="email" className="input-field" placeholder="john@example.com" value={form.email}
                        onChange={handleChange} style={styles.input} />
                </div>
                <div style={styles.field}>
                    <label className="label-base" style={styles.label}>Password</label>
                    <input name="password" type="password" className="input-field" placeholder="Your password" value={form.password}
                        onChange={handleChange} style={styles.input}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
                </div>

                <button onClick={handleSubmit} className="btn btn-primary" style={styles.btn} disabled={loading}>
                    {loading ? 'Signing in...' : 'Login'}
                </button>

                <p style={styles.footer}>
                    Don't have an account? <Link to="/register" style={styles.link}>Register</Link>
                </p>
            </div>
        </div>
    );
};


const styles = {
    page: {
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b, #0f172a)',
    },
    card: {
        background: '#fff', borderRadius: '20px', padding: '48px 40px',
        width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    },
    title: { margin: '0 0 6px', fontSize: '28px', fontWeight: '800', color: '#1e293b', textAlign: 'center' },
    subtitle: { margin: '0 0 32px', color: '#64748b', textAlign: 'center' },
    error: {
        background: '#fef2f2', color: '#dc2626', padding: '12px 16px',
        borderRadius: '10px', marginBottom: '20px', fontSize: '14px',
    },
    field: { marginBottom: '16px' },
    label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
    input: {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: '1px solid #e2e8f0', fontSize: '15px', boxSizing: 'border-box', outline: 'none',
    },
    btn: {
        width: '100%', background: '#2563eb', color: '#fff',
        border: 'none', padding: '14px', borderRadius: '10px',
        fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px',
    },
    footer: { marginTop: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' },
    link: { color: '#2563eb', fontWeight: '600', textDecoration: 'none' },
};

export default Login;