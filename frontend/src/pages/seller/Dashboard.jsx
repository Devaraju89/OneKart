import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Plus, ArrowRight, TrendingUp, Star, Clock, Leaf, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, sub, accent, to }) => {
    const content = (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--cream)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
        >
            <div style={{ width: '56px', height: '56px', flexShrink: 0, background: accent + '18', border: `1.5px solid ${accent}40`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, boxShadow: '3px 3px 0px rgba(61,43,31,0.08)' }}>
                <Icon size={26} strokeWidth={1.5} />
            </div>
            <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ fontFamily: "'IM Fell English SC', serif", fontSize: '2rem', color: 'var(--soil)', lineHeight: '1' }}>{value}</div>
                {sub && <div style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{sub}</div>}
            </div>
        </div>
    );
    return to ? <Link to={to} style={{ textDecoration: 'none' }}>{content}</Link> : content;
};

const SellerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, lowStock: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const { data: ordersData } = await axios.get('/api/orders');
            const orders = (ordersData.data || []).filter(o => o && o.status);
            const activeOrders = orders.filter(o => o.status !== 'Cancelled');
            const totalRevenue = activeOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

            const { data: productsData } = await axios.get('/api/products?keyword=');
            let myProducts = [];
            let lowStockCount = 0;
            if (productsData.data && Array.isArray(productsData.data)) {
                myProducts = productsData.data.filter(p => p && (p.seller?._id === user.id || p.seller === user.id));
                lowStockCount = myProducts.filter(p => (p.quantity || 0) < 20).length;
            }
            setStats({ products: myProducts.length, orders: activeOrders.length, revenue: totalRevenue, lowStock: lowStockCount });
            setRecentOrders(orders.slice(0, 5));
        } catch (err) { console.error('Dashboard Load Error:', err); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            let trackingNumber = null;
            if (status === 'Shipped' || status === 'Out for Delivery') { trackingNumber = window.prompt('Enter Tracking Number (Optional):'); }
            await axios.put(`/api/orders/${id}/status`, { status, trackingNumber });
            toast.success(`Order updated to ${status}`);
            fetchData();
        } catch { toast.error('Update failed'); }
    };

    const getTimeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div style={{ background: 'var(--parchment)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")', minHeight: '100vh', paddingTop: '80px', paddingBottom: '6rem' }}>

            {/* ── Header ── */}
            <div style={{ background: 'var(--soil)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")', backgroundBlendMode: 'multiply', borderBottom: '3px solid var(--border-dk)', padding: '3rem 0 2.5rem', marginBottom: '4rem' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.8rem' }}>
                            <div style={{ width: '24px', height: '1.5px', background: 'var(--gold)' }} />
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>Farmer · Estate Dashboard</span>
                        </div>
                        <h1 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--parchment)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '400', margin: 0 }}>
                            Welcome back, {user?.name?.split(' ')[0]}.
                        </h1>
                        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'rgba(245,239,215,0.65)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Here's what's happening on your farm today.</p>
                    </div>
                    <Link to="/seller/add-product" className="btn" style={{ background: 'var(--gold)', color: 'var(--soil)', border: '2px solid var(--gold)', padding: '0.75rem 1.6rem', fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '4px 4px 0px rgba(61,43,31,0.3)', borderRadius: '4px' }}>
                        <Plus size={18} /> List New Product
                    </Link>
                </div>
            </div>

            <div className="container">
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    <StatCard icon={Package} label="Live Products" value={stats.products} sub="In your catalog" accent="var(--rust)" />
                    <StatCard icon={ShoppingCart} label="Total Orders" value={stats.orders} sub="Excl. cancelled" accent="var(--gold)" />
                    <StatCard icon={TrendingUp} label="Earnings" value={`₹${stats.revenue.toLocaleString()}`} sub="Gross revenue" accent="var(--sage)" />
                    <StatCard icon={Star} label="Feedback" value="Reports" sub="View all reviews" accent="var(--soil)" to="/seller/reviews" />
                </div>

                {/* Divider */}
                <div style={{ height: '1.5px', background: 'linear-gradient(to right, transparent, var(--border-dk), transparent)', marginBottom: '3rem' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                    {/* Inventory Status */}
                    <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--cream)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", fontSize: '1.5rem', color: 'var(--soil)', fontWeight: '400' }}>Inventory Status</h3>
                            <Link to="/seller/products" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.75rem', color: 'var(--rust)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                Manage <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {[
                                { label: 'Your Active Catalog', value: `${stats.products} Items`, ok: true },
                                { label: 'Stock Alert', value: stats.lowStock > 0 ? `${stats.lowStock} Items Low` : 'Healthy Levels', ok: stats.lowStock === 0 }
                            ].map(({ label, value, ok }) => (
                                <div key={label} style={{ padding: '1rem 1.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: ok ? 'rgba(90,122,75,0.07)' : 'rgba(193,68,14,0.07)', border: `1.5px solid ${ok ? 'rgba(90,122,75,0.25)' : 'rgba(193,68,14,0.25)'}`, borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Lora', serif", fontSize: '0.9rem', color: 'var(--soil)', fontWeight: '600' }}>
                                        {ok ? <Leaf size={16} color="var(--sage)" strokeWidth={1.5} /> : <AlertTriangle size={16} color="var(--rust)" strokeWidth={1.5} />}
                                        {label}
                                    </div>
                                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.82rem', color: ok ? 'var(--sage)' : 'var(--rust)', letterSpacing: '0.05em' }}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--cream)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", fontSize: '1.5rem', color: 'var(--soil)', fontWeight: '400' }}>Recent Activity</h3>
                            <Link to="/seller/orders" style={{ fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.75rem', color: 'var(--rust)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                Full List <ArrowRight size={14} />
                            </Link>
                        </div>

                        {loading ? (
                            <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Loading…</p>
                        ) : recentOrders.length === 0 ? (
                            <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No recent orders yet.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '0.8rem' }}>
                                {recentOrders.map(order => (
                                    <div key={order._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.9rem 1.2rem', background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: order.status === 'Delivered' ? 'var(--sage)' : order.status === 'Cancelled' ? 'var(--rust)' : 'var(--gold)' }} />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontFamily: "'Lora', serif", fontSize: '0.88rem', fontWeight: '600', color: 'var(--soil)' }}>
                                                #{order._id.substr(-6)} <span style={{ fontWeight: '400', color: 'var(--text-muted)', fontStyle: 'italic' }}>· {order.user?.name || 'Guest'}</span>
                                            </div>
                                            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>
                                                {getTimeAgo(order.createdAt)} · ₹{order.totalPrice}
                                            </div>
                                        </div>
                                        {order.status === 'Cancelled' ? (
                                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', padding: '0.25rem 0.7rem', background: 'rgba(193,68,14,0.1)', color: 'var(--rust)', border: '1px solid rgba(193,68,14,0.3)', borderRadius: '2px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cancelled</span>
                                        ) : (
                                            <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}
                                                style={{ fontSize: '0.68rem', padding: '0.3rem 0.6rem', border: '1.5px solid var(--border)', background: 'var(--parchment-dk)', fontFamily: "'Outfit', sans-serif", fontWeight: '700', cursor: 'pointer', outline: 'none', borderRadius: '3px', color: 'var(--soil)' }}>
                                                {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
