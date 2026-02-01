import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCheck, UserX, ShieldCheck, Mail, Phone, Calendar, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get('/api/users/pending');
            console.log("Seller Requests Data:", data.data);
            setRequests(data.data);
        } catch (error) {
            console.error("Fetch Requests Error:", error);
            setError("Could not load pending requests. Please check connection.");
            toast.error("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    const approveUser = async (id) => {
        try {
            const res = await axios.put(`/api/users/seller/${id}/approve`);
            if (res.data.status === 'success') {
                toast.success('Seller approved successfully!');
                fetchRequests();
            }
        } catch (error) {
            toast.error('Approval failed');
        }
    };

    const rejectUser = async (id) => {
        if (window.confirm('Permanently reject and delete this application?')) {
            try {
                await axios.delete(`/api/users/${id}`);
                toast.success('Application rejected and removed');
                fetchRequests();
            } catch (error) {
                toast.error('Rejection failed');
            }
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '8rem 0 4rem 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em', color: 'var(--text-main)' }}>Verification Queue</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Review and moderate incoming farmer registration requests.</p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '2rem' }}>
                        <div className="loader" style={{ margin: '0 auto 1.5rem' }}></div>
                        <p style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Synching with database...</p>
                    </div>
                ) : error ? (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem', border: '1px solid #fee2e2' }}>
                        <AlertCircle size={48} color="#dc2626" style={{ margin: '0 auto 1.5rem' }} />
                        <h3 style={{ color: '#dc2626' }}>Connection Error</h3>
                        <p style={{ color: 'var(--text-muted)' }}>{error}</p>
                        <button onClick={fetchRequests} className="btn btn-primary" style={{ marginTop: '2rem' }}>Retry Connection</button>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white' }}>
                        <div style={{ width: '100px', height: '100px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <ShieldCheck size={50} />
                        </div>
                        <h2 style={{ fontWeight: '800' }}>Queue is Clear</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                            Great job! All farmer applications have been processed. You'll be notified when new requests arrive.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {requests.map(user => (
                            <div key={user._id} className="card animate-fade" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '2.5rem', alignItems: 'center', border: '1px solid #f1f5f9' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                        <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, var(--primary), #059669)', color: 'white', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: '900', boxShadow: '0 8px 15px rgba(16, 185, 129, 0.2)' }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--text-main)' }}>{user.name}</div>
                                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.3rem' }}>
                                                <Mail size={14} /> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'grid', gap: '0.6rem' }}>
                                        <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#475569', fontWeight: '500' }}>
                                            <Phone size={14} color="var(--primary)" /> {user.mobile || 'No Phone'}
                                        </div>
                                        <div style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#475569', fontWeight: '500' }}>
                                            <Clock size={14} color="var(--primary)" /> {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.8rem 1.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderRadius: '1.2rem', fontWeight: '700' }}
                                        onClick={() => approveUser(user._id)}
                                    >
                                        <UserCheck size={20} /> Approve
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.8rem', borderRadius: '1.2rem' }}
                                        onClick={() => rejectUser(user._id)}
                                    >
                                        <UserX size={22} />
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
