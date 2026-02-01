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
        "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?q=80&w=2000", // Misty Field
        "https://images.unsplash.com/photo-1495107333211-6ca9c24ad03c?q=80&w=2000", // Golden Harvest
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000", // Dusk Meadow
        "https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2000", // Aerial Harvest
        "https://images.unsplash.com/photo-1595147389795-37094173bfd8?q=80&w=2000", // Dark Vineyard
        "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=2000", // Deep Forest
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000", // Shaded Garden
        "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=2000", // Blue Mountains
        "https://images.unsplash.com/photo-1544911845-1f34a3eb46b1?q=80&w=2000", // Dark Soil
        "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=2000"  // Herb Garden
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

            // Simple deterministic LCG-like pseudo-random shuffle
            let seededRandom = (s) => {
                let x = Math.sin(s++) * 10000;
                return x - Math.floor(x);
            };

            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(seededRandom(seed + i) * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }

            // Slice to show a smaller 'Daily Batch' of 12 products (3 rows of 4)
            setProducts(pool.slice(0, 12));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fallbackImg = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800";

    return (
        <div style={{ background: 'var(--bg-main)' }}>
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
            <section style={{ padding: '0 0 10rem' }}>
                <div className="container">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: '6rem',
                        borderBottom: '1px solid var(--border)',
                        paddingBottom: '2.5rem'
                    }} className="reveal-up">
                        <div>
                            <h2 style={{ fontSize: '3.5rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }}>Seasonal Showcase</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '0.5rem' }}>Reserve your share of this month's exceptional harvests.</p>
                        </div>
                        <Link to="/marketplace" className="btn-outline" style={{ padding: '1rem 2.5rem' }}>
                            View Full Register <ArrowRight size={20} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}><div className="loader"></div></div>
                    ) : (
                        <div className="product-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '1.5rem'
                        }}>
                            {products.map((p, i) => (
                                <div key={p._id} className="product-card reveal-up active" style={{
                                    background: 'var(--bg-pure)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow)',
                                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${0.05 * (i % 4)}s`,
                                    animation: 'fadeIn 0.5s ease-out',
                                    border: '1px solid rgba(22, 66, 60, 0.05)'
                                }}>
                                    <Link to={`/product/${p._id}`} className="img-box" style={{
                                        height: '320px',
                                        display: 'block',
                                        overflow: 'hidden'
                                    }}>
                                        <img src={p.image_url !== 'no-image.jpg' ? p.image_url : fallbackImg} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} />
                                    </Link>
                                    <div className="info" style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <span className="cat" style={{ margin: 0, background: 'var(--accent)', color: 'var(--primary)', padding: '0.35rem 0.7rem', borderRadius: '100px', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase' }}>{p.category}</span>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill="var(--primary-light)" color="var(--primary-light)" />)}
                                            </div>
                                        </div>
                                        <h3 className="name" style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: 'var(--primary)', fontWeight: '800' }}>{p.name}</h3>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            paddingTop: '1.2rem',
                                            borderTop: '1px solid rgba(22, 66, 60, 0.05)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                                <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>₹{p.price}</span>
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>/{p.unit || 'kg'}</span>
                                            </div>
                                            {user?.role !== 'admin' && (
                                                <button
                                                    onClick={() => addToCart(p)}
                                                    disabled={p.quantity <= 0}
                                                    className="btn btn-primary"
                                                    style={{
                                                        padding: '0.7rem 1.4rem',
                                                        boxShadow: '0 4px 15px rgba(22, 66, 60, 0.1)',
                                                        background: p.quantity <= 0 ? '#e2e8f0' : 'var(--primary)',
                                                        color: p.quantity <= 0 ? '#94a3b8' : 'white',
                                                        borderRadius: '100px',
                                                        fontSize: '0.85rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    <ShoppingBag size={16} /> {p.quantity <= 0 ? 'Stock' : 'Reserve'}
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
            <section style={{ padding: '10rem 0 15rem', background: 'var(--bg-main)' }}>
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
