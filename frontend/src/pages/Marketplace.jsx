import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, LayoutGrid, List, User, ShoppingBag, X } from 'lucide-react';

const fallbackImg = "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1000";

const formatImageUrl = (url) => {
    if (!url || url === 'no-image.jpg') return fallbackImg;
    let formatted = url.replace(/\\/g, '/');
    if (!formatted.startsWith('http') && !formatted.startsWith('/')) {
        formatted = '/' + formatted;
    }
    return formatted;
};

const heroSlides = [
    {
        img: "https://images.unsplash.com/photo-1488459739032-d6f82311468e?q=80&w=2500",
        quote: "Directly from the fields that feed our families."
    },
    {
        img: "https://images.unsplash.com/photo-1595841696677-54897f28bc12?q=80&w=2500",
        quote: "The right seeds for a sustainable tomorrow."
    },
    {
        img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2500",
        quote: "Rooted in tradition. Harvested for the modern home."
    },
];

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const { user } = useContext(AuthContext);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(window.innerWidth > 992);
    const [currentSlide, setCurrentSlide] = useState(0);

    const location = useLocation();
    const categories = ['All', 'Vegetables', 'Fruits', 'Seeds', 'Organic Dairy', 'Tools'];

    useEffect(() => {
        const interval = setInterval(() => setCurrentSlide(p => (p + 1) % heroSlides.length), 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setKeyword(params.get('keyword') || '');
        setCategory(params.get('category') || 'All');
    }, [location.search]);

    useEffect(() => { fetchProducts(); }, [category, sort, keyword]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (keyword) params.append('keyword', keyword);
            if (category !== 'All') params.append('category', category);
            if (sort) params.append('sort', sort);
            params.append('_t', Date.now());
            const { data } = await axios.get(`/api/products?${params.toString()}`);
            let results = data.data || [];
            if (!keyword && (sort === 'newest' || !sort)) {
                for (let i = results.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [results[i], results[j]] = [results[j], results[i]];
                }
            }
            setProducts(results);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>

            {/* ══════════════════════════════════════════════
                ALMANAC HEADER — Heritage Carousel Banner
            ══════════════════════════════════════════════ */}
            <section style={{
                position: 'relative', height: '55vh', minHeight: '420px',
                overflow: 'hidden', display: 'flex', alignItems: 'center',
                paddingTop: '70px'
            }}>
                {heroSlides.map((slide, i) => (
                    <div key={i} style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${slide.img})`,
                        backgroundSize: 'cover', backgroundPosition: 'center 40%',
                        opacity: currentSlide === i ? 1 : 0,
                        transition: 'opacity 1.8s ease-in-out',
                        filter: 'sepia(0.18) contrast(1.05)'
                    }} />
                ))}
                {/* Overlay gradient */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to right, rgba(61,43,31,0.90) 40%, rgba(61,43,31,0.4) 100%)',
                    zIndex: 1
                }} />
                {/* Grain on top */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/subtle-grunge.png")',
                    opacity: 0.06
                }} />
                {/* Bottom fade to page */}
                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
                    background: 'linear-gradient(to top, var(--parchment), transparent)', zIndex: 3
                }} />

                <div className="container" style={{ position: 'relative', zIndex: 4 }}>
                    <div className="hero-fade-in" key={currentSlide}>
                        {/* Label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '32px', height: '1.5px', background: 'var(--gold)' }} />
                            <span style={{
                                fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem',
                                fontWeight: '700', letterSpacing: '0.4em',
                                textTransform: 'uppercase', color: 'var(--gold-light)'
                            }}>OneKart Organic Almanac</span>
                        </div>
                        <h1 style={{
                            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                            fontFamily: "'IM Fell English SC', Georgia, serif",
                            color: 'var(--parchment)', lineHeight: '1.1',
                            marginBottom: '1.4rem', fontWeight: '400'
                        }}>The Marketplace.</h1>
                        <p style={{
                            fontFamily: "'Lora', serif", fontSize: '1.15rem',
                            fontStyle: 'italic', color: 'rgba(245,239,215,0.88)',
                            maxWidth: '500px', lineHeight: '1.7',
                            borderLeft: '3px solid var(--gold)',
                            paddingLeft: '1.5rem'
                        }}>
                            "{heroSlides[currentSlide].quote}"
                        </p>
                    </div>
                </div>

                {/* Slide indicators */}
                <div style={{ position: 'absolute', bottom: '5rem', left: '2.5rem', display: 'flex', gap: '0.5rem', zIndex: 5 }}>
                    {heroSlides.map((_, i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)} style={{
                            width: i === currentSlide ? '28px' : '8px', height: '4px',
                            borderRadius: '2px', border: 'none', cursor: 'pointer',
                            background: i === currentSlide ? 'var(--gold)' : 'rgba(245,239,215,0.35)',
                            transition: 'all 0.4s ease'
                        }} />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════
                ALMANAC GRID SECTION
            ══════════════════════════════════════════════ */}
            <section style={{
                padding: '5rem 0 10rem',
                background: 'var(--cream)',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
                borderTop: '2px solid var(--border)'
            }}>
                <div className="container">

                    {/* ── Controls Bar ── */}
                    <div className="marketplace-controls" style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: '2.5rem', paddingBottom: '1.5rem',
                        borderBottom: '1.5px solid var(--border)',
                        flexWrap: 'wrap', gap: '0.8rem'
                    }}>
                        {/* Search */}
                        <div className="marketplace-controls-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} strokeWidth={2} style={{
                                    position: 'absolute', left: '1rem', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--text-muted)'
                                }} />
                                <input
                                    type="text"
                                    placeholder="Search the harvest..."
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && fetchProducts()}
                                    style={{
                                        paddingLeft: '2.6rem', paddingRight: '1rem',
                                        paddingTop: '0.65rem', paddingBottom: '0.65rem',
                                        background: 'var(--parchment-dk)',
                                        border: '1.5px solid var(--border)',
                                        borderRadius: '4px', width: '200px',
                                        fontFamily: "'Lora', serif", fontSize: '0.88rem',
                                        color: 'var(--soil)', outline: 'none',
                                        boxShadow: '2px 2px 0px var(--border)'
                                    }}
                                />
                                {keyword && (
                                    <button onClick={() => setKeyword('')} style={{
                                        position: 'absolute', right: '0.8rem', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex'
                                    }}>
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <span style={{
                                fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem',
                                fontWeight: '700', color: 'var(--rust)',
                                textTransform: 'uppercase', letterSpacing: '0.1em'
                            }}>
                                {!loading && `${products.length} ${products.length === 1 ? 'entry' : 'entries'} found`}
                            </span>
                        </div>

                        {/* Right controls */}
                        <div className="marketplace-controls-right" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                            {/* Sort */}
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={sort}
                                    onChange={e => setSort(e.target.value)}
                                    style={{
                                        padding: '0.6rem 2.2rem 0.6rem 1rem',
                                        background: 'var(--parchment-dk)',
                                        border: '1.5px solid var(--border)', borderRadius: '4px',
                                        fontFamily: "'Outfit', sans-serif", fontWeight: '600',
                                        fontSize: '0.78rem', letterSpacing: '0.05em',
                                        color: 'var(--soil)', outline: 'none', cursor: 'pointer',
                                        appearance: 'none', boxShadow: '2px 2px 0px var(--border)'
                                    }}
                                >
                                    <option value="newest">Newest Harvest</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    padding: '0.6rem 1.2rem',
                                    background: showFilters ? 'var(--soil)' : 'transparent',
                                    color: showFilters ? 'var(--parchment)' : 'var(--soil)',
                                    border: '1.5px solid var(--soil)', borderRadius: '4px',
                                    fontFamily: "'Outfit', sans-serif", fontWeight: '700',
                                    fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                                    cursor: 'pointer', transition: 'all 0.3s ease',
                                    boxShadow: '2px 2px 0px var(--border-dk)'
                                }}
                            >
                                <SlidersHorizontal size={15} />
                                Filters
                            </button>

                            {/* View toggle */}
                            <div style={{
                                display: 'flex', background: 'var(--parchment-dk)',
                                border: '1.5px solid var(--border)', borderRadius: '4px',
                                overflow: 'hidden', boxShadow: '2px 2px 0px var(--border)'
                            }}>
                                {[['grid', LayoutGrid], ['list', List]].map(([mode, Icon]) => (
                                    <button key={mode} onClick={() => setViewMode(mode)} style={{
                                        padding: '0.55rem 0.7rem', border: 'none', cursor: 'pointer',
                                        background: viewMode === mode ? 'var(--soil)' : 'transparent',
                                        color: viewMode === mode ? 'var(--parchment)' : 'var(--text-muted)',
                                        display: 'flex', transition: 'all 0.2s ease'
                                    }}>
                                        <Icon size={17} strokeWidth={2} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Main Layout ── */}
                    <div className="marketplace-layout-grid" style={{ display: 'grid', gridTemplateColumns: showFilters ? '240px 1fr' : '1fr', gap: '3rem', alignItems: 'start' }}>

                        {/* ── Almanac Sidebar ── */}
                        {showFilters && (
                            <aside style={{ position: 'sticky', top: '90px' }}>
                                {/* Sidebar shell with almanac styling */}
                                <div style={{
                                    background: 'var(--parchment-dk)',
                                    border: '1.5px solid var(--border)',
                                    borderRadius: '6px',
                                    overflow: 'hidden',
                                    boxShadow: '4px 4px 0px var(--border)'
                                }}>
                                    {/* Almanac Header */}
                                    <div style={{
                                        background: 'var(--soil)',
                                        padding: '1.2rem 1.5rem',
                                        borderBottom: '2px solid var(--border-dk)'
                                    }}>
                                        <h4 style={{
                                            color: 'var(--parchment)',
                                            fontFamily: "'IM Fell English SC', Georgia, serif",
                                            fontSize: '1.15rem', fontWeight: '400',
                                            margin: 0
                                        }}>Field Index</h4>
                                        <span style={{
                                            display: 'block', fontFamily: "'Outfit', sans-serif",
                                            fontSize: '0.6rem', fontWeight: '700',
                                            letterSpacing: '0.25em', textTransform: 'uppercase',
                                            color: 'var(--gold-light)', marginTop: '0.25rem'
                                        }}>Browse by Category</span>
                                    </div>

                                    {/* Categories */}
                                    <div style={{ padding: '0.5rem 0' }}>
                                        {categories.map((cat, i) => (
                                            <button key={cat} onClick={() => setCategory(cat)} style={{
                                                width: '100%', textAlign: 'left', padding: '0.9rem 1.5rem',
                                                background: category === cat ? 'var(--rust)' : 'transparent',
                                                border: 'none',
                                                borderBottom: i < categories.length - 1 ? '1px solid rgba(197,180,154,0.4)' : 'none',
                                                cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'space-between',
                                                transition: 'background 0.2s ease'
                                            }}
                                                onMouseEnter={e => { if (category !== cat) e.currentTarget.style.background = 'rgba(193,68,14,0.08)'; }}
                                                onMouseLeave={e => { if (category !== cat) e.currentTarget.style.background = 'transparent'; }}
                                            >
                                                <span style={{
                                                    fontFamily: "'Lora', serif", fontSize: '0.92rem',
                                                    color: category === cat ? 'white' : 'var(--text-body)',
                                                    fontWeight: category === cat ? '600' : '400'
                                                }}>{cat}</span>
                                                {category === cat && (
                                                    <span style={{
                                                        width: '6px', height: '6px', borderRadius: '50%',
                                                        background: 'white', display: 'block'
                                                    }} />
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Almanac Divider */}
                                    <div style={{
                                        margin: '0 1rem', height: '1.5px',
                                        background: 'linear-gradient(to right, transparent, var(--border-dk), transparent)'
                                    }} />

                                    {/* Sort inside sidebar too */}
                                    <div style={{ padding: '1.5rem' }}>
                                        <h5 style={{
                                            fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem',
                                            fontWeight: '700', letterSpacing: '0.25em',
                                            textTransform: 'uppercase', color: 'var(--rust)',
                                            marginBottom: '1rem'
                                        }}>Sort By</h5>
                                        {[
                                            ['newest', 'Newest Harvest'],
                                            ['price_asc', 'Price: Low → High'],
                                            ['price_desc', 'Price: High → Low'],
                                            ['rating', 'Highest Rated'],
                                        ].map(([val, label]) => (
                                            <button key={val} onClick={() => setSort(val)} style={{
                                                display: 'block', width: '100%', textAlign: 'left',
                                                padding: '0.55rem 0', background: 'none', border: 'none',
                                                fontFamily: "'Lora', serif", fontSize: '0.88rem',
                                                color: sort === val ? 'var(--rust)' : 'var(--text-muted)',
                                                fontWeight: sort === val ? '600' : '400',
                                                cursor: 'pointer', transition: 'color 0.2s ease',
                                                borderBottom: '1px dotted rgba(197,180,154,0.4)'
                                            }}>{label}</button>
                                        ))}
                                    </div>

                                    {/* Est. ribbon at bottom */}
                                    <div style={{
                                        background: 'var(--parchment-dkr)',
                                        padding: '0.8rem',
                                        textAlign: 'center',
                                        borderTop: '1.5px solid var(--border)'
                                    }}>
                                        <span style={{
                                            fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem',
                                            fontWeight: '700', letterSpacing: '0.3em',
                                            textTransform: 'uppercase', color: 'var(--text-muted)'
                                        }}>OneKart · Est. 1996</span>
                                    </div>
                                </div>
                            </aside>
                        )}

                        {/* ── Product Grid ── */}
                        <div>
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
                                    <div className="loader" />
                                </div>
                            ) : products.length === 0 ? (
                                <div style={{
                                    padding: '8rem 2rem', textAlign: 'center',
                                    background: 'var(--cream)',
                                    border: '1.5px dashed var(--border)', borderRadius: '6px'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
                                    <h2 style={{
                                        fontSize: '2rem', marginBottom: '1rem',
                                        fontFamily: "'IM Fell English SC', Georgia, serif"
                                    }}>No Harvest Found</h2>
                                    <p style={{ color: 'var(--text-muted)', fontFamily: "'Lora', serif", fontStyle: 'italic', marginBottom: '2rem' }}>
                                        The fields are quiet for that search. Try something else.
                                    </p>
                                    <button onClick={() => { setCategory('All'); setKeyword(''); fetchProducts(); }} className="btn btn-primary">
                                        Reset Index
                                    </button>
                                </div>
                            ) : viewMode === 'grid' ? (
                                <div className="marketplace-products-grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: showFilters ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(220px, 1fr))',
                                    gap: '1.1rem'
                                }}>
                                    {products.map((p, i) => (
                                        <GridCard key={p._id} p={p} i={i} addToCart={addToCart} user={user} />
                                    ))}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    {products.map((p, i) => (
                                        <ListCard key={p._id} p={p} i={i} addToCart={addToCart} user={user} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

/* ────────────────────────────────────────────────────────────
   GRID CARD — Kraft paper seed-catalogue style
──────────────────────────────────────────────────────────── */
const GridCard = ({ p, i, addToCart, user }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="glass-card grid-card reveal-up active"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex', flexDirection: 'column',
                background: 'var(--cream)',
                transitionDelay: `${(i % 3) * 0.04}s`
            }}
        >
            {/* Image */}
            <Link to={`/product/${p._id}`} className="grid-card-img" style={{ display: 'block', height: '175px', overflow: 'hidden', position: 'relative' }}>
                <img
                    src={formatImageUrl(p.image_url)}
                    alt={p.name}
                    onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                    style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        filter: hovered ? 'sepia(0) contrast(1.08)' : 'sepia(0.15) contrast(1.03)',
                        transform: hovered ? 'scale(1.06)' : 'scale(1)',
                        transition: 'transform 0.7s ease, filter 0.5s ease'
                    }}
                />
                {/* Category stamp */}
                <div className="grid-card-badge" style={{
                    position: 'absolute', top: '8px', left: '8px',
                    padding: '0.15rem 0.5rem',
                    background: 'rgba(61,43,31,0.78)',
                    border: '1px solid rgba(245,239,215,0.5)',
                    borderRadius: '2px', backdropFilter: 'blur(4px)'
                }}>
                    <span style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem',
                        fontWeight: '700', letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: 'var(--parchment)'
                    }}>{p.category || 'Organic'}</span>
                </div>
                {p.quantity <= 0 && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(61,43,31,0.55)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span style={{
                            fontFamily: "'IM Fell English SC', serif", fontSize: '1.25rem',
                            color: 'var(--parchment)', fontStyle: 'italic', letterSpacing: '0.1em',
                            border: '2px solid var(--parchment)', padding: '0.3rem 0.8rem', transform: 'rotate(-8deg)'
                        }}>Out of Stock</span>
                    </div>
                )}
            </Link>

            {/* Info */}
            <div className="grid-card-info" style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Stars */}
                <div className="grid-card-meta" style={{ display: 'flex', gap: '2px', marginBottom: '0.4rem' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={9} fill="var(--gold)" color="var(--gold)" />)}
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem', color: 'var(--text-muted)', marginLeft: '4px' }}>{p.rating || '4.9'}</span>
                </div>

                <Link to={`/product/${p._id}`}>
                    <h3 className="grid-card-name" style={{
                        fontSize: '1.05rem', marginBottom: '0.4rem',
                        fontFamily: "'IM Fell English SC', Georgia, serif",
                        color: hovered ? 'var(--rust)' : 'var(--soil)',
                        lineHeight: '1.25', transition: 'color 0.3s ease'
                    }}>{p.name}</h3>
                </Link>

                <div className="grid-card-seller" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.6rem' }}>
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Farm: <span style={{ color: '#2e7d32', fontWeight: '800' }}>{p.seller?.name || 'Estate Direct'}</span>
                    </span>
                </div>

                {p.description && (
                    <p className="grid-card-desc" style={{
                        fontFamily: "'Lora', serif", fontStyle: 'italic',
                        fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        marginBottom: '0.6rem'
                    }}>{p.description}</p>
                )}

                <div className="grid-card-footer" style={{
                    marginTop: 'auto', paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <span className="grid-card-unit" style={{
                            display: 'block', fontFamily: "'Outfit', sans-serif",
                            fontSize: '0.55rem', fontWeight: '700',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: 'var(--text-muted)', marginBottom: '0.1rem'
                        }}>per {p.unit || 'kg'}</span>
                        <span className="grid-card-price" style={{
                            fontSize: '1.45rem',
                            fontFamily: "'IM Fell English SC', serif",
                            color: 'var(--soil)', fontWeight: '400'
                        }}>₹{p.price}</span>
                    </div>

                    {(!user || user.role === 'customer') && (
                        <button
                            onClick={() => addToCart(p)}
                            disabled={p.quantity <= 0}
                            className="grid-card-btn"
                            style={{
                                width: '38px', height: '38px',
                                borderRadius: '3px',
                                background: p.quantity <= 0 ? 'var(--border)' : 'var(--soil)',
                                color: p.quantity <= 0 ? 'var(--text-muted)' : 'var(--parchment)',
                                border: '1.5px solid ' + (p.quantity <= 0 ? 'var(--border)' : 'var(--soil)'),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: p.quantity <= 0 ? 'not-allowed' : 'pointer',
                                boxShadow: p.quantity <= 0 ? 'none' : '2px 2px 0px var(--soil-light)',
                                transition: 'all 0.25s ease'
                            }}
                            onMouseEnter={e => { if (p.quantity > 0) { e.currentTarget.style.background = 'var(--rust)'; e.currentTarget.style.borderColor = 'var(--rust)'; e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0px #8B2E08'; } }}
                            onMouseLeave={e => { if (p.quantity > 0) { e.currentTarget.style.background = 'var(--soil)'; e.currentTarget.style.borderColor = 'var(--soil)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '2px 2px 0px var(--soil-light)'; } }}
                        >
                            <ShoppingBag size={17} strokeWidth={2} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ────────────────────────────────────────────────────────────
   LIST CARD — Horizontal almanac ledger style
──────────────────────────────────────────────────────────── */
const ListCard = ({ p, i, addToCart, user }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            className="glass-card list-card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ display: 'flex', background: 'var(--cream)', flexDirection: 'row' }}
        >
            {/* Image */}
            <Link to={`/product/${p._id}`} className="list-card-img" style={{ width: '200px', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                <img
                    src={formatImageUrl(p.image_url)}
                    alt={p.name}
                    onError={e => { e.target.onerror = null; e.target.src = fallbackImg; }}
                    style={{
                        width: '100%', height: '145px', objectFit: 'cover',
                        filter: hovered ? 'sepia(0)' : 'sepia(0.15)',
                        transform: hovered ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.6s ease, filter 0.4s ease'
                    }}
                />
            </Link>

            {/* Info */}
            <div style={{ flex: 1, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
                <div style={{ flex: 1 }}>
                    <span style={{
                        display: 'inline-block', padding: '0.1rem 0.5rem',
                        border: '1px solid var(--rust)', borderRadius: '2px',
                        fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem',
                        fontWeight: '700', letterSpacing: '0.12em',
                        textTransform: 'uppercase', color: 'var(--rust)',
                        marginBottom: '0.4rem'
                    }}>{p.category || 'Organic'}</span>

                    <Link to={`/product/${p._id}`}>
                        <h3 style={{
                            fontSize: '1.25rem', marginBottom: '0.4rem',
                            fontFamily: "'IM Fell English SC', Georgia, serif",
                            color: hovered ? 'var(--rust)' : 'var(--soil)',
                            transition: 'color 0.3s ease'
                        }}>{p.name}</h3>
                    </Link>

                    {p.description && (
                        <p style={{
                            fontFamily: "'Lora', serif", fontStyle: 'italic',
                            fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5',
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>{p.description}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={9} fill="var(--gold)" color="var(--gold)" />)}
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '4px' }}>{p.seller?.name || 'Estate Direct'}</span>
                    </div>
                </div>

                {/* Price + Action */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{
                            display: 'block', fontFamily: "'Outfit', sans-serif",
                            fontSize: '0.55rem', fontWeight: '700',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                            color: 'var(--text-muted)', marginBottom: '0.1rem'
                        }}>per {p.unit || 'kg'}</span>
                        <span style={{
                            fontSize: '1.6rem', fontFamily: "'IM Fell English SC', serif",
                            color: 'var(--soil)', fontWeight: '400'
                        }}>₹{p.price}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/product/${p._id}`} className="btn btn-outline" style={{ padding: '0.45rem 1rem', fontSize: '0.72rem' }}>
                            Details
                        </Link>
                        {(!user || user.role === 'customer') && (
                            <button
                                onClick={() => addToCart(p)}
                                disabled={p.quantity <= 0}
                                className="btn btn-primary"
                                style={{ padding: '0.45rem 1rem', fontSize: '0.72rem' }}
                            >
                                <ShoppingBag size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
