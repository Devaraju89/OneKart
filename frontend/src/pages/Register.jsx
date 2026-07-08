import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Phone, ArrowRight, Leaf, Clock, Sprout, ShoppingBasket } from 'lucide-react';

const inputStyle = {
    width: '100%',
    padding: '0.88rem 1rem 0.88rem 3rem',
    borderRadius: '4px',
    background: 'var(--parchment-dk)',
    border: '1.5px solid var(--border)',
    outline: 'none',
    color: 'var(--soil)',
    fontSize: '0.9rem',
    fontFamily: "'Lora', serif",
    boxShadow: '2px 2px 0px var(--border)',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
};
const labelStyle = {
    display: 'block',
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.65rem', fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: '0.2em',
    color: 'var(--soil)', marginBottom: '0.5rem'
};
const iconStyle = { position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' };

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [mobile, setMobile] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const focusStyle = (e) => { e.target.style.borderColor = 'var(--rust)'; e.target.style.boxShadow = '3px 3px 0px var(--border-dk)'; };
    const blurStyle = (e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = '2px 2px 0px var(--border)'; };

    const validateForm = () => {
        if (name.trim().length < 3) { setError('Name must be at least 3 characters long'); return false; }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) { setError('Please enter a valid email address'); return false; }
        if (password.length < 6) { setError('Password must be at least 6 characters long'); return false; }
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) { setError('Mobile number must be exactly 10 digits'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;
        setLoading(true);
        try {
            await register({ name, email, password, role, mobile });
            if (role === 'farmer') { setIsSuccess(true); } else { navigate('/'); }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    /* ── Farmer Success Screen ── */
    if (isSuccess) {
        return (
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--soil)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")', backgroundBlendMode: 'multiply',
                padding: '4rem 1.5rem'
            }}>
                <div style={{
                    maxWidth: '440px', width: '100%', padding: '4rem 3rem', textAlign: 'center',
                    background: 'var(--cream)', border: '2px solid var(--border)',
                    borderRadius: '6px', boxShadow: '8px 8px 0px rgba(61,43,31,0.3)'
                }}>
                    <div style={{ width: '70px', height: '70px', background: 'var(--parchment-dk)', border: '1.5px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '3px 3px 0px var(--border)', color: 'var(--rust)' }}>
                        <Clock size={34} strokeWidth={1.5} />
                    </div>
                    <h2 style={{ fontSize: '2.2rem', fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--soil)', marginBottom: '1rem', fontWeight: '400' }}>
                        Application Sent
                    </h2>
                    <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: '1.75', marginBottom: '2.5rem', fontSize: '1rem' }}>
                        Your farmer account has been created. An admin will review and approve your estate access within 24 hours.
                    </p>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem' }}>
                        Go to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--parchment)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '6rem 1.5rem 3rem'
        }}>
            <div style={{ width: '100%', maxWidth: '520px' }}>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '3rem' }}>
                    <div style={{ background: 'var(--soil)', padding: '0.5rem', borderRadius: '5px', display: 'flex', boxShadow: '3px 3px 0px var(--soil-light)' }}>
                        <Leaf color="var(--parchment)" size={20} strokeWidth={2} />
                    </div>
                    <div>
                        <span style={{ display: 'block', fontFamily: "'IM Fell English SC', Georgia, serif", fontSize: '1.5rem', color: 'var(--soil)', lineHeight: '1' }}>OneKart</span>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', fontWeight: '700', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--rust)' }}>Organic Estate</span>
                    </div>
                </div>

                {/* Heading */}
                <h1 style={{ fontSize: '2.4rem', fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--soil)', marginBottom: '0.5rem', fontWeight: '400' }}>
                    Join the Estate
                </h1>
                <p style={{ color: 'var(--text-muted)', fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '1rem', marginBottom: '2rem' }}>
                    Create your account to access farm-fresh produce.
                </p>

                <div style={{ height: '1.5px', background: 'linear-gradient(to right, var(--border-dk), transparent)', marginBottom: '2rem' }} />

                {/* Role Selector */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={labelStyle}>I am a…</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            { val: 'customer', label: 'Customer', sub: 'Buy fresh produce', Icon: ShoppingBasket },
                            { val: 'farmer', label: 'Farmer', sub: 'Sell my harvest', Icon: Sprout }
                        ].map(({ val, label, sub, Icon }) => (
                            <div key={val} onClick={() => setRole(val)} style={{
                                padding: '1.2rem', cursor: 'pointer', textAlign: 'center',
                                border: '2px solid ' + (role === val ? 'var(--rust)' : 'var(--border)'),
                                borderRadius: '6px',
                                background: role === val ? 'rgba(193,68,14,0.07)' : 'var(--cream)',
                                boxShadow: role === val ? '4px 4px 0px rgba(193,68,14,0.2)' : '3px 3px 0px var(--border)',
                                transition: 'all 0.25s ease'
                            }}>
                                <Icon size={24} color={role === val ? 'var(--rust)' : 'var(--text-muted)'} strokeWidth={1.5} style={{ marginBottom: '0.5rem' }} />
                                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.88rem', color: role === val ? 'var(--rust)' : 'var(--soil)' }}>{label}</div>
                                <div style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{sub}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        padding: '1rem 1.2rem', marginBottom: '1.5rem',
                        background: 'rgba(193,68,14,0.08)', border: '1.5px solid rgba(193,68,14,0.3)',
                        borderLeft: '4px solid var(--rust)', borderRadius: '4px',
                        fontFamily: "'Lora', serif", fontSize: '0.9rem', color: 'var(--rust)'
                    }}>{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={labelStyle}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <UserIcon size={16} strokeWidth={2} style={iconStyle} />
                            <input type="text" placeholder="Raju Gowda" style={inputStyle} value={name}
                                onChange={e => setName(e.target.value)} onFocus={focusStyle} onBlur={blurStyle} required />
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: '1.2rem' }}>
                        <label style={labelStyle}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} strokeWidth={2} style={iconStyle} />
                            <input type="email" placeholder="your@email.com" style={inputStyle} value={email}
                                onChange={e => setEmail(e.target.value)} onFocus={focusStyle} onBlur={blurStyle} required />
                        </div>
                    </div>

                    {/* Password + Mobile */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div>
                            <label style={labelStyle}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} strokeWidth={2} style={iconStyle} />
                                <input type="password" placeholder="••••••••"
                                    style={{ ...inputStyle, padding: '0.88rem 1rem 0.88rem 3rem' }}
                                    value={password} onChange={e => setPassword(e.target.value)}
                                    onFocus={focusStyle} onBlur={blurStyle} required />
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Mobile</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} strokeWidth={2} style={iconStyle} />
                                <input type="text" placeholder="9876543210"
                                    style={{ ...inputStyle, padding: '0.88rem 1rem 0.88rem 3rem' }}
                                    value={mobile} onChange={e => setMobile(e.target.value)}
                                    onFocus={focusStyle} onBlur={blurStyle} required />
                            </div>
                        </div>
                    </div>

                    {/* Farmer Notice */}
                    {role === 'farmer' && (
                        <div style={{
                            marginBottom: '1.5rem', padding: '1rem 1.2rem',
                            background: 'rgba(200,147,26,0.1)', border: '1.5px solid rgba(200,147,26,0.4)',
                            borderLeft: '4px solid var(--gold)', borderRadius: '4px'
                        }}>
                            <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--soil)', lineHeight: '1.6' }}>
                                🌾 Farmer accounts require admin approval. You'll be able to list products once your estate is verified.
                            </p>
                        </div>
                    )}

                    {/* Submit */}
                    <button type="submit" disabled={loading} className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                        {loading ? 'Creating Account...' : (
                            <><span>{role === 'farmer' ? 'Apply as Farmer' : 'Create Account'}</span><ArrowRight size={18} /></>
                        )}
                    </button>

                    <p style={{ textAlign: 'center', fontFamily: "'Lora', serif", fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                        Already on the estate?{' '}
                        <Link to="/login" style={{ color: 'var(--rust)', fontWeight: '600', fontStyle: 'italic' }}>Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
