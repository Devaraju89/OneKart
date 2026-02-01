import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '8rem 0 8rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Your Selection</h1>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        <ArrowLeft size={20} /> Continue Shopping
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white' }}>
                        <div style={{
                            width: '100px', height: '100px', background: '#f1f5f9', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem'
                        }}>
                            <ShoppingBag size={48} color="#94a3b8" />
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>Your basket is empty</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '400px', margin: '0 auto 2.5rem' }}>
                            Looks like you haven't added any fresh produce yet. Our farmers are ready when you are!
                        </p>
                        <Link to="/" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>Explore Marketplace</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
                        {/* Items List */}
                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                            {cartItems.map(item => (
                                <div key={item._id} className="card animate-fade" style={{
                                    display: 'grid', gridTemplateColumns: '120px 1fr 150px',
                                    gap: '1.5rem', padding: '1.2rem', alignItems: 'center'
                                }}>
                                    <div style={{ width: '120px', height: '120px', borderRadius: '1rem', overflow: 'hidden' }}>
                                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>

                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', marginBottom: '0.2rem' }}>{item.category || 'Fresh'}</div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{item.name}</h3>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                            <span style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--primary)' }}>₹{item.price}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>/ {item.unit || 'kg'}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '0.8rem', padding: '0.4rem' }}>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                style={{ padding: '0.4rem', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span style={{ padding: '0 1rem', fontWeight: '700', fontSize: '1rem' }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                style={{ padding: '0.4rem', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', fontWeight: '600' }}
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Sidebar */}
                        <div className="card" style={{ position: 'sticky', top: '8rem', padding: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Order Summary</h3>

                            <div style={{ display: 'grid', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{cartTotal}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                    <span>Shipping</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>FREE</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                    <span>Tax estimate</span>
                                    <span>₹0.00</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Total Amount</span>
                                <span style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1' }}>₹{cartTotal}</span>
                            </div>

                            <button
                                onClick={() => navigate('/place-order')}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '1.2rem', marginBottom: '1.5rem' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center' }}>
                                    Secure Checkout <ArrowRight size={22} />
                                </div>
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                                <ShieldCheck color="var(--primary)" size={24} />
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                    Your payment and data are encrypted with bank-level security.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
