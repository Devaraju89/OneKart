import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CreditCard, Truck, ShieldCheck, MapPin, Phone, User, CheckCircle, Apple, Wallet, Banknote } from 'lucide-react';

const PlaceOrder = () => {
    const { cartItems, clearCart, cartTotal } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('India');
    const [mobile, setMobile] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Razorpay');
    const [processing, setProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState(0); // 0: Address, 1: Payment, 2: Success
    const [newOrderId, setNewOrderId] = useState('');
    const [paymentDetails, setPaymentDetails] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=placeorder');
        }
        if (cartItems.length === 0 && paymentStep !== 2) {
            navigate('/cart');
        }
    }, [user, cartItems, navigate, paymentStep]);

    const itemsPrice = Number(cartTotal || cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)).toFixed(2);
    const shippingPrice = (itemsPrice > 500 ? 0 : 50).toFixed(2);
    const taxPrice = (0.05 * itemsPrice).toFixed(2);
    const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    const handleNextStep = () => {
        if (!address || !city || !postalCode || !mobile) {
            toast.error("Please complete shipping details");
            return;
        }
        setPaymentStep(1);
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const placeOrderHandler = async () => {
        setProcessing(true);

        try {
            // 1. Create Pending Order in DB
            const orderPayload = {
                orderItems: cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    quantity: item.qty,
                    image: item.image_url,
                    price: item.price,
                    unit: item.unit || 'kg',
                    seller: item.seller._id || item.seller
                })),
                shippingAddress: { address, city, postalCode, country, mobile },
                paymentMethod,
                itemsPrice: Number(itemsPrice),
                shippingPrice: Number(shippingPrice),
                taxPrice: Number(taxPrice),
                totalPrice: Number(totalPrice),
            };

            const { data: orderData } = await axios.post('/api/orders', orderPayload);
            const dbOrderId = orderData.data._id;
            setNewOrderId(dbOrderId);

            // 2. Handle Razorpay Flow
            if (paymentMethod === 'Razorpay') {
                const isLoaded = await loadRazorpayScript();
                if (!isLoaded) {
                    toast.error('Razorpay SDK failed to load');
                    setProcessing(false);
                    return;
                }

                // Create Razorpay Order from Backend
                const { data: paymentData } = await axios.post('/api/payment/create-order', {
                    amount: totalPrice
                });

                if (paymentData.status !== 'success') {
                    throw new Error(paymentData.message);
                }

                const options = {
                    key: paymentData.key,
                    amount: paymentData.data.amount,
                    currency: paymentData.data.currency,
                    name: "OneKart Estate",
                    description: "Premium Harvest Acquisition",
                    // image: "https://your-domain.com/onekart-logo.png", // Replace with valid URL or comment out
                    order_id: paymentData.data.id,
                    handler: async function (response) {
                        try {
                            // Verify Signature
                            await axios.post('/api/payment/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            // Mark Order as Paid
                            await axios.put(`/api/orders/${dbOrderId}/pay`, {
                                id: response.razorpay_payment_id,
                                status: 'COMPLETED',
                                update_time: new Date().toISOString(),
                                email_address: user.email
                            });

                            toast.success('Payment Complete');
                            setPaymentDetails({
                                paymentId: response.razorpay_payment_id,
                                orderId: dbOrderId,
                                amount: totalPrice,
                                date: new Date().toLocaleString()
                            });
                            setProcessing(false);
                            setPaymentStep(2);
                            clearCart();

                        } catch (err) {
                            toast.error('Payment Verification Failed');
                            console.error(err);
                            setProcessing(false);
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: mobile
                    },
                    theme: {
                        color: "#10b981"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    toast.error(response.error.description);
                    setProcessing(false);
                });
                console.log('Opening Razorpay Modal...');
                rzp1.open();

            } else {
                // COD Flow
                setTimeout(() => {
                    setProcessing(false);
                    setPaymentStep(2);
                    clearCart();
                }, 1500);
            }

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Transaction failed');
            setProcessing(false);
        }
    };

    if (paymentStep === 2) {
        return (
            <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
                <div style={{ width: '80px', height: '80px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', animation: 'scaleIn 0.5s ease' }}>
                    <CheckCircle size={40} color="#166534" />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                    {paymentMethod === 'COD' ? 'Order Confirmed!' : 'Payment Successful'}
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    {paymentMethod === 'COD' ? 'Your harvest request has been scheduled for delivery.' : 'Your payment has been verified and order confirmed.'}
                </p>

                {/* Payment Slip / Receipt */}
                {paymentDetails ? (
                    <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '400px', marginBottom: '2.5rem', border: '1px dashed #cbd5e1', background: '#fffbeb' }}>
                        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', color: '#854d0e' }}>Payment Receipt</h3>
                        <div style={{ display: 'grid', gap: '1rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Transaction ID</span>
                                <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{paymentDetails.paymentId}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Order Ref</span>
                                <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>#{paymentDetails.orderId.slice(-6).toUpperCase()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Date</span>
                                <span>{paymentDetails.date}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Method</span>
                                <span>Razorpay Secure</span>
                            </div>
                            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total Paid</span>
                                <span style={{ fontWeight: '800', fontSize: '1.4rem', color: '#166534' }}>₹{paymentDetails.amount}</span>
                            </div>
                        </div>
                    </div>
                ) : paymentMethod === 'COD' && (
                    <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '400px', marginBottom: '2.5rem', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', color: '#475569' }}>Order Summary</h3>
                        <div style={{ display: 'grid', gap: '1rem', textAlign: 'left', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Order Ref</span>
                                <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>#{newOrderId.slice(-6).toUpperCase()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Payment Mode</span>
                                <span style={{ fontWeight: '700' }}>Cash on Delivery</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Status</span>
                                <span style={{ color: '#f59e0b', fontWeight: '800' }}>Pay on Arrival</span>
                            </div>
                            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total Amount</span>
                                <span style={{ fontWeight: '800', fontSize: '1.4rem', color: '#0f172a' }}>₹{totalPrice}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => navigate(`/track-order?id=${newOrderId}`)} className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Track Order</button>
                    <button onClick={() => navigate('/myorders')} className="btn btn-secondary" style={{ padding: '0.8rem 2rem' }}>My Orders</button>
                </div>
            </div>
        );
    }

    if (processing) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                <div className="payment-loader"></div>
                <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '3rem' }}>
                    {paymentMethod === 'COD' ? 'Finalizing Your Order...' : 'Securing Transaction...'}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    {paymentMethod === 'COD' ? 'Preparing your harvest acquisition request' : `Authenticating via ${paymentMethod} Secure Gateway`}
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', opacity: 0.5 }}>
                    <ShieldCheck size={20} /> <Wallet size={20} /> <CreditCard size={20} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>

                {/* Progress Bar */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', background: paymentStep >= 0 ? 'var(--primary)' : '#e2e8f0', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>1</div>
                            <span style={{ fontWeight: '700', color: paymentStep >= 0 ? 'var(--text-main)' : '#94a3b8' }}>Shipping</span>
                        </div>
                        <div style={{ width: '60px', height: '2px', background: paymentStep >= 1 ? 'var(--primary)' : '#e2e8f0' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', background: paymentStep >= 1 ? 'var(--primary)' : '#e2e8f0', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>2</div>
                            <span style={{ fontWeight: '700', color: paymentStep >= 1 ? 'var(--text-main)' : '#94a3b8' }}>Payment</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }}>

                    {/* LEFT SIDE */}
                    <div>
                        {paymentStep === 0 ? (
                            <div className="card animate-fade" style={{ padding: '3rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                    <div style={{ width: '44px', height: '44px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={24} />
                                    </div>
                                    <h2 style={{ fontSize: '1.6rem' }}>Delivery Address</h2>
                                </div>

                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.6rem', color: 'var(--text-muted)' }}>Street Address</label>
                                        <textarea
                                            value={address} onChange={(e) => setAddress(e.target.value)} required
                                            placeholder="House No, Landmark, Area..."
                                            style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', minHeight: '100px', fontSize: '1rem' }}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.6rem', color: 'var(--text-muted)' }}>City</label>
                                            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Hyderabad" style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.6rem', color: 'var(--text-muted)' }}>PIN Code</label>
                                            <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="6-digit PIN" style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.6rem', color: 'var(--text-muted)' }}>Contact Mobile</label>
                                        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="10-digit primary number" style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '1rem' }} />
                                    </div>
                                    <button onClick={handleNextStep} className="btn btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem' }}>Continue to Payment</button>
                                </div>
                            </div>
                        ) : (
                            <div className="card animate-fade" style={{ padding: '3rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '44px', height: '44px', background: '#e0e7ff', color: '#6366f1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CreditCard size={24} />
                                        </div>
                                        <h2 style={{ fontSize: '1.6rem' }}>Payment System</h2>
                                    </div>
                                    <button onClick={() => setPaymentStep(0)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>Edit Shipping</button>
                                </div>

                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <div
                                        onClick={() => setPaymentMethod('Razorpay')}
                                        style={{
                                            padding: '1.5rem', borderRadius: '1.2rem', border: '2.5px solid',
                                            borderColor: paymentMethod === 'Razorpay' ? '#3399cc' : '#f1f5f9',
                                            background: paymentMethod === 'Razorpay' ? '#f0f9ff' : 'white',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {paymentMethod === 'Razorpay' && <div style={{ width: '10px', height: '10px', background: '#3399cc', borderRadius: '50%' }}></div>}
                                            </div>
                                            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Razorpay Secure</span>
                                        </div>
                                        <ShieldCheck size={24} color="#3399cc" />
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('PayPal')}
                                        style={{
                                            padding: '1.5rem', borderRadius: '1.2rem', border: '2.5px solid',
                                            borderColor: paymentMethod === 'PayPal' ? '#0070ba' : '#f1f5f9',
                                            background: paymentMethod === 'PayPal' ? '#f0f9ff' : 'white',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {paymentMethod === 'PayPal' && <div style={{ width: '10px', height: '10px', background: '#0070ba', borderRadius: '50%' }}></div>}
                                            </div>
                                            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>PayPal Express</span>
                                        </div>
                                        <h3 style={{ fontStyle: 'italic', color: '#0070ba', margin: 0 }}>PayPal</h3>
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('PhonePe')}
                                        style={{
                                            padding: '1.5rem', borderRadius: '1.2rem', border: '2.5px solid',
                                            borderColor: paymentMethod === 'PhonePe' ? '#6739b7' : '#f1f5f9',
                                            background: paymentMethod === 'PhonePe' ? '#f5f3ff' : 'white',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {paymentMethod === 'PhonePe' && <div style={{ width: '10px', height: '10px', background: '#6739b7', borderRadius: '50%' }}></div>}
                                            </div>
                                            <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>PhonePe / UPI</span>
                                        </div>
                                        <Wallet size={24} color="#6739b7" />
                                    </div>

                                    <div
                                        onClick={() => setPaymentMethod('COD')}
                                        style={{
                                            padding: '1.5rem', borderRadius: '1.2rem', border: '2.5px solid',
                                            borderColor: paymentMethod === 'COD' ? 'var(--primary)' : '#f1f5f9',
                                            background: paymentMethod === 'COD' ? 'var(--primary-light)' : 'white',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.2rem'
                                        }}
                                    >
                                        <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {paymentMethod === 'COD' && <div style={{ width: '10px', height: '10px', background: 'var(--primary)', borderRadius: '50%' }}></div>}
                                        </div>
                                        <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Cash on Delivery</span>
                                        <Banknote size={24} color="var(--primary)" style={{ marginLeft: 'auto' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE (Summary) */}
                    <div style={{ position: 'sticky', top: '7.5rem' }}>
                        <div className="card" style={{ padding: '2.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Order Basket</h2>

                            <div style={{ display: 'grid', gap: '1.2rem', marginBottom: '2.5rem' }}>
                                {cartItems.map(item => (
                                    <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.5rem 0' }}>
                                        <div style={{ position: 'relative' }}>
                                            <img src={item.image_url} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #f1f5f9' }} alt="" />
                                            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800', border: '2px solid white' }}>{item.qty}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>{item.name}</div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                                                <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>₹{item.price}</span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>/ {item.unit || 'kg'}</span>
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>₹{(item.price * item.qty).toFixed(1)}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gap: '1rem', padding: '1.5rem 0', borderTop: '2px dashed #f1f5f9', borderBottom: '2px dashed #f1f5f9', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Harvest Subtotal</span>
                                    <span style={{ fontWeight: '600' }}>₹{itemsPrice}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Eco-Friendly Shipping</span>
                                    <span style={{ fontWeight: '600', color: shippingPrice === 0 ? 'var(--primary)' : 'inherit' }}>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span>Mandatory GST (5%)</span>
                                    <span style={{ fontWeight: '600' }}>₹{taxPrice}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontSize: '1.8rem', fontWeight: '900', marginTop: '1rem' }}>
                                    <span>Total Amount</span>
                                    <span className="text-gradient">₹{totalPrice}</span>
                                </div>
                            </div>

                            {paymentStep === 1 && (
                                <button
                                    onClick={placeOrderHandler}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '1.4rem', fontSize: '1.2rem', borderRadius: '1.5rem', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                                >
                                    {paymentMethod === 'COD' ? 'Confirm Delivery' : `Pay via ${paymentMethod} (UPI, QR, Cards)`}
                                </button>
                            )}

                            {paymentStep === 0 && (
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.85rem' }}>
                                    Complete shipping info to activate payment.
                                </div>
                            )}

                            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', opacity: 0.7, justifyContent: 'center' }}>
                                <ShieldCheck size={20} color="var(--primary)" />
                                <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>Verified Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
