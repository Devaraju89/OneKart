import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
            setOrderId(id);
            // We need to call checkStatus but checkStatus uses the e object or nothing
            const fetchOrderFromUrl = async () => {
                setLoading(true);
                setError(null);
                try {
                    const { data } = await axios.get(`/api/orders/${id}`);
                    setOrder(data.data);
                } catch (err) {
                    console.error(err);
                    setError("Order not found or access denied.");
                } finally {
                    setLoading(false);
                }
            };
            fetchOrderFromUrl();
        }
    }, []);

    const checkStatus = async (e) => {
        if (e) e.preventDefault();
        if (!orderId) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const { data } = await axios.get(`/api/orders/${orderId}`);
            setOrder(data.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                setError("Please login to track your orders.");
            } else if (err.response?.status === 404) {
                setError("Order ID not found. Ensure it's correct.");
            } else {
                setError("Something went wrong. Please check again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 'Pending', label: 'Ordered', icon: <Clock size={24} /> },
        { id: 'Confirmed', label: 'Confirmed', icon: <ShieldCheck size={24} /> },
        { id: 'Processing', label: 'Harvesting', icon: <Package size={24} /> },
        { id: 'Shipped', label: 'Shipped', icon: <Truck size={24} /> },
        { id: 'Out for Delivery', label: 'On Way', icon: <MapPin size={24} /> },
        { id: 'Delivered', label: 'Arrived', icon: <CheckCircle size={24} /> }
    ];

    const currentStepIndex = steps.findIndex(s => s.id === (order?.status || 'Pending'));
    // If status is not found in steps (e.g. Processing vs Harvesting), try to map it or default
    const getSafeIndex = () => {
        const statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
        const idx = statuses.indexOf(order?.status || 'Pending');
        return idx === -1 ? 0 : idx;
    };
    const safeIndex = getSafeIndex();

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', letterSpacing: '-0.05em', marginBottom: '1rem' }}>Where's my harvest?</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Track your fresh produce from the soil to your doorstep.</p>
                </div>

                {/* Order ID Input Removed per USER request - Flow is now exclusively via 'Track' links */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="loader" style={{ margin: 'auto' }}></div>
                        <p style={{ marginTop: '2rem', color: 'var(--text-muted)', fontWeight: '800' }}>Locating your harvest...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{ color: '#dc2626', marginBottom: '1.5rem', fontWeight: '800' }}>{error}</div>
                        <Link to="/myorders" className="btn btn-primary">Return to My Orders</Link>
                    </div>
                )}

                {order && (
                    <div className="animate-fade">
                        <div className="card" style={{ padding: '3rem', marginBottom: '2rem' }}>
                            {/* Tracking Bar / Cancellation Alert */}
                            {order.status === 'Cancelled' ? (
                                <div style={{
                                    background: '#fee2e2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '1.2rem',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    marginBottom: '3rem'
                                }}>
                                    <div style={{ color: '#ef4444', fontWeight: '900', fontSize: '1.5rem', marginBottom: '0.5rem' }}>ORDER TERMINATED</div>
                                    <p style={{ color: '#b91c1c', fontSize: '0.95rem' }}>
                                        {order.paymentMethod === 'COD'
                                            ? 'This order was cancelled by your request. No further action is needed.'
                                            : `This order was cancelled. Your refund is being processed to ${order.upiId || 'your provided account'}.`}
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '4rem' }}>
                                    {/* Track Line */}
                                    <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', height: '4px', background: '#e2e8f0', zIndex: 1 }}></div>
                                    <div style={{ position: 'absolute', top: '24px', left: '0', width: `${(safeIndex / (steps.length - 1)) * 100}%`, height: '4px', background: 'var(--primary)', zIndex: 2, transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>

                                    {steps.map((step, index) => {
                                        const isActive = index <= safeIndex;
                                        const isCurrent = index === safeIndex;

                                        return (
                                            <div key={step.id} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                                <div style={{
                                                    width: '50px', height: '50px', borderRadius: '50%',
                                                    background: isActive ? 'var(--primary)' : 'white',
                                                    border: isActive ? '4px solid white' : '4px solid #e2e8f0',
                                                    color: isActive ? 'white' : '#cbd5e1',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    boxShadow: isCurrent ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
                                                    transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                                                    transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                                }}>
                                                    {step.icon || <Package size={24} />}
                                                </div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: isActive ? 'var(--text-main)' : '#cbd5e1', whiteSpace: 'nowrap' }}>
                                                    {step.label}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '3rem' }}>
                                <div>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Order Information</h4>
                                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: '500' }}>Status:</span>
                                            <span style={{ fontWeight: '800', color: order.status === 'Cancelled' ? '#ef4444' : 'var(--primary)' }}>{order.status}</span>
                                        </div>
                                        {order.status === 'Cancelled' && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: '500' }}>Refund Status:</span>
                                                <span style={{ fontWeight: '800', color: order.refundStatus === 'Completed' ? '#10b981' : '#f59e0b' }}>
                                                    {order.refundStatus}
                                                </span>
                                            </div>
                                        )}
                                        {order.trackingNumber && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: '500' }}>Courier Ref:</span>
                                                <span style={{ fontWeight: '800', fontFamily: 'monospace' }}>{order.trackingNumber}</span>
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: '500' }}>Ordered on:</span>
                                            <span>{new Date(order.createdAt).toDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontWeight: '500' }}>Payment:</span>
                                            <span style={{ fontWeight: '800', color: order.isPaid ? '#10b981' : (order.paymentMethod === 'COD' ? '#6366f1' : '#f59e0b') }}>
                                                {order.isPaid ? 'Completed' : (order.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Pending')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Destination</h4>
                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        <MapPin size={20} style={{ flexShrink: 0, color: 'var(--primary)' }} />
                                        <div style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                                            <strong>{order.user?.name}</strong><br />
                                            {order.shippingAddress?.address}<br />
                                            {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                                            {order.shippingAddress?.mobile}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Link to="/myorders" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                View All My Orders <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                )}

                {!order && !loading && (
                    <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Don't have your ID? You can find it in your email or your dashboard.</p>
                        <Link to="/myorders" style={{ fontWeight: '800', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            Go to My Orders <ExternalLink size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
