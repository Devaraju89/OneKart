import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, ClipboardList, TrendingUp, ShieldCheck, UserPlus, PackageSearch, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, farmers: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Users and Orders in parallel for full oversight
                const [usersRes, ordersRes] = await Promise.all([
                    axios.get('/api/users'),
                    axios.get('/api/orders')
                ]);

                const users = usersRes.data.data || [];
                const orders = ordersRes.data.data || [];

                // Calculate User Stats
                const farmers = users.filter(u => u.role === 'farmer').length;
                const pendingFarmers = users.filter(u => u.role === 'farmer' && u.status === 'pending').length; // Logic depends on backend response

                // Calculate Revenue (Sum of all completed/paid orders excluding cancelled)
                const totalRevenue = orders
                    .filter(order => order.status !== 'Cancelled')
                    .reduce((acc, order) => acc + (order.totalPrice || 0), 0);

                const activeOrdersCount = orders.filter(order => order.status !== 'Cancelled').length;

                setStats({
                    revenue: totalRevenue,
                    orders: activeOrdersCount,
                    users: users.length,
                    farmers: farmers,
                    pending: pendingFarmers // If we can't derive this easily from /api/users, we might need /api/users/stats. But let's assume /api/users returns all.
                });

                setRecentActivity(orders.slice(0, 5));

            } catch (err) {
                console.error("Dashboard Data Error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '8rem 0 4rem 0' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Marketplace Oversight</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Real-time platform metrics and administrative control.</p>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)', background: '#eff6ff', padding: '0.5rem 1rem', borderRadius: '20px' }}>
                        Live System Status: Online
                    </div>
                </div>

                {/* Stat Summary Section */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    {/* Revenue Card */}
                    <div className="card animate-fade" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden', border: 'none', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Revenue</div>
                            <div style={{ fontSize: '2.8rem', fontWeight: '800', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.5rem', marginRight: '4px', opacity: 0.7 }}>₹</span>
                                {loading ? '...' : stats.revenue.toLocaleString()}
                            </div>
                            <div style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.6 }}>Lifetime Gross Volume</div>
                        </div>
                        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1 }}>
                            <ShoppingBag size={140} />
                        </div>
                    </div>

                    {/* Users / Community Card */}
                    <div className="card animate-fade" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', animationDelay: '0.1s' }}>
                        <div style={{ width: '70px', height: '70px', background: '#eff6ff', color: '#2563eb', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={36} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '600' }}>Platform Members</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1 }}>{loading ? '...' : stats.users}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{stats.farmers} Farmers / {stats.users - stats.farmers} Customers</div>
                        </div>
                    </div>

                    {/* Orders Card */}
                    <div className="card animate-fade" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', animationDelay: '0.2s' }}>
                        <div style={{ width: '70px', height: '70px', background: '#f0fdf4', color: '#16a34a', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ClipboardList size={36} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Orders Processed</div>
                            <div style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: 1 }}>{loading ? '...' : stats.orders}</div>
                            <Link to="/admin/orders" style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                                View All Logistics <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Management Actions */}
                    <Link to="/admin/requests" className="card animate-fade" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid #f1f5f9' }}>
                        <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserPlus size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Seller Requests {stats.pending > 0 && <span style={{ padding: '2px 8px', background: '#fee2e2', color: '#dc2626', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', marginLeft: '0.5rem' }}>{stats.pending}</span>}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                Review documentation and verify credentials for new farmer applications.
                            </p>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '700' }}>
                            Go to Approvals <ChevronRight size={20} />
                        </div>
                    </Link>

                    <Link to="/admin/users" className="card animate-fade" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transitionDelay: '0.1s' }}>
                        <div style={{ width: '64px', height: '64px', background: '#e0e7ff', color: '#6366f1', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Manage Community</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                Full directory of customers and active farmers. Handle support and account status.
                            </p>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6366f1', fontWeight: '700' }}>
                            View All Users <ChevronRight size={20} />
                        </div>
                    </Link>

                    <Link to="/admin/orders" className="card animate-fade" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transitionDelay: '0.2s' }}>
                        <div style={{ width: '64px', height: '64px', background: '#fef3c7', color: '#f59e0b', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBag size={32} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Platform Orders</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                Monitor sales across the entire marketplace. Oversee logistics and disputes.
                            </p>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b', fontWeight: '700' }}>
                            Order Management <ChevronRight size={20} />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Helper for UI
const ChevronRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

export default AdminDashboard;
