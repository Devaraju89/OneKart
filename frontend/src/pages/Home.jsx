import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, ShieldCheck, Truck, RefreshCcw, User } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bgIndex, setBgIndex] = useState(0);
    const { addToCart } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const heroImages = [
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000", // Fresh Harvest Basket
        "https://images.unsplash.com/photo-1488459739032-d6f82311468e?q=80&w=2000", // Farmer's Market
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2000", // Organic Heirloom Tomatoes
        "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=2000", // Greenhouse Produce
        "https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=2000", // Fresh Fruit Collection
        "https://images.unsplash.com/photo-1464960320293-d785f877e8a2?q=80&w=2000", // Seasonal Berries
        "https://images.unsplash.com/photo-1550583724-125581fe2f8a?q=80&w=2000", // Dairy Farm Fresh
        "https://images.unsplash.com/photo-1523348830342-d01f9ec9d23f?q=80&w=2000", // Vegetable Rows
        "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=2000", // Gardening Mastery
        "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=2000"  // Liquid Gold Honey
    ];

    useEffect(() => {
        fetchProducts();

        // Background interval
        const bgTimer = setInterval(() => {
            setBgIndex(prev => (prev + 1) % heroImages.length);
        }, 3000);

        return () => {
            clearInterval(bgTimer);
        };
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products'); // Fetch all to allow daily rotation

            // Deterministic Daily Shuffle Logic
            // Uses the current date as a seed to ensure products stay the same for the day but change daily
            const today = new Date().toISOString().split('T')[0];
            const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            let pool = [...data.data];

            // Truly random shuffle on every refresh for discovery
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }

            // Slice to show a curated 'Discovery Batch' of 6 products (2 rows of 3)
            setProducts(pool.slice(0, 6));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fallbackImg = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800";

    return (
        <div style={{ background: 'var(--bg-pure)' }}>
            {/* Cinematic Dynamic Hero */}
            <section style={{
                position: 'relative',
                marginTop: 0,
                color: 'var(--creamy)',
                textAlign: 'center',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                {/* Carousel Background Layers */}
                {heroImages.map((img, idx) => (
                    <div
                        key={idx}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `linear-gradient(rgba(22, 66, 60, 0.8), rgba(22, 66, 60, 0.4)), url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: bgIndex === idx ? 1 : 0,
                            transition: 'opacity 1.5s ease-in-out',
                            zIndex: 1
                        }}
                    />
                ))}

                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="hero-fade-in">
                        <span style={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.6em',
                            fontSize: '0.9rem',
                            fontWeight: '800',
                            display: 'block',
                            marginBottom: '2rem',
                            color: 'var(--primary-light)'
                        }}>Since 2024 • Organic Estate</span>

                        <h1 style={{
                            fontSize: 'clamp(4rem, 8vw, 6.5rem)',
                            fontWeight: '800',
                            marginBottom: '2rem',
                            fontFamily: "'Playfair Display', serif",
                            lineHeight: '1.05',
                            letterSpacing: '-0.03em'
                        }}>
                            Harvested for<br />the Connoisseur.
                        </h1>

                        <p style={{
                            fontSize: '1.35rem',
                            marginBottom: '4rem',
                            opacity: 0.9,
                            maxWidth: '750px',
                            margin: '0 auto 4rem',
                            lineHeight: '1.9',
                            fontWeight: '400'
                        }}>
                            Discover a curated collection of the world's finest seasonal yields,
                            sourced directly from prestigious estates and delivered to your doorstep.
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                            <button onClick={() => navigate('/marketplace')} className="btn btn-primary" style={{ padding: '1.25rem 4rem', fontSize: '1rem' }}>
                                The Collection <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="btn btn-outline"
                                style={{
                                    padding: '1.25rem 4rem',
                                    fontSize: '1rem',
                                    borderColor: 'var(--creamy)',
                                    color: 'var(--creamy)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                Be a Partner
                            </button>
                        </div>
                    </div>
                </div>
                {/* Visual Accent */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '20vh', background: 'linear-gradient(to top, var(--bg-main), transparent)', zIndex: 5 }}></div>
            </section>

            {/* Products Showcase */}
            <section style={{ padding: '10rem 0', background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(22, 66, 60, 0.05)', borderBottom: '1px solid rgba(22, 66, 60, 0.05)', position: 'relative', overflow: 'hidden' }}>
                <div className="grain-overlay" style={{ opacity: 0.05 }} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: '6rem',
                        borderBottom: '1px solid rgba(250, 250, 238, 0.1)',
                        paddingBottom: '2.5rem'
                    }} className="reveal-up">
                        <div>
                            <h2 style={{ fontSize: '3.5rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em', color: 'var(--primary)' }}>Seasonal Showcase</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem', opacity: 0.9 }}>Reserve your share of this month's exceptional harvests.</p>
                        </div>
                        <Link to="/marketplace" className="btn-outline" style={{ padding: '1rem 2.5rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}>
                            View Full Register <ArrowRight size={20} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}><div className="loader"></div></div>
                    ) : (
                        <div className="product-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '2.5rem'
                        }}>
                            {products.map((p, i) => (
                                <div key={p._id} className="glass-card reveal-up active" style={{
                                    transitionDelay: `${(i % 3) * 0.1}s`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}>
                                    <Link to={`/product/${p._id}`} className="img-box" style={{
                                        height: '220px',
                                        display: 'block',
                                        overflow: 'hidden',
                                        borderRadius: '12px',
                                        margin: '0.8rem',
                                        marginBottom: 0,
                                        background: 'rgba(0, 0, 0, 0.02)'
                                    }}>
                                        <img
                                            src={p.image_url !== 'no-image.jpg' ? p.image_url : fallbackImg}
                                            alt={p.name}
                                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }}
                                        />
                                    </Link>
                                    <div className="info" style={{ padding: '0.8rem 1.2rem 1.5rem', background: 'transparent' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                            <div>
                                                <span className="cat" style={{
                                                    margin: 0,
                                                    color: 'var(--primary-light)',
                                                    fontSize: '0.6rem',
                                                    fontWeight: '800',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.15em',
                                                    display: 'block',
                                                    marginBottom: '0.2rem'
                                                }}>{p.category}</span>
                                                <Link to={`/product/${p._id}`}>
                                                    <h3 className="name" style={{
                                                        fontSize: '1.2rem',
                                                        margin: 0,
                                                        color: 'var(--primary)',
                                                        fontWeight: '800',
                                                        fontFamily: '"Playfair Display", serif',
                                                        letterSpacing: '-0.01em',
                                                        lineHeight: '1.2'
                                                    }}>{p.name}</h3>
                                                </Link>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1px' }}>
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="#fbbf24" color="#fbbf24" />)}
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginTop: '2rem',
                                            paddingTop: '1.5rem',
                                            borderTop: '1px solid #f8fafc'
                                        }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Price per {p.unit || 'kg'}</span>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem' }}>
                                                    <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.02em' }}>₹{p.price}</span>
                                                </div>
                                            </div>
                                            {user?.role !== 'admin' && (
                                                <button
                                                    onClick={() => addToCart(p)}
                                                    disabled={p.quantity <= 0}
                                                    className="btn-pill"
                                                    style={{
                                                        width: '52px',
                                                        height: '52px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '50%',
                                                        background: p.quantity <= 0 ? '#f1f5f9' : 'var(--primary)',
                                                        color: p.quantity <= 0 ? '#94a3b8' : 'white',
                                                        border: 'none',
                                                        cursor: p.quantity <= 0 ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        boxShadow: p.quantity <= 0 ? 'none' : '0 8px 20px rgba(22, 66, 60, 0.2)'
                                                    }}
                                                >
                                                    <ShoppingBag size={22} strokeWidth={2.5} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Features Level Up */}
            <section style={{ padding: '10rem 0 15rem', background: 'var(--bg-pure)' }}>
                <div className="container">
                    <div className="section-title reveal-up">
                        <span>Pillars of Excellence</span>
                        The OneKart Standard
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
                        {[
                            { icon: ShieldCheck, title: "Curated Purity", desc: "Every harvest is hand-selected and rigorously verified for organic authenticity." },
                            { icon: Truck, title: "Heritage Direct", desc: "Eliminating middle-men to ensure peak freshness and full traceability." },
                            { icon: Star, title: "Estate Premium", desc: "Exclusive access to small-batch seasonal releases from premier estates." }
                        ].map((feat, i) => (
                            <div key={i} className="reveal-up" style={{
                                transitionDelay: `${0.1 * (i + 1)}s`,
                                background: 'var(--bg-pure)',
                                padding: '4rem 3rem',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '90px', height: '90px',
                                    background: 'var(--accent)',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 2.5rem',
                                    color: 'var(--primary)',
                                    transform: 'rotate(-5deg)'
                                }}>
                                    <feat.icon size={42} />
                                </div>
                                <h4 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-main)' }}>{feat.title}</h4>
                                <p style={{ color: 'var(--text-body)', fontSize: '1.1rem', lineHeight: '1.8', opacity: 0.8 }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
