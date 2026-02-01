import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(rgba(22, 66, 60, 0.9), rgba(22, 66, 60, 0.95)), url("https://images.unsplash.com/photo-1502399671628-91219d3f18e9?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '4rem 1.5rem 2rem'
        }}>
            <div className="reveal active" style={{
                width: '100%',
                maxWidth: '480px',
                padding: '4rem 3rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
                background: 'rgba(250, 250, 238, 0.05)',
                backdropFilter: 'blur(30px)',
                border: '1px solid rgba(250, 250, 238, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative Accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, transparent, var(--primary-light), transparent)' }} />

                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <div style={{
                        width: '70px', height: '70px', background: 'rgba(106, 156, 137, 0.15)', color: 'var(--primary-light)',
                        borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem', border: '1px solid rgba(106, 156, 137, 0.2)'
                    }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", color: 'var(--creamy)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Welcome Back</h2>
                    <p style={{ color: 'rgba(250, 250, 238, 0.5)', fontSize: '1rem' }}>Enter the registry to access your estate</p>
                </div>

                {error && (
                    <div style={{
                        padding: '1rem', background: 'rgba(220, 38, 38, 0.1)', color: '#fca5a5',
                        borderRadius: '12px', marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'center',
                        border: '1px solid rgba(220, 38, 38, 0.15)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.75rem', color: 'rgba(250,250,238,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Estate ID (Email)</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(250, 250, 238, 0.3)' }} />
                            <input
                                type="email"
                                placeholder="registry@onekart.com"
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(250,250,238,0.1)',
                                    outline: 'none', transition: 'var(--transition)', color: 'var(--creamy)',
                                    fontSize: '0.95rem'
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(250,250,238,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Passcode</label>
                            <Link to="/" style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary-light)', opacity: 0.8 }}>Forgot Credentials?</Link>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(250, 250, 238, 0.3)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3.5rem', borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(250,250,238,0.1)',
                                    outline: 'none', transition: 'var(--transition)', color: 'var(--creamy)',
                                    fontSize: '0.95rem'
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '1.1rem',
                            marginBottom: '2.5rem',
                            fontSize: '1rem',
                            background: 'var(--primary-light)',
                            color: 'white'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Validating...' : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center' }}>
                                Enter Registry <ArrowRight size={20} />
                            </div>
                        )}
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '0.95rem' }}>
                        <span style={{ color: 'rgba(250, 250, 238, 0.5)' }}>First time here? </span>
                        <Link to="/register" style={{ fontWeight: '700', color: 'var(--creamy)' }}>Apply for Access</Link>
                    </div>

                    <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px dashed rgba(250,250,238,0.1)', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(250, 250, 238, 0.4)', fontStyle: 'italic', lineHeight: '1.6' }}>
                            "Skip the supermarket. Meet the farmer. <br /> Real food, fair prices, zero nonsense."
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
