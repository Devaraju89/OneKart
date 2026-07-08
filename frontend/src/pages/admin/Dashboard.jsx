import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, ClipboardList, UserPlus, Wheat, Sprout, TrendingUp, ArrowRight } from 'lucide-react';

/* ─── Shared heritage page layout wrapper ─── */
const PageWrap = ({ children }) => (
    <div style={{
        background: 'var(--parchment)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
        minHeight: '100vh', paddingTop: '80px', paddingBottom: '6rem'
    }}>
        {children}
    </div>
);

/* ─── Heritage page header band ─── */
const PageHeader = ({ eyebrow, title, subtitle, extra }) => (
    <div style={{
        background: 'var(--soil)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")',
        backgroundBlendMode: 'multiply',
        borderBottom: '3px solid var(--border-dk)',
        padding: '3rem 0 2.5rem',
        marginBottom: '4rem'
    }}>
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.8rem' }}>
                        <div style={{ width: '24px', height: '1.5px', background: 'var(--gold)' }} />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>{eyebrow}</span>
                    </div>
                    <h1 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--parchment)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '400', margin: 0 }}>{title}</h1>
                    {subtitle && <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'rgba(245,239,215,0.65)', fontSize: '0.95rem', marginTop: '0.5rem' }}>{subtitle}</p>}
                </div>
                {extra}
            </div>
        </div>
    </div>
);

/* ─── Heritage stat card ─── */
const StatCard = ({ icon: Icon, label, value, sub, accent, delay = 0 }) => (
    <div className="reveal-up active glass-card" style={{
        padding: '2.5rem', background: 'var(--cream)',
        position: 'relative', overflow: 'hidden',
        transitionDelay: `${delay}s`
    }}>
        <div style={{
            width: '56px', height: '56px', borderRadius: '4px',
            background: accent + '18', border: `1.5px solid ${accent}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accent, marginBottom: '1.5rem',
            boxShadow: '3px 3px 0px rgba(61,43,31,0.1)'
        }}>
            <Icon size={26} strokeWidth={1.5} />
        </div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{label}</div>
        <div style={{ fontFamily: "'IM Fell English SC', serif", fontSize: '2.4rem', color: 'var(--soil)', lineHeight: '1', marginBottom: '0.4rem' }}>{value}</div>
        {sub && <div style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--text-muted)' }}>{sub}</div>}
        <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.04, color: 'var(--soil)' }}>
            <Icon size={100} />
        </div>
    </div>
);

/* ─── Heritage action card ─── */
const ActionCard = ({ to, icon: Icon, title, desc, badge, accent, delay = 0 }) => (
    <Link to={to} className="reveal-up active glass-card" style={{
        padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem',
        background: 'var(--cream)', textDecoration: 'none', transitionDelay: `${delay}s`
    }}>
        <div style={{
            width: '58px', height: '58px', borderRadius: '4px',
            background: accent + '15', border: `1.5px solid ${accent}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accent, boxShadow: '3px 3px 0px rgba(61,43,31,0.08)'
        }}>
            <Icon size={28} strokeWidth={1.5} />
        </div>
        <div style={{ flex: 1 }}>
            <h3 style={{
                fontFamily: "'IM Fell English SC', Georgia, serif",
                fontSize: '1.3rem', color: 'var(--soil)', fontWeight: '400',
                marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.6rem'
            }}>
                {title}
                {badge > 0 && (
                    <span style={{ padding: '0.15rem 0.5rem', background: 'var(--rust)', color: 'white', borderRadius: '2px', fontSize: '0.65rem', fontFamily: "'Outfit', sans-serif", fontWeight: '700' }}>{badge}</span>
                )}
            </h3>
            <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.65' }}>{desc}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: accent, fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Open <ArrowRight size={15} />
        </div>
    </Link>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, farmers: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, ordersRes] = await Promise.all([axios.get('/api/users'), axios.get('/api/orders')]);
                const users = usersRes.data.data || [];
                const orders = ordersRes.data.data || [];
                const farmers = users.filter(u => u.role === 'farmer').length;
                const pendingFarmers = users.filter(u => u.role === 'farmer' && u.status === 'pending').length;
                const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + (o.totalPrice || 0), 0);
                const activeOrders = orders.filter(o => o.status !== 'Cancelled').length;
                setStats({ revenue: totalRevenue, orders: activeOrders, users: users.length, farmers, pending: pendingFarmers });
            } catch (err) { console.error('Dashboard Data Error', err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const statCards = [
        { icon: TrendingUp, label: 'Total Revenue', value: loading ? '…' : `₹${stats.revenue.toLocaleString()}`, sub: 'Lifetime gross volume', accent: 'var(--rust)' },
        { icon: Users, label: 'Platform Members', value: loading ? '…' : stats.users, sub: `${stats.farmers} Farmers · ${stats.users - stats.farmers} Customers`, accent: 'var(--gold)' },
        { icon: ClipboardList, label: 'Active Orders', value: loading ? '…' : stats.orders, sub: 'Excluding cancelled', accent: 'var(--sage)' },
        { icon: Sprout, label: 'Farmer Partners', value: loading ? '…' : stats.farmers, sub: stats.pending > 0 ? `${stats.pending} pending approval` : 'All verified', accent: 'var(--soil)' },
    ];

    const actionCards = [
        { to: '/admin/requests', icon: UserPlus, title: 'Farmer Applications', desc: 'Review and approve incoming farmer estate registrations and verify credentials.', badge: stats.pending, accent: 'var(--rust)', delay: 0 },
        { to: '/admin/users', icon: Users, title: 'Manage Community', desc: 'Full directory of all customers and active farmers. Handle support and account status.', accent: 'var(--gold)', delay: 0.06 },
        { to: '/admin/orders', icon: ShoppingBag, title: 'Platform Orders', desc: 'Monitor all sales across the marketplace. Oversee logistics and resolve disputes.', accent: 'var(--sage)', delay: 0.12 },
        { to: '/admin/products', icon: Wheat, title: 'All Products', desc: 'Browse and manage every product listed across the entire estate marketplace.', accent: 'var(--soil)', delay: 0.18 },
    ];

    return (
        <PageWrap>
            <PageHeader
                eyebrow="Admin · Oversight Panel"
                title="Marketplace Control"
                subtitle="Real-time platform metrics and administrative governance."
                extra={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.2rem', background: 'rgba(90,122,75,0.25)', border: '1.5px solid var(--sage)', borderRadius: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--sage-light)', boxShadow: '0 0 8px var(--sage)' }} />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--sage-light)' }}>System Online</span>
                    </div>
                }
            />
            <div className="container">
                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    {statCards.map((s, i) => <StatCard key={i} {...s} delay={i * 0.06} />)}
                </div>

                {/* Aged divider */}
                <div style={{ height: '1.5px', background: 'linear-gradient(to right, transparent, var(--border-dk), transparent)', marginBottom: '3rem' }} />

                {/* Action Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                    {actionCards.map((a, i) => <ActionCard key={i} {...a} />)}
                </div>
            </div>
        </PageWrap>
    );
};

export default AdminDashboard;
