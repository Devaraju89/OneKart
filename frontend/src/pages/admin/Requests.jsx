import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCheck, UserX, ShieldCheck, Mail, Phone, Clock, AlertCircle, Sprout } from 'lucide-react';
import toast from 'react-hot-toast';

const PageHeader = ({ eyebrow, title, subtitle }) => (
    <div style={{
        background: 'var(--soil)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")',
        backgroundBlendMode: 'multiply',
        borderBottom: '3px solid var(--border-dk)',
        padding: '3rem 0 2.5rem',
        marginBottom: '4rem'
    }}>
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.8rem' }}>
                <div style={{ width: '24px', height: '1.5px', background: 'var(--gold)' }} />
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>{eyebrow}</span>
            </div>
            <h1 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--parchment)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '400', margin: 0 }}>{title}</h1>
            {subtitle && <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'rgba(245,239,215,0.65)', fontSize: '0.95rem', marginTop: '0.5rem' }}>{subtitle}</p>}
        </div>
    </div>
);

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { fetchRequests(); }, []);

    const fetchRequests = async () => {
        setLoading(true); setError(null);
        try {
            const { data } = await axios.get('/api/users/pending');
            setRequests(data.data);
        } catch {
            setError('Could not load pending requests. Please check connection.');
            toast.error('Failed to fetch applications');
        } finally { setLoading(false); }
    };

    const approveUser = async (id) => {
        try {
            const res = await axios.put(`/api/users/seller/${id}/approve`);
            if (res.data.status === 'success') { toast.success('Farmer approved successfully!'); fetchRequests(); }
        } catch { toast.error('Approval failed'); }
    };

    const rejectUser = async (id) => {
        if (window.confirm('Permanently reject and delete this application?')) {
            try {
                await axios.delete(`/api/users/${id}`);
                toast.success('Application rejected and removed');
                fetchRequests();
            } catch { toast.error('Rejection failed'); }
        }
    };

    return (
        <div style={{ background: 'var(--parchment)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")', minHeight: '100vh', paddingTop: '80px', paddingBottom: '6rem' }}>
            <PageHeader eyebrow="Admin · Applications" title="Farmer Verification Queue" subtitle="Review and approve incoming estate farmer registrations." />
            <div className="container" style={{ maxWidth: '960px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div className="loader" style={{ margin: '0 auto 1.5rem' }} />
                        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)' }}>Pulling from the field registry…</p>
                    </div>
                ) : error ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', background: 'var(--cream)', borderLeft: '4px solid var(--rust)' }}>
                        <AlertCircle size={48} color="var(--rust)" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontFamily: "'IM Fell English SC', serif", color: 'var(--rust)', marginBottom: '0.8rem' }}>Connection Error</h3>
                        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
                        <button onClick={fetchRequests} className="btn btn-primary">Retry</button>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--cream)' }}>
                        <div style={{ width: '90px', height: '90px', background: 'var(--parchment-dk)', border: '1.5px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '3px 3px 0px var(--border)', color: 'var(--sage)' }}>
                            <ShieldCheck size={44} strokeWidth={1.5} />
                        </div>
                        <h2 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--soil)', fontWeight: '400', marginBottom: '1rem' }}>Queue is Clear</h2>
                        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto', lineHeight: '1.7' }}>
                            All farmer applications have been processed. New requests will appear here as farmers register.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* Count strip */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1.4rem', background: 'rgba(200,147,26,0.12)', border: '1.5px solid rgba(200,147,26,0.35)', borderRadius: '4px' }}>
                            <Sprout size={18} color="var(--gold)" strokeWidth={1.5} />
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.8rem', color: 'var(--soil)', letterSpacing: '0.08em' }}>
                                {requests.length} application{requests.length > 1 ? 's' : ''} awaiting your review
                            </span>
                        </div>

                        {requests.map((user, i) => (
                            <div key={user._id} className="glass-card reveal-up active" style={{
                                padding: '2rem 2.5rem', background: 'var(--cream)',
                                display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr',
                                gap: '2rem', alignItems: 'center',
                                transitionDelay: `${i * 0.06}s`
                            }}>
                                {/* Identity */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                    <div style={{
                                        width: '56px', height: '56px', flexShrink: 0,
                                        background: 'var(--soil)', color: 'var(--parchment)',
                                        borderRadius: '4px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: '1.5rem',
                                        fontFamily: "'IM Fell English SC', serif",
                                        boxShadow: '3px 3px 0px var(--soil-light)'
                                    }}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: "'IM Fell English SC', Georgia, serif", fontSize: '1.2rem', color: 'var(--soil)', marginBottom: '0.3rem' }}>{user.name}</div>
                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}>
                                            <Mail size={13} /> {user.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                                        <Phone size={13} color="var(--rust)" /> {user.mobile || 'No Phone'}
                                    </div>
                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Clock size={13} color="var(--text-muted)" /> {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.7rem 1.4rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                        onClick={() => approveUser(user._id)}
                                    >
                                        <UserCheck size={16} /> Approve
                                    </button>
                                    <button
                                        onClick={() => rejectUser(user._id)}
                                        style={{
                                            padding: '0.7rem', background: 'rgba(193,68,14,0.1)',
                                            border: '1.5px solid rgba(193,68,14,0.35)', borderRadius: '4px',
                                            color: 'var(--rust)', cursor: 'pointer', display: 'flex',
                                            boxShadow: '2px 2px 0px rgba(193,68,14,0.15)', transition: 'all 0.25s ease'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--rust)'; e.currentTarget.style.color = 'white'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(193,68,14,0.1)'; e.currentTarget.style.color = 'var(--rust)'; }}
                                    >
                                        <UserX size={18} strokeWidth={2} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageRequests;
