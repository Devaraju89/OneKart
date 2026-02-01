import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Phone, Briefcase, ShoppingBasket, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

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

    const validateForm = () => {
        if (name.trim().length < 3) {
            setError('Name must be at least 3 characters long');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobile)) {
            setError('Mobile number must be exactly 10 digits');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            await register({ name, email, password, role, mobile });
            if (role === 'farmer') {
                setIsSuccess(true);
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: 'linear-gradient(rgba(22, 66, 60, 0.8), rgba(22, 66, 60, 0.9)), url("https://images.unsplash.com/photo-1594488630128-44-6b0994fd747ef?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{
                    maxWidth: '400px',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    borderRadius: '24px',
                    background: 'rgba(250, 250, 238, 0.05)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(250, 250, 238, 0.1)'
                }}>
                    <div style={{ width: '60px', height: '60px', background: 'rgba(106, 156, 137, 0.2)', color: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Clock size={30} />
                    </div>
                    <h2 style={{ color: 'var(--creamy)', fontSize: '2rem', marginBottom: '1rem', fontFamily: "'Playfair Display', serif" }}>Application Sent</h2>
                    <p style={{ color: 'rgba(250, 250, 238, 0.7)', lineHeight: '1.6', marginBottom: '2rem', fontSize: '1rem' }}>
                        Account created. <strong>Admin review pending</strong> for Estate Owners.
                    </p>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '0.8rem 2rem', background: 'var(--primary-light)', fontSize: '0.9rem' }}>Go to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'linear-gradient(rgba(22, 66, 60, 0.85), rgba(22, 66, 60, 0.95)), url("https://images.unsplash.com/photo-1523348830342-d01f9ec9d23f?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2000")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '6rem 1.5rem 2rem'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '480px',
                padding: '3rem 2.5rem',
                borderRadius: '24px',
                background: 'rgba(250, 250, 238, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(250, 250, 238, 0.1)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.4)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--creamy)', fontWeight: '800', fontFamily: "'Playfair Display', serif" }}>Create Account</h3>
                    <p style={{ color: 'rgba(250,250,238,0.5)', fontSize: '0.95rem' }}>Join our sustainable community</p>
                </div>

                {error && (
                    <div style={{ padding: '1rem', background: 'rgba(220, 38, 38, 0.1)', color: '#fca5a5', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(220, 38, 38, 0.2)', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(250,250,238,0.7)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block', letterSpacing: '0.05em' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            style={{ width: '100%', padding: '0.9rem 1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(250,250,238,0.1)', outline: 'none', color: 'var(--creamy)', fontSize: '0.95rem' }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(250,250,238,0.7)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block', letterSpacing: '0.05em' }}>Email</label>
                        <input
                            type="email"
                            placeholder="name@onekart.com"
                            style={{ width: '100%', padding: '0.9rem 1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(250,250,238,0.1)', outline: 'none', color: 'var(--creamy)', fontSize: '0.95rem' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(250,250,238,0.7)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block', letterSpacing: '0.05em' }}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '0.9rem 1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(250,250,238,0.1)', outline: 'none', color: 'var(--creamy)', fontSize: '0.95rem' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(250,250,238,0.7)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block', letterSpacing: '0.05em' }}>Mobile</label>
                            <input
                                type="text"
                                placeholder="9876543210"
                                style={{ width: '100%', padding: '0.9rem 1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(250,250,238,0.1)', outline: 'none', color: 'var(--creamy)', fontSize: '0.95rem' }}
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(250,250,238,0.7)', textTransform: 'uppercase', marginBottom: '1rem', display: 'block', letterSpacing: '0.05em', textAlign: 'center' }}>Account Type</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div
                                onClick={() => setRole('customer')}
                                style={{
                                    padding: '1rem', borderRadius: '16px', border: '1.5px solid',
                                    borderColor: role === 'customer' ? 'var(--primary-light)' : 'rgba(250,250,238,0.1)',
                                    background: role === 'customer' ? 'rgba(106, 156, 137, 0.15)' : 'transparent',
                                    cursor: 'pointer', textAlign: 'center', transition: 'var(--transition)'
                                }}
                            >
                                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--creamy)' }}>Customer</span>
                            </div>
                            <div
                                onClick={() => setRole('farmer')}
                                style={{
                                    padding: '1rem', borderRadius: '16px', border: '1.5px solid',
                                    borderColor: role === 'farmer' ? 'var(--primary-light)' : 'rgba(250,250,238,0.1)',
                                    background: role === 'farmer' ? 'rgba(106, 156, 137, 0.15)' : 'transparent',
                                    cursor: 'pointer', textAlign: 'center', transition: 'var(--transition)'
                                }}
                            >
                                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--creamy)' }}>Estate Owner</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', marginBottom: '2rem', fontSize: '1rem', background: 'var(--primary-light)', color: 'white' }}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Register Now'}
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                        <span style={{ color: 'rgba(250,250,238,0.5)' }}>Already have an account? </span>
                        <Link to="/login" style={{ fontWeight: '700', color: 'var(--creamy)' }}>Sign In</Link>
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

export default Register;
