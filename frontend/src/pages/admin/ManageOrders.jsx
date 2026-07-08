import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, Search, CreditCard, RefreshCw, AlertCircle, Calendar, User } from 'lucide-react';
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

const statusStyle = (status) => {
    const map = { Delivered: { bg: 'rgba(90,122,75,0.12)', color: 'var(--sage)', border: 'rgba(90,122,75,0.3)' }, Shipped: { bg: 'rgba(200,147,26,0.12)', color: 'var(--gold)', border: 'rgba(200,147,26,0.3)' }, Processing: { bg: 'rgba(200,147,26,0.1)', color: '#B8860B', border: 'rgba(200,147,26,0.2)' }, Cancelled: { bg: 'rgba(193,68,14,0.12)', color: 'var(--rust)', border: 'rgba(193,68,14,0.3)' }, Pending: { bg: 'rgba(61,43,31,0.08)', color: 'var(--soil)', border: 'rgba(61,43,31,0.2)' } };
    return map[status] || map.Pending;
};

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/orders');
            setOrders(data.data || []);
        } catch { toast.error('Could not fetch platform orders'); }
        finally { setLoading(false); }
    };

    const markDelivered = async (id) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { status: 'Delivered' });
            toast.success('Order marked as Delivered');
            fetchOrders();
        } catch { toast.error('Update failed'); }
    };

    const updateRefundStatus = async (id, refundStatus) => {
        try {
            await axios.put(`/api/orders/${id}/status`, { refundStatus });
            toast.success(`Refund: ${refundStatus}`);
            fetchOrders();
        } catch { toast.error('Refund update failed'); }
    };

    const filteredOrders = orders
        .filter(o => o._id.toLowerCase().includes(searchTerm.toLowerCase()) || (o.user?.name || 'Guest').toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div style={{ background: 'var(--parchment)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")', minHeight: '100vh', paddingTop: '80px', paddingBottom: '6rem' }}>
            <PageHeader
                eyebrow="Admin · Fulfillment Ledger"
                title="Platform Orders"
                subtitle="Global oversight of all transactions and fulfillment status."
                extra={
                    <button onClick={fetchOrders} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.3rem', fontSize: '0.8rem' }}>
                        <RefreshCw size={15} /> Sync
                    </button>
                }
            />
            <div className="container">
                {/* Search bar */}
                <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2.5rem', background: 'var(--cream)' }}>
                    <div style={{ position: 'relative', maxWidth: '480px' }}>
                        <Search size={16} strokeWidth={2} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text" placeholder="Search by Order ID or customer name…"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem',
                                background: 'var(--parchment-dk)', border: '1.5px solid var(--border)',
                                borderRadius: '4px', fontFamily: "'Lora', serif", fontSize: '0.88rem',
                                color: 'var(--soil)', outline: 'none', boxShadow: '2px 2px 0px var(--border)'
                            }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}><div className="loader" style={{ margin: '0 auto' }} /></div>
                ) : (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {filteredOrders.length === 0 ? (
                            <div className="glass-card" style={{ textAlign: 'center', padding: '5rem', background: 'var(--cream)', fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)' }}>No orders match your search.</div>
                        ) : filteredOrders.map((order, i) => {
                            const ss = statusStyle(order.status);
                            return (
                                <div key={order._id} className="glass-card reveal-up active" style={{ padding: 0, background: 'var(--cream)', overflow: 'hidden', transitionDelay: `${i * 0.04}s` }}>
                                    {/* Order header */}
                                    <div style={{ padding: '1.4rem 2rem', background: 'var(--parchment-dkr)', borderBottom: '1.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                                                Order #{order._id.substring(order._id.length - 8).toUpperCase()}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem' }}>
                                                <User size={14} color="var(--rust)" strokeWidth={2} />
                                                <span style={{ fontFamily: "'Lora', serif", fontWeight: '600', color: 'var(--soil)', fontSize: '1rem' }}>{order.user?.name || 'Guest User'}</span>
                                                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)' }}>{order.user?.email}</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                <Calendar size={13} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                            <span style={{ padding: '0.3rem 0.9rem', background: ss.bg, color: ss.color, border: `1.5px solid ${ss.border}`, borderRadius: '3px', fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1.5px solid var(--border)' }}>
                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '1rem' }}>Harvest Details</div>
                                        <div style={{ display: 'grid', gap: '0.8rem' }}>
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', padding: '0.8rem 1.2rem', background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                                                    <div style={{ width: '44px', height: '44px', borderRadius: '4px', overflow: 'hidden', background: 'var(--border)', flexShrink: 0, border: '1px solid var(--border)' }}>
                                                        <img src={item.image || item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.15)' }} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontFamily: "'Lora', serif", fontWeight: '600', color: 'var(--soil)', fontSize: '0.95rem' }}>{item.name}</div>
                                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '2px' }}>Qty: {item.quantity} × ₹{item.price}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--rust)', marginBottom: '2px' }}>Sourced From</div>
                                                        <div style={{ fontFamily: "'Lora', serif", fontWeight: '600', color: 'var(--soil)', fontSize: '0.88rem' }}>{item.seller?.name || 'Estate Direct'}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div style={{ padding: '1.4rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                                        <div>
                                            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Total Transaction</div>
                                            <div style={{ fontFamily: "'IM Fell English SC', serif", fontSize: '1.8rem', color: 'var(--soil)', lineHeight: '1' }}>₹{order.totalPrice.toLocaleString()}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.3rem', fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', fontWeight: '700', color: order.isPaid ? 'var(--sage)' : 'var(--text-muted)' }}>
                                                {order.isPaid ? <CheckCircle size={13} /> : <CreditCard size={13} />}
                                                {order.isPaid ? 'Payment Verified' : (order.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Pending Payment')}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div>
                                            {order.status === 'Cancelled' && order.refundStatus === 'Processing' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                    <div>
                                                        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', fontWeight: '700', color: 'var(--rust)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>UPI for Refund</div>
                                                        <div style={{ fontFamily: "'Lora', serif", fontWeight: '600', color: 'var(--soil)' }}>{order.upiId || 'Not Provided'}</div>
                                                    </div>
                                                    <button onClick={() => updateRefundStatus(order._id, 'Completed')} className="btn btn-primary" style={{ padding: '0.65rem 1.4rem', fontSize: '0.8rem' }}>
                                                        Mark Refund Done
                                                    </button>
                                                </div>
                                            ) : !order.isDelivered && order.status !== 'Cancelled' ? (
                                                <button onClick={() => markDelivered(order._id)} className="btn btn-primary" style={{ padding: '0.65rem 1.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Truck size={15} /> Mark Delivered
                                                </button>
                                            ) : (
                                                <div style={{ padding: '0.65rem 1.4rem', background: order.status === 'Cancelled' ? 'rgba(193,68,14,0.1)' : 'rgba(90,122,75,0.1)', color: order.status === 'Cancelled' ? 'var(--rust)' : 'var(--sage)', border: `1.5px solid ${order.status === 'Cancelled' ? 'rgba(193,68,14,0.3)' : 'rgba(90,122,75,0.3)'}`, borderRadius: '4px', fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                                    {order.status === 'Cancelled' ? <><AlertCircle size={14} /> {order.refundStatus === 'Completed' ? 'Refund Done' : 'Cancelled'}</> : <><CheckCircle size={14} /> Fulfilled</>}
                                                </div>
                                            )}
                                        </div>
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

export default ManageOrders;
