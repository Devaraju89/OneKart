import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Trash2, Search, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const PageHeader = ({ eyebrow, title, subtitle }) => (
    <div style={{
        background: 'var(--soil)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")',
        backgroundBlendMode: 'multiply',
        borderBottom: '3px solid var(--border-dk)',
        padding: '3rem 0 2.5rem', marginBottom: '4rem'
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

const roleBadge = (role) => {
    const map = { admin: { bg: 'rgba(193,68,14,0.12)', color: 'var(--rust)', border: 'rgba(193,68,14,0.3)' }, farmer: { bg: 'rgba(90,122,75,0.12)', color: 'var(--sage)', border: 'rgba(90,122,75,0.3)' }, customer: { bg: 'rgba(200,147,26,0.12)', color: 'var(--gold)', border: 'rgba(200,147,26,0.3)' } };
    const s = map[role] || map.customer;
    return { display: 'inline-block', padding: '0.2rem 0.7rem', border: `1.5px solid ${s.border}`, borderRadius: '2px', background: s.bg, color: s.color, fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'capitalize' };
};

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/users');
            setUsers(data.data);
        } catch { toast.error('Could not fetch community directory'); }
        finally { setLoading(false); }
    };

    const deleteUser = async (id) => {
        if (window.confirm('Permanently remove this member from the estate registry?')) {
            try {
                await axios.delete(`/api/users/${id}`);
                toast.success('Member removed from registry');
                fetchUsers();
            } catch { toast.error('Operation failed'); }
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ background: 'var(--parchment)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")', minHeight: '100vh', paddingTop: '80px', paddingBottom: '6rem' }}>
            <PageHeader eyebrow="Admin · Member Registry" title="Platform Community" subtitle="Account management and oversight for all platform members." />
            <div className="container">

                {/* Search & Count Bar */}
                <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', background: 'var(--cream)', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                        <Search size={16} strokeWidth={2} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text" placeholder="Search by name or email…"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem',
                                background: 'var(--parchment-dk)', border: '1.5px solid var(--border)',
                                borderRadius: '4px', fontFamily: "'Lora', serif", fontSize: '0.88rem',
                                color: 'var(--soil)', outline: 'none', boxShadow: '2px 2px 0px var(--border)'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.2rem', background: 'var(--soil)', borderRadius: '4px', boxShadow: '3px 3px 0px var(--soil-light)' }}>
                        <ShieldCheck size={16} color="var(--parchment)" strokeWidth={2} />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.75rem', color: 'var(--parchment)', letterSpacing: '0.1em' }}>{users.length} Members</span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}><div className="loader" style={{ margin: '0 auto' }} /></div>
                ) : (
                    <div className="glass-card" style={{ overflow: 'hidden', background: 'var(--cream)', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--parchment-dkr)', borderBottom: '2px solid var(--border)' }}>
                                    {['Member', 'Role', 'Status', 'Actions'].map((h, i) => (
                                        <th key={h} style={{
                                            padding: '1.2rem 2rem', textAlign: i === 3 ? 'right' : 'left',
                                            fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem',
                                            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em',
                                            color: 'var(--text-muted)'
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u, i) => (
                                    <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--cream)' : 'var(--parchment)' }}>
                                        <td style={{ padding: '1.3rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '40px', height: '40px', background: 'var(--soil)',
                                                    color: 'var(--parchment)', borderRadius: '4px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontFamily: "'IM Fell English SC', serif", fontSize: '1.1rem',
                                                    boxShadow: '2px 2px 0px var(--soil-light)', flexShrink: 0
                                                }}>{u.name.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontFamily: "'Lora', serif", fontWeight: '600', color: 'var(--soil)' }}>{u.name}</div>
                                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', fontWeight: '600' }}>
                                                        <Mail size={12} /> {u.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.3rem 2rem' }}>
                                            <span style={roleBadge(u.role)}>{u.role}</span>
                                        </td>
                                        <td style={{ padding: '1.3rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '7px', height: '7px', background: 'var(--sage)', borderRadius: '50%', boxShadow: '0 0 6px var(--sage)' }} />
                                                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', fontWeight: '700', color: 'var(--sage)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.3rem 2rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => deleteUser(u._id)} title="Remove from registry"
                                                style={{
                                                    padding: '0.5rem', background: 'rgba(193,68,14,0.08)',
                                                    border: '1.5px solid rgba(193,68,14,0.25)', borderRadius: '4px',
                                                    color: 'var(--rust)', cursor: 'pointer', display: 'inline-flex',
                                                    transition: 'all 0.25s ease', boxShadow: '2px 2px 0px rgba(193,68,14,0.1)'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--rust)'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(193,68,14,0.08)'; e.currentTarget.style.color = 'var(--rust)'; }}
                                            >
                                                <Trash2 size={16} strokeWidth={2} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)' }}>
                                No members match that search term.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
