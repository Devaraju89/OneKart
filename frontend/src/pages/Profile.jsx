import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, Save, Shield } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setMobile(user.mobile || '');
        }
    }, [user]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setLoading(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            };
            const { data } = await axios.put('/api/auth/profile', { name, email, mobile, password }, config);

            // Update local context
            const updatedUser = { ...user, ...data.user };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success("Profile updated successfully");
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Account Settings</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your identity and security preferences</p>
                </div>

                <div className="card animate-fade" style={{ padding: '3rem' }}>
                    <form onSubmit={submitHandler}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem', color: 'var(--text-muted)' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none' }}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem', color: 'var(--text-muted)' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none' }}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {(user?.role === 'customer' || user?.role === 'farmer') && (
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem', color: 'var(--text-muted)' }}>Mobile Number</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="text"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>
                            </div>
                        )}

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
                                <Shield size={20} color="var(--primary)" />
                                <h3 style={{ fontSize: '1.2rem' }}>Privacy & Password</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem', color: 'var(--text-muted)' }}>New Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Leave blank to keep current"
                                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem', color: 'var(--text-muted)' }}>Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat new password"
                                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '1rem', border: '1px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginTop: '3rem', width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '1.2rem' }}
                            disabled={loading}
                        >
                            {loading ? 'Propagating Changes...' : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center' }}>
                                    <Save size={20} /> Save Platform Identity
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
