import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, Star, ChevronDown, LayoutGrid, List, User } from 'lucide-react';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const { user } = useContext(AuthContext);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('newest');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [showFilters, setShowFilters] = useState(false);

    const location = useLocation();

    const categories = ['All', 'Vegetables', 'Fruits', 'Seeds', 'Organic Dairy', 'Tools'];

    // Slideshow state and data
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            img: "https://images.unsplash.com/photo-1488459739032-d6f82311468e?q=80&w=2500", // Market Stall
            quote: "Directly from the estates that define excellence."
        },
        {
            img: "https://images.unsplash.com/photo-1595841696677-54897f28bc12?q=80&w=2500", // Fresh tools/produce
            quote: "The right tools for a sustainable future."
        },
        {
            img: "https://images.unsplash.com/photo-1590779033100-9f60705a2f3b?q=80&w=2500", // Honey/Dairy
            quote: "Purity you can taste in every single drop."
        },
        {
            img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2500", // Large field harvest
            quote: "Rooted in tradition, harvested for the modern home."
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const urlKeyword = queryParams.get('keyword') || '';
        const urlCategory = queryParams.get('category') || 'All';
        setKeyword(urlKeyword);
        setCategory(urlCategory);
    }, [location.search]);

    useEffect(() => {
        fetchProducts();
    }, [category, sort, keyword]);

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

            // Shuffle results on refresh if no active search filters (Discovery Mode)
            if (!keyword && category === 'All') {
                for (let i = results.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [results[i], results[j]] = [results[j], results[i]];
                }
            }

            setProducts(results);
        } catch (error) {
            console.error("Error fetching", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fallbackImg = "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000";

    return (
        <div style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
            {/* Cinematic Registry Header */}
            <section style={{
                position: 'relative',
                height: '600px',
                marginTop: 0,
                overflow: 'hidden',
                color: 'var(--creamy)',
                display: 'flex',
                alignItems: 'center'
            }}>
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `linear-gradient(rgba(22, 66, 60, 0.75), rgba(22, 66, 60, 0.45)), url(${slide.img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: currentSlide === index ? 1 : 0,
                            transition: 'opacity 1.8s ease-in-out',
                            zIndex: 1,
                            transform: currentSlide === index ? 'scale(1)' : 'scale(1.05)'
                        }}
                    >
                        <div className="container" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                            <div className="hero-fade-in">
                                <span style={{ color: 'var(--primary-light)', fontWeight: '800', letterSpacing: '0.6em', fontSize: '0.85rem', display: 'block', marginBottom: '2rem', textTransform: 'uppercase' }}>Private Estate Registry</span>
                                <h1 style={{ fontSize: 'clamp(3.5rem, 7vw, 5.5rem)', fontWeight: '800', lineHeight: '1', fontFamily: '"Playfair Display", serif', marginBottom: '2rem', letterSpacing: '-0.02em' }}>The Marketplace.</h1>
                                <p style={{ fontSize: '1.6rem', fontStyle: 'italic', fontWeight: '400', opacity: 0.9, maxWidth: '650px', lineHeight: '1.6', fontFamily: '"Playfair Display", serif', borderLeft: '3px solid var(--primary-light)', paddingLeft: '2rem' }}>
                                    "{slide.quote}"
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Registry View Controls */}
                <div className="container" style={{ position: 'absolute', bottom: '4rem', left: 0, right: 0, zIndex: 3 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {slides.map((_, i) => (
                                <div key={i} style={{ width: i === currentSlide ? '40px' : '10px', height: '3px', background: i === currentSlide ? 'var(--primary-light)' : 'rgba(255,255,255,0.3)', transition: 'var(--transition)' }} />
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            {/* Registry Grid & Filtering */}
            <section className="container" style={{ padding: '4rem 0 10rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: showFilters ? '240px 1fr' : '1fr', gap: '3rem', transition: 'all 0.5s ease' }}>

                    {/* Registry Filters Sidebar */}
                    {showFilters && (
                        <aside className="reveal-up active" style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
                            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow)' }}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', marginBottom: '1.2rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Direct Search</h4>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        placeholder="Search registry..."
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem 1rem',
                                            borderRadius: '12px',
                                            background: 'rgba(255,255,255,0.5)',
                                            border: '1px solid var(--border)',
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <Search size={16} color="var(--primary-light)" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={fetchProducts} />
                                </div>

                                <div style={{ marginTop: '2.5rem' }}>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', marginBottom: '1.2rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Categories</h4>
                                    <div style={{ display: 'grid', gap: '0.8rem' }}>
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setCategory(cat)}
                                                style={{
                                                    textAlign: 'left',
                                                    background: 'transparent',
                                                    border: 'none',
                                                    fontSize: '0.9rem',
                                                    fontWeight: category === cat ? '700' : '400',
                                                    color: category === cat ? 'var(--primary)' : 'var(--text-muted)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    transition: 'var(--transition)'
                                                }}
                                            >
                                                {cat}
                                                {category === cat && <div style={{ width: '5px', height: '5px', background: 'var(--primary-light)', borderRadius: '50%' }} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginTop: '2.5rem' }}>
                                    <h4 style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.15em', marginBottom: '1rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Arrangement</h4>
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem',
                                            borderRadius: '12px',
                                            background: 'white',
                                            border: '1px solid var(--border)',
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="newest">Latest Release</option>
                                        <option value="price_asc">Price: Ascending</option>
                                        <option value="price_desc">Price: Descending</option>
                                        <option value="rating">Registry Rating</option>
                                    </select>
                                </div>
                            </div>
                        </aside>
                    )}

                    {/* Registry Grid */}
                    <div>
                        {!loading && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {products.length} Curated Entries
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        style={{
                                            background: showFilters ? 'var(--primary)' : 'transparent',
                                            color: showFilters ? 'white' : 'var(--primary)',
                                            border: '1px solid var(--primary)',
                                            padding: '0.6rem 1rem',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'var(--transition)',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        <SlidersHorizontal size={16} /> Filters
                                    </button>
                                    <button onClick={() => setViewMode('grid')} style={{ background: viewMode === 'grid' ? 'var(--primary)' : 'transparent', color: viewMode === 'grid' ? 'white' : 'var(--primary)', border: '1px solid var(--primary)', padding: '0.6rem', borderRadius: '8px', display: 'flex', cursor: 'pointer', transition: 'var(--transition)' }}><LayoutGrid size={18} /></button>
                                    <button onClick={() => setViewMode('list')} style={{ background: viewMode === 'list' ? 'var(--primary)' : 'transparent', color: viewMode === 'list' ? 'white' : 'var(--primary)', border: '1px solid var(--primary)', padding: '0.6rem', borderRadius: '8px', display: 'flex', cursor: 'pointer', transition: 'var(--transition)' }}><List size={18} /></button>
                                </div>
                            </div>
                        )}
                        {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}><div className="loader"></div></div>
                        ) : (
                            <>
                                {products.length === 0 ? (
                                    <div className="reveal active" style={{ padding: '8rem 2rem', textAlign: 'center', background: 'var(--bg-pure)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)' }}>
                                        <h2 style={{ fontSize: '2rem', fontFamily: '"Playfair Display", serif', marginBottom: '1rem' }}>No Matches Found</h2>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Refine your search parameters.</p>
                                        <button onClick={() => { setCategory('All'); setKeyword(''); fetchProducts(); }} className="btn btn-primary">Reset Registry</button>
                                    </div>
                                ) : (
                                    <div className="product-grid" style={{
                                        display: 'grid',
                                        gridTemplateColumns: viewMode === 'grid' ? (showFilters ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)') : '1fr',
                                        gap: '2.5rem',
                                        padding: 0,
                                        transition: 'grid-template-columns 0.4s ease'
                                    }}>
                                        {products.map((p, i) => (
                                            <div key={p._id} className="product-card reveal-up active" style={{
                                                flexDirection: viewMode === 'grid' ? 'column' : 'row',
                                                alignItems: 'stretch',
                                                transitionDelay: `${(i % 3) * 0.1}s`,
                                                background: 'var(--bg-pure)',
                                                borderRadius: 'var(--radius-lg)',
                                                overflow: 'hidden',
                                                boxShadow: 'var(--shadow)',
                                                border: '1px solid rgba(22, 66, 60, 0.05)',
                                                transition: 'var(--transition)'
                                            }}>
                                                <Link to={`/product/${p._id}`} className="img-box" style={{
                                                    width: viewMode === 'grid' ? '100%' : '280px',
                                                    height: viewMode === 'grid' ? '250px' : '280px',
                                                    margin: 0,
                                                    display: 'block',
                                                    background: '#f8faf6',
                                                    overflow: 'hidden'
                                                }}>
                                                    <img
                                                        src={p.image_url && p.image_url !== 'no-image.jpg' ? p.image_url : fallbackImg}
                                                        alt={p.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Link>
                                                <div className="info" style={{
                                                    width: viewMode === 'grid' ? '100%' : 'calc(100% - 280px)',
                                                    padding: '1.5rem',
                                                    display: 'flex',
                                                    flexDirection: 'column'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                                                        <span className="cat" style={{ margin: 0, background: 'var(--accent)', color: 'var(--primary)', padding: '0.3rem 0.6rem', borderRadius: '100px', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase' }}>{p.category || 'ESTATE'}</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--creamy)', padding: '0.3rem 0.6rem', borderRadius: '100px' }}>
                                                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                                                            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>{p.rating || '4.9'}</span>
                                                        </div>
                                                    </div>
                                                    <Link to={`/product/${p._id}`}>
                                                        <h3 className="name" style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: '800' }}>{p.name}</h3>
                                                    </Link>

                                                    {/* Farmer Info */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', opacity: 0.8 }}>
                                                        <div style={{ width: '22px', height: '22px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <User size={10} color="var(--primary)" />
                                                        </div>
                                                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-body)' }}>
                                                            Farmer: <span style={{ color: 'var(--primary-light)' }}>{p.seller?.name || 'Estate Direct'}</span>
                                                        </span>
                                                    </div>

                                                    <div className="bottom" style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(22, 66, 60, 0.05)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                                                            <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--primary)' }}>₹{p.price}</span>
                                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700' }}>/ {p.unit || 'kg'}</span>
                                                        </div>
                                                        {(!user || user.role === 'customer') && (
                                                            <button
                                                                onClick={() => addToCart(p)}
                                                                disabled={p.quantity <= 0}
                                                                className="btn btn-primary"
                                                                style={{
                                                                    padding: '0.75rem 1.5rem',
                                                                    borderRadius: '100px',
                                                                    boxShadow: '0 4px 12px rgba(22, 66, 60, 0.1)',
                                                                    background: p.quantity <= 0 ? '#e2e8f0' : 'var(--primary)',
                                                                    color: p.quantity <= 0 ? '#94a3b8' : 'white',
                                                                    cursor: p.quantity <= 0 ? 'not-allowed' : 'pointer',
                                                                    border: 'none'
                                                                }}
                                                            >
                                                                {p.quantity <= 0 ? 'Out of Stock' : 'Reserve'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Marketplace;
