import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Shield, Truck, Star, Sun, Sprout, Wheat } from 'lucide-react';

const fallbackImg = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=800";

const heroSlides = [
    {
        img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000",
        headline: "From the Soil,\nto Your Soul.",
        sub: "Traditional farming the way our grandfathers intended — raw, honest, and alive with the earth."
    },
    {
        img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2000",
        headline: "Hand-Picked,\nNot Mass-Packed.",
        sub: "Every crop harvested by hand in the golden hours of dawn. No machines. No shortcuts."
    },
    {
        img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=2000",
        headline: "Rooted in\nGeneration & Grain.",
        sub: "We carry forward a legacy of 30+ years of traditional, chemical-free cultivation."
    },
    {
        img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2000",
        headline: "Season by Season,\nFarm to Door.",
        sub: "Directly connecting Karnataka's farmers to your family table with zero middlemen."
    },
];

const pillars = [
    {
        icon: Shield,
        title: "Purity Guaranteed",
        desc: "Every harvest is hand-verified for organic authenticity. Zero synthetic pesticides, ever."
    },
    {
        icon: Truck,
        title: "Direct Delivery",
        desc: "Farmer to your door. No warehouses, no middlemen — just fresh produce at honest prices."
    },
    {
        icon: Wheat,
        title: "Heritage Seeds",
        desc: "We grow from indigenous, open-pollinated seed varieties that have fed communities for centuries."
    },
];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [slideIdx, setSlideIdx] = useState(0);
    const { addToCart } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        const timer = setInterval(() => setSlideIdx(p => (p + 1) % heroSlides.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            let pool = [...data.data];
            for (let i = pool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pool[i], pool[j]] = [pool[j], pool[i]];
            }
            setProducts(pool.slice(0, 12));
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const slide = heroSlides[slideIdx];

    return (
        <div style={{ background: 'var(--bg-main)', paddingTop: '0' }}>

            {/* ══════════════════════════════════════════════
                CINEMATIC HERO — Traditional Farming
            ══════════════════════════════════════════════ */}
            <section style={{ position: 'relative', height: '96vh', overflow: 'hidden', minHeight: '600px' }}>

                {/* Background Carousel */}
                {heroSlides.map((s, i) => (
                    <div key={i} style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${s.img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center 30%',
                        opacity: slideIdx === i ? 1 : 0,
                        transition: 'opacity 1.8s ease-in-out',
                        zIndex: 0
                    }} />
                ))}

                {/* Warm Sepia Gradient Overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(165deg, rgba(61,43,31,0.88) 0%, rgba(61,43,31,0.55) 50%, rgba(61,43,31,0.75) 100%)',
                    zIndex: 1
                }} />

                {/* Grain Texture on Hero */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/subtle-grunge.png")',
                    opacity: 0.06, pointerEvents: 'none'
                }} />

                {/* Bottom gradient fade to page bg */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '30%',
                    background: 'linear-gradient(to top, var(--parchment), transparent)',
                    zIndex: 3
                }} />

                {/* Hero Content */}
                <div className="container" style={{
                    position: 'relative', zIndex: 4,
                    height: '100%', display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', paddingTop: '90px', paddingBottom: '8rem'
                }}>
                    <div className="hero-fade-in" key={slideIdx}>
                        {/* Eyebrow label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{ width: '40px', height: '1.5px', background: 'var(--gold)' }} />
                            <span style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: '0.75rem', fontWeight: '700',
                                textTransform: 'uppercase', letterSpacing: '0.45em',
                                color: 'var(--gold-light)'
                            }}>
                                OneKart Organic Estate · Since 1996
                            </span>
                            <div style={{ width: '40px', height: '1.5px', background: 'var(--gold)' }} />
                        </div>

                        {/* Main Headline */}
                        <h1 style={{
                            fontSize: 'clamp(3.2rem, 7vw, 6.5rem)',
                            color: 'var(--parchment)',
                            fontFamily: "'IM Fell English SC', Georgia, serif",
                            lineHeight: '1.1',
                            marginBottom: '2rem',
                            maxWidth: '750px',
                            whiteSpace: 'pre-line',
                            textShadow: '2px 4px 20px rgba(0,0,0,0.4)'
                        }}>
                            {slide.headline}
                        </h1>

                        <p style={{
                            color: 'rgba(245,239,215,0.88)',
                            fontSize: '1.2rem',
                            maxWidth: '580px',
                            lineHeight: '1.85',
                            marginBottom: '3.5rem',
                            fontFamily: "'Lora', serif",
                            fontStyle: 'italic'
                        }}>
                            {slide.sub}
                        </p>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/marketplace')}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                                    padding: '0.95rem 2.4rem',
                                    background: 'var(--gold)',
                                    color: 'var(--soil)',
                                    border: '2px solid var(--gold)',
                                    borderRadius: '4px',
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: '700', fontSize: '0.88rem',
                                    letterSpacing: '0.1em', textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    boxShadow: '4px 4px 0px rgba(61,43,31,0.4)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0px rgba(61,43,31,0.45)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '4px 4px 0px rgba(61,43,31,0.4)'; }}
                            >
                                Browse Harvest <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                                    padding: '0.95rem 2.2rem',
                                    background: 'transparent',
                                    color: 'var(--parchment)',
                                    border: '2px solid rgba(245,239,215,0.5)',
                                    borderRadius: '4px',
                                    fontFamily: "'Outfit', sans-serif",
                                    fontWeight: '600', fontSize: '0.88rem',
                                    letterSpacing: '0.08em', textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--parchment)'; e.currentTarget.style.background = 'rgba(245,239,215,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(245,239,215,0.5)'; e.currentTarget.style.background = 'transparent'; }}
                            >
                                Become a Farmer Partner
                            </button>
                        </div>
                    </div>
                </div>

                {/* Slide Dots */}
                <div style={{
                    position: 'absolute', bottom: '3rem', left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex', gap: '0.6rem', zIndex: 5
                }}>
                    {heroSlides.map((_, i) => (
                        <button key={i} onClick={() => setSlideIdx(i)} style={{
                            width: i === slideIdx ? '28px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            background: i === slideIdx ? 'var(--gold)' : 'rgba(245,239,215,0.4)',
                            border: 'none', cursor: 'pointer',
                            transition: 'all 0.4s ease'
                        }} />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                MARQUEE TRUST STRIP
            ══════════════════════════════════════════════ */}
            <div style={{
                background: 'var(--soil)',
                borderTop: '2px solid var(--border-dk)',
                borderBottom: '2px solid var(--border-dk)',
                padding: '1rem 0',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
            }}>
                <div style={{
                    display: 'inline-flex', gap: '4rem',
                    animation: 'marquee 28s linear infinite'
                }}>
                    {[
                        '🌾 100% Organic Certified',
                        '🚜 Farm-to-Door Delivery',
                        '🪴 Zero Chemical Pesticides',
                        '🌿 30+ Years Heritage Farming',
                        '🤝 Direct from the Farmer',
                        '🌾 100% Organic Certified',
                        '🚜 Farm-to-Door Delivery',
                        '🪴 Zero Chemical Pesticides',
                        '🌿 30+ Years Heritage Farming',
                        '🤝 Direct from the Farmer',
                    ].map((t, i) => (
                        <span key={i} style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '0.78rem', fontWeight: '700',
                            letterSpacing: '0.15em', textTransform: 'uppercase',
                            color: 'var(--gold-light)'
                        }}>{t}</span>
                    ))}
                </div>
                <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
            </div>

            {/* ══════════════════════════════════════════════
                PRODUCTS SHOWCASE — Seed Catalogue Style
            ══════════════════════════════════════════════ */}
            <section style={{ padding: '7rem 0', background: 'var(--cream)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")', position: 'relative' }}>
                <div className="container">
                    {/* Section Header */}
                    <div className="reveal-up" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                            fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem',
                            fontWeight: '700', letterSpacing: '0.4em',
                            textTransform: 'uppercase', color: 'var(--rust)',
                            marginBottom: '1.2rem'
                        }}>
                            <span style={{ width: '30px', height: '1.5px', background: 'var(--rust)', display: 'inline-block' }} />
                            Seasonal Catalogue
                            <span style={{ width: '30px', height: '1.5px', background: 'var(--rust)', display: 'inline-block' }} />
                        </span>
                        <h2 style={{
                            fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
                            fontFamily: "'IM Fell English SC', Georgia, serif",
                            color: 'var(--soil)', marginBottom: '1rem'
                        }}>
                            This Week's Harvest
                        </h2>
                        <p style={{
                            color: 'var(--text-muted)', fontFamily: "'Lora', serif",
                            fontStyle: 'italic', fontSize: '1.05rem'
                        }}>
                            Fresh from the field this morning — reserved in limited quantities.
                        </p>
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem' }}>
                            <div className="loader" />
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                            {products.map((p, i) => (
                                <div key={p._id} className="reveal-up active glass-card" style={{
                                    transitionDelay: `${i * 0.08}s`,
                                    display: 'flex', flexDirection: 'column',
                                    background: 'var(--cream)'
                                }}>
                                    {/* Image */}
                                    <Link to={`/product/${p._id}`} style={{
                                        display: 'block', height: '170px',
                                        overflow: 'hidden', position: 'relative'
                                    }}>
                                        <img
                                            src={p.image_url && p.image_url !== 'no-image.jpg' ? p.image_url : fallbackImg}
                                            alt={p.name}
                                            onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                                            style={{
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                filter: 'sepia(0.1) contrast(1.04)',
                                                transition: 'transform 0.8s ease, filter 0.5s ease'
                                            }}
                                            onMouseEnter={e => { e.target.style.transform = 'scale(1.06)'; e.target.style.filter = 'sepia(0) contrast(1.08)'; }}
                                            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.filter = 'sepia(0.1) contrast(1.04)'; }}
                                        />
                                        {/* Organic Stamp */}
                                        <div style={{
                                            position: 'absolute', top: '10px', left: '10px',
                                            padding: '0.15rem 0.5rem',
                                            border: '1px solid rgba(245,239,215,0.8)',
                                            background: 'rgba(61,43,31,0.65)',
                                            borderRadius: '2px', backdropFilter: 'blur(4px)'
                                        }}>
                                            <span style={{
                                                fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem',
                                                fontWeight: '700', letterSpacing: '0.12em',
                                                textTransform: 'uppercase', color: 'var(--parchment)'
                                            }}>
                                                {p.category || 'Organic'}
                                            </span>
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <div style={{ padding: '1rem 1.1rem 1.1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        {/* Stars */}
                                        <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                                            {[1,2,3,4,5].map(s => <Star key={s} size={9} fill="var(--gold)" color="var(--gold)" />)}
                                        </div>

                                        <Link to={`/product/${p._id}`}>
                                            <h3 style={{
                                                fontSize: '1.05rem',
                                                fontFamily: "'IM Fell English SC', Georgia, serif",
                                                color: 'var(--soil)', marginBottom: '0.3rem',
                                                transition: 'color 0.3s ease',
                                                lineHeight: '1.3'
                                            }}
                                                onMouseEnter={e => e.target.style.color = 'var(--rust)'}
                                                onMouseLeave={e => e.target.style.color = 'var(--soil)'}
                                            >
                                                {p.name}
                                            </h3>
                                        </Link>

                                        {/* Farmer / Farm name in thick green color */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.6rem' }}>
                                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                                Farm: <span style={{ color: '#2e7d32', fontWeight: '800' }}>{p.seller?.name || 'Estate Direct'}</span>
                                            </span>
                                        </div>

                                        {p.description && (
                                            <p style={{
                                                fontFamily: "'Lora', serif", fontSize: '0.78rem',
                                                color: 'var(--text-muted)', fontStyle: 'italic',
                                                lineHeight: '1.5', marginBottom: '0.8rem',
                                                display: '-webkit-box', WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                            }}>
                                                {p.description}
                                            </p>
                                        )}

                                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid var(--border)' }}>
                                            <div>
                                                <span style={{
                                                    display: 'block', fontFamily: "'Outfit', sans-serif",
                                                    fontSize: '0.55rem', fontWeight: '700',
                                                    textTransform: 'uppercase', letterSpacing: '0.1em',
                                                    color: 'var(--text-muted)', marginBottom: '0.1rem'
                                                }}>Price / {p.unit || 'kg'}</span>
                                                <span style={{
                                                    fontSize: '1.45rem', fontWeight: '700',
                                                    color: 'var(--soil)',
                                                    fontFamily: "'IM Fell English SC', serif",
                                                    letterSpacing: '-0.01em'
                                                }}>₹{p.price}</span>
                                            </div>

                                            {user?.role !== 'admin' && (
                                                <button
                                                    onClick={() => addToCart(p)}
                                                    disabled={p.quantity <= 0}
                                                    style={{
                                                        width: '38px', height: '38px',
                                                        borderRadius: '4px',
                                                        background: p.quantity <= 0 ? 'var(--border)' : 'var(--soil)',
                                                        color: p.quantity <= 0 ? 'var(--text-muted)' : 'var(--parchment)',
                                                        border: '2px solid ' + (p.quantity <= 0 ? 'var(--border)' : 'var(--soil)'),
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        cursor: p.quantity <= 0 ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.3s ease',
                                                        boxShadow: p.quantity <= 0 ? 'none' : '2px 2px 0px var(--soil-light)'
                                                    }}
                                                    onMouseEnter={e => { if (p.quantity > 0) { e.currentTarget.style.background = 'var(--rust)'; e.currentTarget.style.borderColor = 'var(--rust)'; e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #8B2E08'; } }}
                                                    onMouseLeave={e => { if (p.quantity > 0) { e.currentTarget.style.background = 'var(--soil)'; e.currentTarget.style.borderColor = 'var(--soil)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px var(--soil-light)'; } }}
                                                >
                                                    <ShoppingBag size={16} strokeWidth={2} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <Link to="/marketplace" className="btn btn-outline" style={{ padding: '1rem 3rem', fontSize: '0.9rem' }}>
                            View Full Catalogue <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                HERITAGE STORY SECTION
            ══════════════════════════════════════════════ */}
            <section style={{ padding: '7rem 0', background: 'var(--parchment-dk)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")', borderTop: '2px solid var(--border)', borderBottom: '2px solid var(--border)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem', alignItems: 'center' }}>

                        {/* Left: Vintage Photo Collage */}
                        <div style={{ position: 'relative', paddingBottom: '2rem', paddingRight: '2rem' }}>
                            {/* Main photo */}
                            <div className="vintage-photo-frame" style={{ transform: 'rotate(-2deg)', zIndex: 2, position: 'relative' }}>
                                <div style={{ height: '320px', overflow: 'hidden' }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=900"
                                        alt="Traditional farming"
                                        className="vintage-img"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.25) contrast(1.05)' }}
                                    />
                                </div>
                                <p style={{ textAlign: 'center', fontFamily: "'Lora', serif", fontSize: '0.88rem', color: '#888', marginTop: '0.8rem', fontStyle: 'italic' }}>
                                    "Morning Tillage, Karnataka — 1998"
                                </p>
                            </div>
                            {/* Second photo peeking behind */}
                            <div style={{
                                position: 'absolute', bottom: 0, right: 0,
                                background: 'white', padding: '0.6rem 0.6rem 2.5rem',
                                boxShadow: '5px 5px 0px rgba(61,43,31,0.2)',
                                border: '1px solid #ddd', transform: 'rotate(3.5deg)',
                                width: '55%', zIndex: 1
                            }}>
                                <img
                                    src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=700"
                                    alt="Harvest season"
                                    style={{ width: '100%', height: '160px', objectFit: 'cover', filter: 'sepia(0.2)' }}
                                />
                            </div>
                        </div>

                        {/* Right: Story Text */}
                        <div className="reveal-up">
                            <span style={{
                                fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem',
                                fontWeight: '700', letterSpacing: '0.45em',
                                textTransform: 'uppercase', color: 'var(--rust)',
                                display: 'block', marginBottom: '1.5rem'
                            }}>
                                Est. 1996 · Our Heritage
                            </span>

                            <h2 style={{
                                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                                fontFamily: "'IM Fell English SC', Georgia, serif",
                                color: 'var(--soil)', marginBottom: '1.5rem', lineHeight: '1.25'
                            }}>
                                Farming the Way<br />
                                <span style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontWeight: '400', color: 'var(--rust)' }}>
                                    Our Elders Taught Us
                                </span>
                            </h2>

                            <p style={{
                                color: 'var(--text-body)', fontFamily: "'Lora', serif",
                                fontSize: '1.05rem', lineHeight: '1.9', marginBottom: '1.5rem'
                            }}>
                                Since the late 1990s, when industrial agriculture was sweeping across India, our founders chose a different path. They kept alive the old ways — oxen-led plowing, hand composting, rain-reading, and seed-saving — practices that had nourished our region for generations.
                            </p>

                            <p style={{
                                color: 'var(--text-muted)', fontFamily: "'Lora', serif",
                                fontStyle: 'italic', fontSize: '0.98rem', lineHeight: '1.8', marginBottom: '2.5rem'
                            }}>
                                "The soil remembers every season. You cannot rush it. You must learn to listen to it."
                                <br /><span style={{ fontWeight: '600', color: 'var(--soil)', fontStyle: 'normal', fontSize: '0.85rem' }}>— Raju Gowda, Founder</span>
                            </p>

                            {/* Stats Bar */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', padding: '1.5rem 0', borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)' }}>
                                {[['30+', 'Years\nFarming'], ['100%', 'Chemical\nFree'], ['0', 'Middlemen']].map(([num, label]) => (
                                    <div key={num} style={{ textAlign: 'center' }}>
                                        <div style={{
                                            fontSize: '2rem', fontWeight: '700',
                                            fontFamily: "'IM Fell English SC', serif",
                                            color: 'var(--rust)', lineHeight: '1'
                                        }}>{num}</div>
                                        <div style={{
                                            fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem',
                                            fontWeight: '600', letterSpacing: '0.1em',
                                            textTransform: 'uppercase', color: 'var(--text-muted)',
                                            marginTop: '0.4rem', whiteSpace: 'pre-line', lineHeight: '1.4'
                                        }}>{label}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '2.5rem' }}>
                                <Link to="/about" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem' }}>
                                    Our Full Story <ArrowRight size={17} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                PILLARS OF EXCELLENCE — Vintage Poster Panels
            ══════════════════════════════════════════════ */}
            <section style={{ padding: '7rem 0 9rem', background: 'var(--soil)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")', backgroundBlendMode: 'multiply' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <span style={{
                            fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem',
                            fontWeight: '700', letterSpacing: '0.45em',
                            textTransform: 'uppercase', color: 'var(--gold-light)',
                            display: 'block', marginBottom: '1.2rem'
                        }}>Our Promise to You</span>
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
                            fontFamily: "'IM Fell English SC', Georgia, serif",
                            color: 'var(--parchment)'
                        }}>
                            The OneKart Standard
                        </h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                        {pillars.map((p, i) => (
                            <div key={i} className="reveal-up" style={{
                                transitionDelay: `${i * 0.12}s`,
                                background: 'rgba(245,239,215,0.07)',
                                border: '1.5px solid rgba(245,239,215,0.15)',
                                borderRadius: '6px',
                                padding: '3.5rem 2.5rem',
                                textAlign: 'center',
                                transition: 'all 0.4s ease'
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,239,215,0.12)'; e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,239,215,0.07)'; e.currentTarget.style.borderColor = 'rgba(245,239,215,0.15)'; e.currentTarget.style.transform = 'none'; }}
                            >
                                <div style={{
                                    width: '72px', height: '72px',
                                    background: 'rgba(200,147,26,0.15)',
                                    border: '1.5px solid var(--gold)',
                                    borderRadius: '4px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 2rem',
                                    color: 'var(--gold)'
                                }}>
                                    <p.icon size={36} strokeWidth={1.5} />
                                </div>
                                <h4 style={{
                                    fontSize: '1.4rem', marginBottom: '1.2rem',
                                    fontFamily: "'IM Fell English SC', Georgia, serif",
                                    color: 'var(--parchment)', fontWeight: '400'
                                }}>{p.title}</h4>
                                <p style={{
                                    color: 'rgba(245,239,215,0.72)',
                                    fontFamily: "'Lora', serif",
                                    fontSize: '0.95rem', lineHeight: '1.8', fontStyle: 'italic'
                                }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
