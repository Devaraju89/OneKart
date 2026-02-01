import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Package, CheckCircle2, AlertCircle, Search, ChevronRight, Clock, Truck, Mail } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [upiId, setUpiId] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const { data } = await axios.get('/api/orders/myorders');
                setOrders(data.data);
            } catch (error) {
                console.error(error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, navigate]);

    const getStatusStyle = (status, isPaid) => {
        if (status === 'Cancelled') return { color: '#ef4444', bg: '#fee2e2', icon: <AlertCircle size={16} /> };
        if (status === 'Delivered') return { color: '#10b981', bg: '#d1fae5', icon: <CheckCircle2 size={16} /> };
        if (status === 'Out for Delivery') return { color: '#854d0e', bg: '#fefce8', icon: <Truck size={14} /> };
        if (status === 'Shipped') return { color: '#6366f1', bg: '#e0e7ff', icon: <Package size={16} /> };
        if (status === 'Confirmed') return { color: '#059669', bg: '#ecfdf5', icon: <CheckCircle2 size={16} /> };
        if (!isPaid && status === 'Pending') return { color: '#f59e0b', bg: '#fef3c7', icon: <AlertCircle size={16} /> };
        return { color: '#64748b', bg: '#f1f5f9', icon: <Clock size={16} /> };
    };

    const handleCancelClick = (order) => {
        setSelectedOrder(order);
        setShowCancelModal(true);
        setUpiId('');
        setCancelReason('');
    };

    const submitCancellation = async () => {
        if (!cancelReason) return toast.error("Please provide a reason for cancellation");
        if (selectedOrder.paymentMethod !== 'COD' && !upiId) return toast.error("Please provide your UPI ID for refund");

        setIsCancelling(true);
        try {
            await axios.put(`/api/orders/${selectedOrder._id}/cancel`, {
                reason: cancelReason,
                upiId: upiId
            });
            toast.success("Order cancelled successfully");
            setShowCancelModal(false);
            // Refresh orders
            const { data } = await axios.get('/api/orders/myorders');
            setOrders(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Cancellation failed");
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '8rem 0 4rem 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Your Harvest History</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Keep track of your fresh orders and seasonal favorites</p>
                    </div>
                    <Link to="/" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ShoppingBag size={18} /> Shop More
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>Gathering your history...</div>
                ) : orders.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                        <div style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <ShoppingBag size={40} color="#94a3b8" />
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>No orders yet</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Explore our marketplace and support local farmers today.</p>
                        <Link to="/" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {orders.map(order => {
                            const style = getStatusStyle(order.status, order.isPaid);
                            return (
                                <div key={order._id} className="card animate-fade" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '2rem', alignItems: 'center', width: '100%' }}>
                                        <div>
                                            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                                                <div style={{ width: '70px', height: '70px', borderRadius: '1.2rem', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, border: '1px solid #e2e8f0' }}>
                                                    <img src={order.orderItems[0].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Batch #{order._id.substr(-8).toUpperCase()}</div>
                                                    <div style={{ fontWeight: '800', fontSize: '1.1rem', margin: '0.2rem 0', color: 'var(--text-main)' }}>
                                                        {order.orderItems[0].name} ({order.orderItems[0].quantity} {order.orderItems[0].unit || 'kg'})
                                                        {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} items`}
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                                    {order.orderItems[0].seller?.email && (
                                                        <a
                                                            href={`mailto:${order.orderItems[0].seller.email}?subject=Inquiry about Batch #${order._id.substr(-8).toUpperCase()}`}
                                                            style={{ fontSize: '0.75rem', color: 'var(--primary-light)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.4rem' }}
                                                        >
                                                            <Mail size={12} /> Contact Seller
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Transaction</div>
                                            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text-main)' }}>₹{order.totalPrice.toLocaleString()}</div>
                                            <div style={{ fontSize: '0.75rem', color: order.isPaid ? '#10b981' : (order.paymentMethod === 'COD' ? '#6366f1' : '#f59e0b'), fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {order.isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                {order.isPaid ? 'PAYMENT VERIFIED' : (order.paymentMethod === 'COD' ? 'PAY ON DELIVERY' : 'AWAITING PAYMENT')}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Current Phase</div>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                padding: '0.4rem 0.8rem', borderRadius: '0.8rem',
                                                background: style.bg, color: style.color,
                                                fontSize: '0.85rem', fontWeight: '900', width: 'fit-content',
                                                boxShadow: 'var(--shadow-sm)'
                                            }}>
                                                {style.icon} {order.status.toUpperCase()}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', alignItems: 'center' }}>
                                            {order.refundStatus && order.refundStatus !== 'Not Applicable' && (
                                                <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800' }}>REFUND</div>
                                                    <div style={{ fontSize: '0.8rem', fontWeight: '800', color: order.refundStatus === 'Completed' ? '#10b981' : '#f59e0b' }}>
                                                        {order.refundStatus.toUpperCase()}
                                                    </div>
                                                </div>
                                            )}
                                            {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                                <button
                                                    onClick={() => handleCancelClick(order)}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.8rem 1.2rem', borderRadius: '1rem', fontSize: '0.85rem', color: '#ef4444', border: '1px solid #fee2e2' }}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <Link to={`/track-order?id=${order._id}`} className="btn btn-primary" style={{ padding: '0.8rem 1.8rem', borderRadius: '1rem', fontSize: '0.9rem', fontWeight: '800' }}>
                                                {order.status === 'Cancelled' ? 'View Details' : 'Real-time Track'}
                                            </Link>
                                            {order.status === 'Delivered' && (
                                                <Link
                                                    to={`/product/${order.orderItems[0].product || order.orderItems[0]._id}`}
                                                    className="btn btn-outline"
                                                    style={{ padding: '0.8rem 1.5rem', borderRadius: '1rem', fontSize: '0.85rem', color: 'var(--primary)', borderColor: 'var(--primary)', fontWeight: '700' }}
                                                >
                                                    Leave Feedback
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Live Progress Tracker */}
                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 1rem' }}>
                                            {/* Connecting Line */}
                                            <div style={{ position: 'absolute', top: '10px', left: '2rem', right: '2rem', height: '3px', background: '#f1f5f9', zIndex: 1 }}></div>
                                            <div style={{ position: 'absolute', top: '10px', left: '2rem', width: `${(['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].indexOf(order.status) / 5) * 100}%`, height: '3px', background: 'var(--primary)', zIndex: 2, transition: 'width 0.8s ease' }}></div>

                                            {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                                                const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
                                                const currentIdx = steps.indexOf(order.status);
                                                const isActive = idx <= currentIdx;
                                                return (
                                                    <div key={step} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{
                                                            width: '22px', height: '22px', borderRadius: '50%',
                                                            background: isActive ? 'var(--primary)' : 'white',
                                                            border: isActive ? '4px solid white' : '2px solid #f1f5f9',
                                                            boxShadow: isActive ? '0 0 0 2px var(--primary)' : 'none',
                                                            transition: 'all 0.3s ease'
                                                        }}></div>
                                                        <div style={{ fontSize: '0.65rem', fontWeight: '800', color: isActive ? 'var(--text-main)' : '#94a3b8', textTransform: 'uppercase' }}>{step === 'Pending' ? 'Ordered' : step === 'Processing' ? 'Harvesting' : step === 'Delivered' ? 'Arrived' : step}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Cancellation Modal */}
            {showCancelModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(15, 23, 42, 0.75)', zIndex: 1000, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'
                }}>
                    <div className="card animate-fade" style={{
                        width: '95%', maxWidth: '550px', padding: '3rem', position: 'relative',
                        background: '#ffffff', border: '3px solid #f1f5f9',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        borderRadius: '2rem'
                    }}>
                        <button
                            onClick={() => setShowCancelModal(false)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', color: '#64748b', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                        >
                            <AlertCircle size={20} style={{ transform: 'rotate(45deg)' }} />
                        </button>

                        <div style={{ marginBottom: '2.5rem' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0f172a', letterSpacing: '-0.02em' }}>Cancel Order</h2>
                            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.5' }}>
                                To help us improve, please specify the reason for cancelling your harvest request.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '1rem', color: '#475569', letterSpacing: '0.05em' }}>Reason for Cancellation</label>
                                <textarea
                                    placeholder="Tell us why you're cancelling..."
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '1.2rem', border: '2px solid #f1f5f9', minHeight: '120px', outline: 'none', fontSize: '1rem', background: '#f8fafc', transition: 'border-color 0.2s' }}
                                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                    onBlur={(e) => e.target.style.borderColor = '#f1f5f9'}
                                />
                            </div>

                            {selectedOrder?.paymentMethod !== 'COD' && (
                                <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '1.5rem', border: '2px solid #dcfce7' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem', color: '#166534' }}>Refund UPI ID</label>
                                    <input
                                        type="text"
                                        placeholder="username@okbank"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '2px solid #bbf7d0', outline: 'none', fontSize: '1rem', background: '#ffffff' }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.8rem', color: '#15803d', fontSize: '0.8rem', fontWeight: '600' }}>
                                        <CheckCircle2 size={14} /> Secured Refund Timeline: 24-48 Hours
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, padding: '1.2rem', borderRadius: '1.2rem', fontWeight: '700' }}
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={submitCancellation}
                                    className="btn btn-primary"
                                    style={{ flex: 1, padding: '1.2rem', background: '#ef4444', borderColor: '#ef4444', borderRadius: '1.2rem', fontWeight: '800', boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)' }}
                                    disabled={isCancelling}
                                >
                                    {isCancelling ? 'Processing...' : 'Confirm Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
