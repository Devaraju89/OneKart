import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { ArrowLeft, Star, Globe, Shield, Zap, ChevronRight, ArrowRight, MessageSquare, ShoppingBag, Mail, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();
    const { user } = useContext(AuthContext);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [msgSubject, setMsgSubject] = useState('');
    const [msgBody, setMsgBody] = useState('');
    const [isSendingMsg, setIsSendingMsg] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/products/${id}`);
            setProduct(data.data);

            // Enhanced Deep Discovery Logic
            if (data.data) {
                const allRes = await axios.get('/api/products');
                let pool = allRes.data.data.filter(p => p._id !== id);

                // Segment the pool for intelligent prioritization
                let sameCategory = pool.filter(p => p.category === data.data.category);
                let otherCategories = pool.filter(p => p.category !== data.data.category);

                // Shuffle both pools for frequent variety
                const shuffle = (array) => {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                    return array;
                };

                // Combine: Shuffled same-category first, then shuffled others
                let finalCandidates = [...shuffle(sameCategory), ...shuffle(otherCategories)];

                // Slice to exactly 8 (2 rows of 4)
                setRelatedProducts(finalCandidates.slice(0, 8));
            }
        } catch (error) {
            console.error(error);
            toast.error("Entry not found in archive");
            navigate('/marketplace');
        } finally {
            setLoading(false);
        }
    };

    const checkPurchaseStatus = async () => {
        if (!user) return;
        try {
            const { data } = await axios.get('/api/orders/myorders');
            const orders = data.data;
            const hasPurchased = orders.some(order =>
                (order.status === 'Delivered' || order.isDelivered) &&
                order.orderItems.some(item => (item.product?._id || item.product) === id || item._id === id)
            );
            setCanReview(hasPurchased);
        } catch (error) {
            console.error("Purchase verification failed:", error);
        }
    };

    useEffect(() => {
        if (product && user) {
            checkPurchaseStatus();
        }
    }, [product, user, id]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/products/${id}/reviews`, { rating, comment });
            toast.success('Report Logged Successfully');
            setComment('');
            fetchProduct();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Report failure');
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        setIsSendingMsg(true);
        try {
            await axios.post('/api/inquiries', {
                recipient: product.seller?._id || product.seller,
                recipientRole: 'farmer',
                product: product._id,
                subject: msgSubject || `Inquiry: ${product.name}`,
                message: msgBody
            });
            toast.success("Dossier dispatched to Estate");
            setShowMessageModal(false);
            setMsgBody('');
            setMsgSubject('');
        } catch (error) {
            toast.error("Dispatch failure");
        } finally {
            setIsSendingMsg(false);
        }
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#064E3B', borderRadius: '50%', animation: 'rotation 1s linear infinite' }}></div>
        </div>
    );

    if (!product) return null;

    const fallbackImg = "https://images.pexels.com/photos/1458691/pexels-photo-1458691.jpeg?auto=compress&cs=tinysrgb&w=1400";

    return (
        <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '10rem', position: 'relative' }}>
            <div className="grain-overlay" style={{ opacity: 0.02 }} />
            {/* 1. EDITORIAL HEADER */}
            <div className="container" style={{ paddingTop: '6rem', paddingBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.7rem', fontWeight: '800', letterSpacing: '0.15rem', color: 'var(--text-muted)' }}>
                        <Link to="/marketplace" style={{ color: 'var(--text-muted)', transition: 'color 0.3s' }}>ARCHIVE</Link>
                        <ChevronRight size={12} />
                        <Link to={`/marketplace?category=${product.category}`} style={{ color: 'var(--primary-light)', transition: 'color 0.3s' }}>{product.category || 'BATCH'}</Link>
                        <ChevronRight size={12} />
                        <Link to={`/product/${product._id}`} style={{ color: 'var(--primary)', fontWeight: '900', transition: 'color 0.3s' }}>{product.name.toUpperCase()}</Link>
                    </div>
                    {/* Dynamic Rating Summary */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.6rem 1.2rem', borderRadius: '100px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < Math.round(product.rating || 0) ? "#fbbf24" : "none"} color="#fbbf24" />
                            ))}
                        </div>
                        <span style={{ fontWeight: '800', fontSize: '0.85rem', color: 'var(--primary)' }}>{product.rating?.toFixed(1) || '0.0'}</span>
                        <div style={{ height: '12px', width: '1px', background: '#e2e8f0' }}></div>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>{product.reviews?.length || 0} REPORTS</span>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '5rem', alignItems: 'start' }}>

                    {/* Media Focus */}
                    <div className="hero-fade-in">
                        <div style={{ padding: '1.5rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '32px', boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden' }}>
                            <div className="grain-overlay" style={{ opacity: 0.03, backgroundSize: '100px' }} />
                            <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '20px', position: 'relative', zIndex: 1 }}>
                                <img
                                    src={product.image_url !== 'no-image.jpg' ? product.image_url : fallbackImg}
                                    alt={product.name}
                                    onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>

                        {/* Highlights Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
                            <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                <Globe size={20} color="var(--primary-light)" style={{ marginBottom: '1rem' }} />
                                <div style={{ fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Origin Traced</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Estate Direct</div>
                            </div>
                            <div style={{ background: 'var(--bg-main)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                <Shield size={20} color="var(--primary-light)" style={{ marginBottom: '1rem' }} />
                                <div style={{ fontSize: '0.6rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Verification</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Pure Organic</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Editorial */}
                    <div className="hero-fade-in">
                        <span style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: '800', letterSpacing: '0.3em', display: 'block', marginBottom: '1rem', textTransform: 'uppercase' }}>Verified Dossier</span>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.02em', marginBottom: '1.5rem', fontFamily: '"Playfair Display", serif', color: 'var(--primary)' }}>
                            {product.name}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                <span style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.03em' }}>₹{product.price}</span>
                                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: '700' }}>/ {product.unit || 'kg'}</span>
                            </div>
                            <div style={{ height: '30px', width: '1px', background: '#e2e8f0' }}></div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)' }}>{product.reviews?.length || 0} Authenticated Reports</div>
                        </div>

                        <div style={{ marginBottom: '4rem' }}>
                            <p style={{ fontSize: '1.15rem', color: 'var(--text-body)', lineHeight: '1.8' }}>
                                {product.description || "This curated extraction represents the highest tier of seasonal harvest. Each unit is soil-traced and hand-selected for ontological purity."}
                            </p>
                        </div>

                        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: '800', letterSpacing: '0.1rem', marginBottom: '0.4rem', textTransform: 'uppercase' }}>Consignment Source</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.8rem' }}>{product.seller?.name || 'Heritage Estate'}</div>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {user?.role !== 'admin' && (
                                            <>
                                                <button
                                                    onClick={() => setShowMessageModal(true)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        fontSize: '0.8rem',
                                                        color: 'white',
                                                        background: 'var(--primary)',
                                                        border: 'none',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '100px',
                                                        fontWeight: '700',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <MessageSquare size={14} /> Message Estate
                                                </button>
                                                {product.seller?.email && (
                                                    <a
                                                        href={`mailto:${product.seller.email}?subject=Inquiry about ${product.name}`}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            fontSize: '0.8rem',
                                                            color: 'var(--primary-light)',
                                                            textDecoration: 'none',
                                                            fontWeight: '700',
                                                            border: '1px solid var(--border)',
                                                            padding: '0.5rem 0.8rem',
                                                            borderRadius: '100px'
                                                        }}
                                                    >
                                                        <Mail size={14} />
                                                    </a>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div style={{ padding: '0.7rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <Shield size={20} color="var(--primary)" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {user?.role === 'admin' ? (
                                    <button
                                        onClick={() => navigate('/admin/products')}
                                        className="btn"
                                        style={{
                                            width: '100%',
                                            padding: '1.4rem',
                                            background: 'var(--primary)',
                                            color: 'white',
                                            borderRadius: '16px',
                                            fontWeight: '800',
                                            fontSize: '1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            boxShadow: '0 15px 35px rgba(22, 66, 60, 0.25)',
                                            border: 'none',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            gap: '0.8rem',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Shield size={20} fill="white" />
                                        Manage Inventory
                                    </button>
                                ) : user?.role === 'farmer' ? (
                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {user?.id === (product.seller?._id || product.seller) && (
                                            <button
                                                onClick={() => navigate(`/seller/edit-product/${product._id}`)}
                                                className="btn btn-primary"
                                                style={{ width: '100%', padding: '1.4rem', borderRadius: '16px' }}
                                            >
                                                Edit My Listing
                                            </button>
                                        )}
                                        <div style={{ padding: '1.2rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            Farmers are registered as Sellers and cannot purchase products.
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                addToCart(product);
                                                navigate('/place-order');
                                            }}
                                            disabled={product.quantity <= 0}
                                            className="btn"
                                            style={{
                                                width: '100%',
                                                padding: '1.4rem',
                                                background: product.quantity <= 0 ? '#e2e8f0' : 'var(--primary)',
                                                color: product.quantity <= 0 ? '#94a3b8' : 'white',
                                                borderRadius: '16px',
                                                fontWeight: '800',
                                                fontSize: '1rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.15em',
                                                boxShadow: product.quantity <= 0 ? 'none' : '0 15px 35px rgba(22, 66, 60, 0.25)',
                                                border: 'none',
                                                cursor: product.quantity <= 0 ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <Zap size={20} fill={product.quantity <= 0 ? '#94a3b8' : 'white'} />
                                            {product.quantity <= 0 ? 'Out of Stock' : 'Execute Buy Now'}
                                        </button>

                                        <button
                                            onClick={() => addToCart(product)}
                                            disabled={product.quantity <= 0}
                                            style={{
                                                width: '100%',
                                                padding: '1.2rem',
                                                background: 'white',
                                                color: product.quantity <= 0 ? '#cbd5e1' : 'var(--primary)',
                                                borderRadius: '12px',
                                                fontWeight: '800',
                                                fontSize: '0.9rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                border: product.quantity <= 0 ? '2px solid #e2e8f0' : '2px solid var(--primary)',
                                                cursor: product.quantity <= 0 ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.8rem'
                                            }}
                                        >
                                            <ShoppingBag size={18} />
                                            {product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </button>
                                    </>
                                )}
                            </div>

                            {product.quantity < 10 && product.quantity > 0 && (
                                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#dc2626', background: '#fef2f2', padding: '0.5rem', borderRadius: '8px' }}>
                                    CRITICAL ALLOCATION: ONLY {product.quantity} LEFT
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Feedback Section */}
                <div style={{ paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '3rem' }}>
                        <div className="hero-fade-in">
                            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', fontFamily: '"Playfair Display", serif', marginBottom: '1rem', color: 'var(--primary)' }}>Member Reports.</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                Authenticated reports from our global estate member network.
                            </p>

                            {canReview && !showForm && user?.id !== (product.seller?._id || product.seller) && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="btn-primary"
                                    style={{ padding: '0.75rem 2rem', fontSize: '0.85rem', borderRadius: '12px' }}
                                >
                                    Login New Report
                                </button>
                            )}

                            {user?.id === (product.seller?._id || product.seller) && (
                                <div style={{
                                    padding: '1.2rem',
                                    background: '#f0f9ff',
                                    border: '1px solid #bae6fd',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    color: '#0369a1',
                                    fontWeight: '600'
                                }}>
                                    As the seller, you can view reports but cannot provide feedback on your own harvest.
                                </div>
                            )}

                            {!canReview && user && user?.id !== (product.seller?._id || product.seller) && (
                                <div style={{
                                    padding: '1.2rem',
                                    background: '#fefce8',
                                    border: '1px solid #fef08a',
                                    borderRadius: '12px',
                                    fontSize: '0.8rem',
                                    color: '#854d0e',
                                    fontWeight: '600'
                                }}>
                                    Report authentication is exclusive to members with delivered consignments of this batch.
                                </div>
                            )}

                            {!user && (
                                <Link to="/login" className="btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.85rem', borderRadius: '12px' }}>
                                    Login to Report
                                </Link>
                            )}
                        </div>

                        <div>
                            {product.reviews?.length === 0 ? (
                                <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                                    No reports archived for this batch.
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    {product.reviews?.map((review) => (
                                        <div key={review._id} style={{
                                            padding: '2rem',
                                            background: 'white',
                                            borderRadius: '20px',
                                            border: '1px solid #eef2f3',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{review.name}</div>
                                                    <div style={{ fontSize: '0.6rem', color: 'var(--primary-light)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Certified Acquisition</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '2px' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} fill={i < review.rating ? "#fbbf24" : "none"} color="#fbbf24" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '0.95rem', color: 'var(--text-body)', lineHeight: '1.6' }}>"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Report Authentication Form - Hidden by default */}
                            {showForm && (
                                <div style={{ marginTop: '2rem', padding: '2.5rem', background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Log Report</h3>
                                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--primary-light)', fontWeight: '800', cursor: 'pointer' }}>Dismiss</button>
                                    </div>

                                    <form onSubmit={submitHandler}>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>METRIC SCORE</label>
                                            <select
                                                value={rating}
                                                onChange={(e) => setRating(e.target.value)}
                                                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white' }}
                                            >
                                                <option value="5">5 - Uncompromising</option>
                                                <option value="4">4 - Superior</option>
                                                <option value="3">3 - Standard</option>
                                                <option value="2">2 - Deficient</option>
                                                <option value="1">1 - Rejected</option>
                                            </select>
                                        </div>
                                        <div style={{ marginBottom: '2rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>DOSSIDER NARRATIVE</label>
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Document details..."
                                                style={{ width: '100%', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px', background: 'white', minHeight: '100px', fontSize: '0.95rem', outline: 'none', lineHeight: '1.6' }}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn-premium" style={{ width: '100%', padding: '1rem' }}>Submit Archeology</button>
                                    </form>
                                </div>
                            )}

                            {!user && !showForm && (
                                <div style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Login required to log reports.</p>
                                    <Link to="/login" style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '0.2em', color: 'var(--primary)', textTransform: 'uppercase' }}>Login</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Explorations */}
                {relatedProducts.length > 0 && (
                    <div style={{ marginTop: '4rem', padding: '3rem 0', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <span style={{ fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.3em', color: 'var(--primary-light)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Registry Exploration</span>
                            <h2 style={{ fontSize: '2.5rem' }}>Related Arrivals</h2>
                        </div>

                        <div className="product-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                            {relatedProducts.slice(0, 8).map(p => (
                                <Link to={`/product/${p._id}`} key={p._id} className="product-card hero-fade-in" style={{
                                    textDecoration: 'none',
                                    padding: '1.2rem',
                                    background: 'var(--bg-pure)',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(22, 66, 60, 0.05)',
                                    boxShadow: 'var(--shadow-sm)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'var(--transition)'
                                }}>
                                    <div style={{ height: '240px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.2rem' }}>
                                        <img
                                            src={p.image_url !== 'no-image.jpg' ? p.image_url : fallbackImg}
                                            alt={p.name}
                                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.6rem', color: 'var(--primary)', fontWeight: '800' }}>{p.name}</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                        <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--primary)' }}>₹{p.price}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', background: 'var(--accent)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{p.category}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {/* Message Modal */}
            {showMessageModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(22, 66, 60, 0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card hero-fade-in" style={{ width: '90%', maxWidth: '600px', padding: '3rem', background: 'white', borderRadius: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Communication Protocol</span>
                                <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontFamily: '"Playfair Display", serif' }}>Inquiry for {product.name}</h2>
                            </div>
                            <button onClick={() => setShowMessageModal(false)} style={{ background: 'var(--bg-main)', border: 'none', padding: '0.8rem', borderRadius: '50%', cursor: 'pointer' }}>
                                <X size={20} color="var(--primary)" />
                            </button>
                        </div>

                        <form onSubmit={sendMessage}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.1em', uppercase: 'true', marginBottom: '0.8rem' }}>Subject Reference</label>
                                <input
                                    type="text"
                                    value={msgSubject}
                                    onChange={(e) => setMsgSubject(e.target.value)}
                                    placeholder={`Inquiry: ${product.name}`}
                                    style={{ width: '100%', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.1em', uppercase: 'true', marginBottom: '0.8rem' }}>Draft Message</label>
                                <textarea
                                    required
                                    value={msgBody}
                                    onChange={(e) => setMsgBody(e.target.value)}
                                    placeholder="Compose your inquiry clearly for the estate owners..."
                                    style={{ width: '100%', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border)', background: '#f8fafc', fontSize: '1rem', outline: 'none', minHeight: '150px' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSendingMsg}
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '1.4rem', borderRadius: '16px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                            >
                                {isSendingMsg ? 'Dispatching...' : 'Dispatch to Estate'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
