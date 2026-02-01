import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Plus, ArrowRight, TrendingUp, Users, DollarSign, Layers, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const SellerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, lowStock: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: ordersData } = await axios.get('/api/orders');
            const orders = ordersData.data || [];

            // Calculate Stats
            const activeOrders = orders.filter(order => order.status !== 'Cancelled');
            const totalRevenue = activeOrders.reduce((acc, order) => acc + order.totalPrice, 0);

            // Fetch products for inventory insights
            const { data: productsData } = await axios.get('/api/products?keyword=');
            let myProducts = [];
            let lowStockCount = 0;

            if (productsData.data) {
                myProducts = productsData.data.filter(p => p.seller._id === user.id || p.seller === user.id);
                lowStockCount = myProducts.filter(p => p.quantity < 20).length;
            }

            setStats({
                products: myProducts.length,
                orders: activeOrders.length,
                revenue: totalRevenue,
                lowStock: lowStockCount
            });

            setRecentOrders(orders.slice(0, 5));
            setLoading(false);

        } catch (error) {
            console.error("Dashboard Load Error:", error);
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            let trackingNumber = null;
            if (status === 'Shipped' || status === 'Out for Delivery') {
                trackingNumber = window.prompt("Enter Tracking Number (Optional):");
            }

            await axios.put(`/api/orders/${id}/status`, { status, trackingNumber });
            toast.success(`Order #${id.substr(-6)} updated to ${status}`);
            fetchData(); // Refresh list
        } catch (error) {
            toast.error('Update failed');
        }
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
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Welcome back, {user?.name}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your farm today</p>
                    </div>
                    <Link to="/seller/add-product" className="btn btn-primary" style={{ borderRadius: '1.2rem' }}>
                        <Plus size={20} /> List New Product
                    </Link>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', background: '#d1fae5', color: 'var(--primary)', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Layers size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Live Products</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{stats.products}</div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', background: '#e0e7ff', color: '#6366f1', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingCart size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Orders</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{stats.orders}</div>
                        </div>
                    </div>
                    <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ width: '60px', height: '60px', background: '#fef3c7', color: '#f59e0b', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DollarSign size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Earnings</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{stats.revenue.toLocaleString()}</div>
                        </div>
                    </div>
                    <Link to="/seller/reviews" className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none', color: 'inherit', transition: 'transform 0.3s' }}>
                        <div style={{ width: '60px', height: '60px', background: '#e0f2fe', color: '#0ea5e9', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star size={32} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Feedback</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                View Reports <ArrowRight size={16} />
                            </div>
                        </div>
                    </Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Inventory (Static for now/placeholder or could be real) */}
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem' }}>Inventory Status</h3>
                            <Link to="/seller/products" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Manage All <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div style={{ display: 'grid', gap: '1.2rem' }}>
                            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: '600' }}>Your Active Catalog</span>
                                <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{stats.products} Items Sourced</span>
                            </div>

                            <div style={{
                                padding: '1rem',
                                background: stats.lowStock > 0 ? '#fef2f2' : '#f0fdf4',
                                borderRadius: '1rem',
                                border: stats.lowStock > 0 ? '1px solid #fee2e2' : '1px solid #bbf7d0',
                                display: 'flex', justifyContent: 'space-between',
                                color: stats.lowStock > 0 ? '#dc2626' : '#15803d'
                            }}>
                                <span style={{ fontWeight: '600' }}>Stock Action</span>
                                <span style={{ fontWeight: '800' }}>
                                    {stats.lowStock > 0 ? `${stats.lowStock} Items Low` : 'Healthy Levels'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity - NOW DYNAMIC AND ACTIONABLE */}
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem' }}>Recent Activity</h3>
                            <Link to="/seller/orders" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                View Full List <ArrowRight size={16} />
                            </Link>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>Loading updates...</div>
                        ) : recentOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>No recent activity to report.</div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1.2rem' }}>
                                {recentOrders.map(order => (
                                    <div key={order._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.8rem', background: '#fff', border: '1px solid #f1f5f9', borderRadius: '1rem' }}>
                                        <div style={{
                                            width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
                                            background: order.status === 'Delivered' ? '#10b981' : order.status === 'Cancelled' ? '#ef4444' : 'var(--primary)'
                                        }}></div>

                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '700', lineHeight: 1.2 }}>
                                                Order #{order._id.substr(-6)}
                                                <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}> via {order.user?.name || 'Guest'}</span>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                {getTimeAgo(order.createdAt)} • ₹{order.totalPrice}
                                            </div>
                                        </div>

                                        {/* Quick Action Status */}
                                        {order.status === 'Cancelled' ? (
                                            <span style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '100px', background: '#fee2e2', color: '#ef4444', fontWeight: '800' }}>
                                                CANCELLED
                                            </span>
                                        ) : (
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                style={{
                                                    fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '100px',
                                                    border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '700',
                                                    cursor: 'pointer', outline: 'none', maxWidth: '120px'
                                                }}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Out for Delivery">In Transit</option>
                                                <option value="Delivered">Done</option>
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
