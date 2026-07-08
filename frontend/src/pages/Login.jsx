import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Leaf } from 'lucide-react';

const inputStyle = {
    width: '100%',
    padding: '0.95rem 1rem 0.95rem 3.2rem',
    borderRadius: '4px',
    background: 'var(--parchment-dk)',
    border: '1.5px solid var(--border)',
    outline: 'none',
    color: 'var(--soil)',
    fontSize: '0.95rem',
    fontFamily: "'Lora', serif",
    boxShadow: '2px 2px 0px var(--border)',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
};

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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { setError('Please enter a valid email address'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
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
            minHeight: '100vh', display: 'flex',
            background: 'var(--parchment)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")'
        }}>
            {/* ── Left Panel: Heritage Photo ── */}
            <div style={{
                flex: 1, display: 'none',
                position: 'relative', overflow: 'hidden'
            }} className="login-hero">
                <img
                    src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1400"
                    alt="Farming"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.3) contrast(1.05)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(61,43,31,0.95) 0%, rgba(61,43,31,0.3) 60%)' }} />
                <div style={{ position: 'absolute', bottom: '4rem', left: '3rem', right: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                        <div style={{ background: 'var(--parchment)', padding: '0.4rem', borderRadius: '3px', display: 'flex' }}>
                            <Leaf color="var(--soil)" size={18} />
                        </div>
                        <span style={{ fontFamily: "'IM Fell English SC', serif", fontSize: '1.3rem', color: 'var(--parchment)' }}>OneKart</span>
                    </div>
                    <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '1.1rem', color: 'rgba(245,239,215,0.85)', lineHeight: '1.7' }}>
                        "From the roots of the earth to your table — honest, traditional, nourishing."
                    </p>
                </div>
            </div>

            {/* ── Right Panel: Form ── */}
            <div style={{
                width: '100%', maxWidth: '520px',
                margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '4rem 3rem'
            }}>
                <div style={{ width: '100%' }}>

                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '3.5rem' }}>
                        <div style={{ background: 'var(--soil)', padding: '0.5rem', borderRadius: '5px', display: 'flex', boxShadow: '3px 3px 0px var(--soil-light)' }}>
                            <Leaf color="var(--parchment)" size={20} strokeWidth={2} />
                        </div>
                        <div>
                            <span style={{ display: 'block', fontFamily: "'IM Fell English SC', Georgia, serif", fontSize: '1.5rem', color: 'var(--soil)', lineHeight: '1' }}>OneKart</span>
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', fontWeight: '700', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--rust)' }}>Organic Estate</span>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 style={{ fontSize: '2.6rem', fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--soil)', marginBottom: '0.5rem', fontWeight: '400' }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '1rem', marginBottom: '2.5rem' }}>
                        Sign in to access your farm-to-door account.
                    </p>

                    {/* Divider */}
                    <div style={{ height: '1.5px', background: 'linear-gradient(to right, var(--border-dk), transparent)', marginBottom: '2.5rem' }} />

                    {/* Error */}
                    {error && (
                        <div style={{
                            padding: '1rem 1.2rem',
                            background: 'rgba(193,68,14,0.08)',
                            border: '1.5px solid rgba(193,68,14,0.3)',
                            borderLeft: '4px solid var(--rust)',
                            borderRadius: '4px',
                            marginBottom: '2rem',
                            fontFamily: "'Lora', serif", fontSize: '0.9rem',
                            color: 'var(--rust)', lineHeight: '1.5'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block', fontFamily: "'Outfit', sans-serif",
                                fontSize: '0.68rem', fontWeight: '700',
                                textTransform: 'uppercase', letterSpacing: '0.2em',
                                color: 'var(--soil)', marginBottom: '0.6rem'
                            }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={17} strokeWidth={2} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    style={inputStyle}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    onFocus={e => { e.target.style.borderColor = 'var(--rust)'; e.target.style.boxShadow = '3px 3px 0px var(--border-dk)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = '2px 2px 0px var(--border)'; }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                                <label style={{
                                    fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem',
                                    fontWeight: '700', textTransform: 'uppercase',
                                    letterSpacing: '0.2em', color: 'var(--soil)'
                                }}>Password</label>
                                <Link to="/" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', fontWeight: '600', color: 'var(--rust)', letterSpacing: '0.05em' }}>
                                    Forgot password?
                                </Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={17} strokeWidth={2} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    style={inputStyle}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={e => { e.target.style.borderColor = 'var(--rust)'; e.target.style.boxShadow = '3px 3px 0px var(--border-dk)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = '2px 2px 0px var(--border)'; }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '1.05rem', fontSize: '0.9rem', marginBottom: '2rem', justifyContent: 'center' }}
                        >
                            {loading ? 'Verifying...' : (
                                <><span>Enter the Estate</span><ArrowRight size={18} /></>
                            )}
                        </button>

                        {/* Register link */}
                        <p style={{ textAlign: 'center', fontFamily: "'Lora', serif", fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                            New to OneKart?{' '}
                            <Link to="/register" style={{ color: 'var(--rust)', fontWeight: '600', fontStyle: 'italic' }}>Create an account</Link>
                        </p>

                        {/* Heritage tagline */}
                        <div style={{ marginTop: '3rem', padding: '1.4rem', background: 'var(--parchment-dkr)', border: '1px solid var(--border)', borderRadius: '4px', textAlign: 'center' }}>
                            <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                "Skip the supermarket. Meet the farmer.<br />Real food, fair prices, zero nonsense."
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
