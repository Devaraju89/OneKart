import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, Search, ExternalLink, Calendar, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/orders');
            setOrders(data.data || []);
        } catch (error) {
            toast.error("Logistics Insight: Could not fetch platform orders");
        } finally {
            setLoading(false);
        }
    };

    const markDelivered = async (id) => {
        try {
            // Using the generic status update route
            await axios.put(`/api/orders/${id}/status`, { status: 'Delivered' });
            toast.success('Logistics Status: Delivered');
            fetchOrders();
        } catch (error) {
            toast.error('Logistics update failed');
        }
    };

    const updateRefundStatus = async (id, refundStatus) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { refundStatus });
            toast.success(`Refund Status: ${refundStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error('Refund status update failed');
        }
    };

    const filteredOrders = orders.filter(o =>
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.user?.name || 'Guest').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return '#10b981';
            case 'Shipped': return '#6366f1';
            case 'Processing': return '#f59e0b';
            case 'Cancelled': return '#ef4444';
            default: return '#64748b';
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '8rem 0 4rem 0' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Marketplace Logistics</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Global oversight of all transactions and fulfillment status</p>
                    </div>
                    <button
                        onClick={fetchOrders}
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1.2rem', borderRadius: '12px' }}
                    >
                        <RefreshCw size={18} /> Sync Orders
                    </button>
                </div>

                <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '1.2rem', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="loader"></div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {filteredOrders.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>No orders found matching criteria.</div>
                        ) : filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                            <div key={order._id} className="card animate-fade" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* Top Row: Order Header & Customer Info */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>ORDER #{order._id.substring(order._id.length - 8).toUpperCase()}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                                            <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)' }}>{order.user?.name || 'Guest User'}</div>
                                            <span style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: 'var(--text-muted)' }}>Customer</span>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{order.user?.email}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)', justifyContent: 'flex-end' }}>
                                            <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: getStatusColor(order.status) + '20', color: getStatusColor(order.status), padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.85rem' }}>
                                            {order.status === 'Delivered' ? <CheckCircle size={14} /> : <Truck size={14} />}
                                            {order.status}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items (The "From Farmer" part) */}
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Order Details & Sourcing</div>
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
                                                <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: '#e2e8f0' }}>
                                                    <img src={item.image || item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '700', fontSize: '1rem' }}>{item.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} x ₹{item.price}</div>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--primary-light)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sourced From</div>
                                                    <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{item.seller?.name || 'Estate Direct'}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.seller?.email}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer: Totals & Actions */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', remove: 'border-top', paddingTop: '0' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Total Transaction</div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--primary)' }}>₹{order.totalPrice.toLocaleString()}</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: '600', color: order.isPaid ? '#10b981' : (order.paymentMethod === 'COD' ? '#6366f1' : '#f59e0b'), display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {order.isPaid ? <CheckCircle size={12} /> : <CreditCard size={12} />}
                                            {order.isPaid ? 'Payment Verified' : (order.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Pending Payment')}
                                        </div>
                                    </div>

                                    {order.status === 'Cancelled' && (
                                        <div style={{ flex: 1, textAlign: 'center', margin: '0 2rem' }}>
                                            {order.cancellationReason && (
                                                <div style={{ fontSize: '0.85rem', color: '#ef4444', background: '#fee2e2', padding: '0.6rem 1rem', borderRadius: '8px', display: 'inline-block' }}>
                                                    <strong>Reason for Cancellation:</strong> {order.cancellationReason}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {order.status === 'Cancelled' && order.refundStatus === 'Processing' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: '800' }}>UPI FOR REFUND</div>
                                                <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>{order.upiId || 'Not Provided'}</div>
                                            </div>
                                            <button
                                                onClick={() => updateRefundStatus(order._id, 'Completed')}
                                                className="btn btn-primary"
                                                style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', fontSize: '0.9rem', background: '#10b981', borderColor: '#10b981' }}
                                            >
                                                Mark Refund Completed
                                            </button>
                                        </div>
                                    ) : !order.isDelivered && order.status !== 'Cancelled' ? (
                                        <button
                                            onClick={() => markDelivered(order._id)}
                                            className="btn btn-primary"
                                            style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', fontSize: '0.9rem' }}
                                        >
                                            Mark Delivered
                                        </button>
                                    ) : (
                                        <div style={{ padding: '0.8rem 1.5rem', background: order.status === 'Cancelled' ? '#fee2e2' : '#ecfdf5', color: order.status === 'Cancelled' ? '#ef4444' : '#047857', borderRadius: '12px', fontWeight: '800', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {order.status === 'Cancelled' ? (
                                                <>
                                                    <AlertCircle size={16} />
                                                    {order.refundStatus === 'Completed' ? 'Refund Processed' : 'Order Cancelled'}
                                                </>
                                            ) : (
                                                <><CheckCircle size={16} /> Fulfillment Complete</>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageOrders;
