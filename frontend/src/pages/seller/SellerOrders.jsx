import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Package, CheckCircle, Clock, Truck, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PageHeader = ({ eyebrow, title, subtitle, extra }) => (
    <div style={{
        background: 'var(--soil)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")',
        backgroundBlendMode: 'multiply',
        borderBottom: '3px solid var(--border-dk)',
        padding: '3rem 0 2.5rem', marginBottom: '4rem'
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

const getStatusStyle = (status) => {
    const map = {
        Delivered: { bg: 'rgba(90,122,75,0.12)', color: 'var(--sage)', border: 'rgba(90,122,75,0.3)', icon: <CheckCircle size={13} /> },
        Shipped: { bg: 'rgba(200,147,26,0.12)', color: 'var(--gold)', border: 'rgba(200,147,26,0.3)', icon: <Truck size={13} /> },
        Processing: { bg: 'rgba(200,147,26,0.1)', color: '#B8860B', border: 'rgba(200,147,26,0.2)', icon: <Package size={13} /> },
        Confirmed: { bg: 'rgba(90,122,75,0.08)', color: 'var(--sage)', border: 'rgba(90,122,75,0.2)', icon: <CheckCircle size={13} /> },
        Cancelled: { bg: 'rgba(193,68,14,0.12)', color: 'var(--rust)', border: 'rgba(193,68,14,0.3)', icon: <AlertCircle size={13} /> },
        Pending: { bg: 'rgba(61,43,31,0.08)', color: 'var(--soil)', border: 'rgba(61,43,31,0.2)', icon: <Clock size={13} /> }
    };
    return map[status] || map.Pending;
};

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
            setOrders(data.data || []);
        } catch (error) {
            console.error(error);
            toast.error('Failed to sync orders');
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

    return (
        <div style={{
            background: 'var(--parchment)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
            minHeight: '100vh',
            paddingTop: '80px',
            paddingBottom: '6rem'
        }}>
            <PageHeader
                eyebrow="Farmer · Dispatch Center"
                title="Logistics & Dispatch"
                subtitle="Manage incoming harvest requests, coordinate shipping, and finalize sales."
                extra={
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <Link to="/seller/dashboard" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.3rem', fontSize: '0.8rem' }}>
                            <ArrowLeft size={15} /> Dashboard
                        </Link>
                        <button onClick={fetchOrders} className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.3rem', fontSize: '0.8rem' }}>
                            <RefreshCw size={15} /> Sync
                        </button>
                    </div>
                }
            />

            <div className="container" style={{ maxWidth: '1100px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div className="loader" style={{ margin: '0 auto 1.5rem' }} />
                        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)' }}>Cultivating your dispatch orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--cream)' }}>
                        <div style={{ width: '90px', height: '90px', background: 'var(--parchment-dk)', border: '1.5px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '3px 3px 0px var(--border)', color: 'var(--text-muted)' }}>
                            <ShoppingBag size={44} strokeWidth={1.5} />
                        </div>
                        <h2 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--soil)', fontWeight: '400', marginBottom: '1rem' }}>No orders in your bin yet</h2>
                        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto', lineHeight: '1.7' }}>
                            They'll appear here as soon as customers buy your produce. Keep your listings active and fresh!
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.8rem' }}>
                        {orders.map((order, i) => {
                            const ss = getStatusStyle(order.status);
                            return (
                                <div key={order._id} className="glass-card reveal-up active" style={{
                                    padding: '2rem', background: 'var(--cream)',
                                    display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.2fr',
                                    gap: '2.5rem', alignItems: 'center',
                                    transitionDelay: `${i * 0.05}s`
                                }}>
                                    {/* Order Info */}
                                    <div>
                                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Order ID</span>
                                        <div style={{ fontFamily: "'IM Fell English SC', serif", fontSize: '1.25rem', color: 'var(--soil)', marginTop: '0.15rem' }}>#{order._id.substr(-8).toUpperCase()}</div>
                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.4rem' }}>
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>

                                    {/* Customer / Items Info */}
                                    <div>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                            <div style={{
                                                width: '42px', height: '42px', background: 'var(--soil)',
                                                color: 'var(--parchment)', borderRadius: '4px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontFamily: "'IM Fell English SC', serif", fontSize: '1.1rem',
                                                boxShadow: '2px 2px 0px var(--soil-light)', flexShrink: 0
                                            }}>
                                                {order.user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div style={{ fontFamily: "'Lora', serif", fontWeight: '600', color: 'var(--soil)', fontSize: '0.95rem' }}>{order.user?.name || 'Customer'}</div>
                                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                    Ship to: {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} style={{
                                                    fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', fontWeight: '700',
                                                    padding: '0.2rem 0.6rem', background: 'var(--parchment)',
                                                    border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--soil)'
                                                }}>
                                                    {item.quantity}x {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem' }}>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                            padding: '0.3rem 0.8rem', background: ss.bg, color: ss.color,
                                            border: `1.5px solid ${ss.border}`, borderRadius: '3px',
                                            fontFamily: "'Outfit', sans-serif", fontWeight: '700',
                                            fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase'
                                        }}>
                                            {ss.icon}
                                            {order.status}
                                        </span>

                                        {order.trackingNumber && (
                                            <div style={{
                                                fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem',
                                                fontWeight: '600', color: 'var(--text-muted)',
                                                background: 'var(--parchment-dkr)', border: '1px solid var(--border)',
                                                padding: '0.15rem 0.5rem', borderRadius: '2px'
                                            }}>
                                                Ref: {order.trackingNumber}
                                            </div>
                                        )}

                                        {order.status === 'Cancelled' && order.cancellationReason && (
                                            <div style={{
                                                fontFamily: "'Lora', serif", fontStyle: 'italic',
                                                fontSize: '0.75rem', color: 'var(--rust)', textAlign: 'right',
                                                background: 'rgba(193,68,14,0.06)', border: '1px solid rgba(193,68,14,0.2)',
                                                padding: '0.4rem 0.8rem', borderRadius: '4px', maxWidth: '200px'
                                            }}>
                                                <strong>Reason:</strong> {order.cancellationReason}
                                            </div>
                                        )}

                                        {order.status === 'Cancelled' && order.refundStatus === 'Processing' ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: '700', color: 'var(--rust)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>UPI FOR REFUND</div>
                                                <div style={{ fontFamily: "'Lora', serif", fontWeight: '600', fontSize: '0.88rem', color: 'var(--soil)' }}>{order.upiId || 'Not Provided'}</div>
                                                <button
                                                    onClick={() => updateRefundStatus(order._id, 'Completed')}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}
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
                                                    style={{
                                                        padding: '0.45rem 1.8rem 0.45rem 0.75rem',
                                                        background: 'var(--parchment-dk)',
                                                        border: '1.5px solid var(--border)', borderRadius: '4px',
                                                        fontFamily: "'Outfit', sans-serif", fontWeight: '700',
                                                        fontSize: '0.75rem', color: 'var(--soil)', outline: 'none',
                                                        cursor: 'pointer', appearance: 'none',
                                                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%233D2B1F\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                                                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center',
                                                        backgroundSize: '1em', boxShadow: '2px 2px 0px var(--border)'
                                                    }}
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
                                            <div style={{
                                                fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', fontWeight: '800',
                                                color: order.refundStatus === 'Completed' ? 'var(--sage)' : 'var(--gold)',
                                                letterSpacing: '0.08em', marginTop: '2px'
                                            }}>
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
