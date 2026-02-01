import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Shield, UserX, Trash2, Search, Filter, ShieldCheck, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/users');
            setUsers(data.data);
        } catch (error) {
            toast.error("Security alert: Could not fetch community directory");
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Revoke access and permanently remove this identity?')) {
            try {
                await axios.delete(`/api/users/${id}`);
                toast.success('Identity removed from platform');
                fetchUsers();
            } catch (error) {
                toast.error('Operation failed: Access denied');
            }
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '8rem 0 4rem 0' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Platform Registry</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Security oversight and account management for all platform members</p>
                    </div>
                </div>

                <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Find by name or email identity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '1.2rem', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <div style={{
                            padding: '0.8rem 1.2rem', background: 'var(--primary)', color: 'var(--creamy)',
                            borderRadius: '1rem', fontSize: '0.9rem', fontWeight: '700',
                            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(22, 66, 60, 0.2)'
                        }}>
                            <ShieldCheck size={18} />
                            <span>{users.length} Authorized Members</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="loader"></div>
                    </div>
                ) : (
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Identity</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Role</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                                    <th style={{ padding: '1.5rem 2rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                                <div style={{ width: '44px', height: '44px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{u.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Mail size={14} /> {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{
                                                display: 'inline-flex', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'capitalize',
                                                background: u.role === 'admin' ? '#fee2e2' : u.role === 'farmer' ? '#e0f2fe' : '#f0fdf4',
                                                color: u.role === 'admin' ? '#b91c1c' : u.role === 'farmer' ? '#0369a1' : '#15803d'
                                            }}>
                                                {u.role}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#059669', fontWeight: '600' }}>
                                                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
                                                Active
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                                                <button
                                                    onClick={() => deleteUser(u._id)}
                                                    style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#dc2626', padding: '0.6rem', borderRadius: '0.8rem', cursor: 'pointer' }}
                                                    title="Remove Identity"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                No identities match your search term.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
