import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Package, CheckCircle, Clock, Truck, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/orders');
            setOrders(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status, trackingNumber) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { status, trackingNumber });
            toast.success(`Order status updated to ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return { bg: '#fff7ed', text: '#9a3412', icon: <Clock size={14} /> };
            case 'Confirmed': return { bg: '#ecfdf5', text: '#065f46', icon: <CheckCircle size={14} /> };
            case 'Processing': return { bg: '#eff6ff', text: '#1e40af', icon: <Package size={14} /> };
            case 'Shipped': return { bg: '#fdf4ff', text: '#86198f', icon: <Truck size={14} /> };
            case 'Out for Delivery': return { bg: '#fefce8', text: '#854d0e', icon: <Truck size={14} /> };
            case 'Delivered': return { bg: '#f0fdf4', text: '#166534', icon: <CheckCircle size={14} /> };
            case 'Cancelled': return { bg: '#fee2e2', text: '#ef4444', icon: <Clock size={14} /> };
            default: return { bg: '#f1f5f9', text: '#475569', icon: <Clock size={14} /> };
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '8rem 0 4rem 0' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Dispatch Center</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage incoming harvest requests</p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>Cultivating your orders...</div>
                ) : orders.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '5rem' }}>
                        <ShoppingBag size={48} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                        <h3>No orders in your bin yet</h3>
                        <p style={{ color: 'var(--text-muted)' }}>They'll appear here as soon as customers buy your produce.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {orders.map(order => {
                            const statusStyle = getStatusStyle(order.status);
                            return (
                                <div key={order._id} className="card animate-fade" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '2rem', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Order ID</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '800' }}>#{order._id.substr(-8)}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                                                {order.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700' }}>{order.user?.name || 'Customer'}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', background: '#f1f5f9', borderRadius: '0.5rem' }}>
                                                    {item.quantity}x {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem',
                                            borderRadius: 'var(--radius-full)', background: statusStyle.bg, color: statusStyle.text,
                                            fontSize: '0.85rem', fontWeight: '700'
                                        }}>
                                            {statusStyle.icon}
                                            {order.status}
                                        </div>

                                        {order.trackingNumber && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                                                Ref: {order.trackingNumber}
                                            </div>
                                        )}

                                        {order.status === 'Cancelled' && order.cancellationReason && (
                                            <div style={{ fontSize: '0.75rem', color: '#ef4444', textAlign: 'right', background: '#fee2e2', padding: '0.4rem 0.8rem', borderRadius: '0.5rem' }}>
                                                <strong>Reason:</strong> {order.cancellationReason}
                                            </div>
                                        )}
                                        {order.status === 'Cancelled' && order.refundStatus === 'Processing' ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                                <div style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: '800' }}>UPI FOR REFUND</div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>{order.upiId || 'Not Provided'}</div>
                                                <button
                                                    onClick={() => updateRefundStatus(order._id, 'Completed')}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.75rem', background: '#10b981', borderColor: '#10b981' }}
                                                >
                                                    Complete Refund
                                                </button>
                                            </div>
                                        ) : (
                                            order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => {
                                                        const newStatus = e.target.value;
                                                        let tNum = order.trackingNumber;
                                                        if ((newStatus === 'Shipped' || newStatus === 'Out for Delivery') && !tNum) {
                                                            tNum = window.prompt("Enter Courier Tracking Number (Optional):", "") || tNum;
                                                        }
                                                        updateStatus(order._id, newStatus, tNum);
                                                    }}
                                                    style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            )
                                        )}
                                        {order.refundStatus && order.refundStatus !== 'Not Applicable' && (
                                            <div style={{ fontSize: '0.7rem', color: order.refundStatus === 'Completed' ? '#10b981' : '#f59e0b', fontWeight: '800', marginTop: '4px' }}>
                                                REFUND: {order.refundStatus.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerOrders;
