import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ShoppingBag, LogOut, User, Menu, X, Package, ShieldCheck, MapPin, Search, Leaf } from 'lucide-react';

import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';
import Profile from './pages/Profile';
import SellerReviews from './pages/seller/Reviews';
import ProductDetails from './pages/ProductDetails';
import Messages from './pages/Messages';

import SellerDashboard from './pages/seller/Dashboard';
import AddProduct from './pages/seller/AddProduct';
import MyProducts from './pages/seller/MyProducts';
import EditProduct from './pages/seller/EditProduct';
import SellerOrders from './pages/seller/SellerOrders';

import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/Users';
import ManageRequests from './pages/admin/Requests';
import ManageOrders from './pages/admin/ManageOrders';
import ManageProducts from './pages/admin/ManageProducts';
import Chatbot from './components/Chatbot';

import AuthContext from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';



const AppContent = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const { cartItems: cart } = useCart();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Pages that have transparent hero headers
    // Always use the solid/glass header state to prevent overlapping text and improve readability
    const headerScrolled = true;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        // Scroll Reveal Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        const observeElements = () => {
            document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
        };

        observeElements();

        // Re-observe if dynamic content changes (snappier detection)
        const timeoutId = setTimeout(observeElements, 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loader"></div>
        </div>
    );

    const navItems = [
        { name: 'Marketplace', path: '/marketplace' },
        ...(user?.role === 'farmer' ? [{ name: 'Dashboard', path: '/seller/dashboard' }] : []),
        ...(user?.role === 'admin' ? [{ name: 'Dashboard', path: '/admin/dashboard' }] : []),
        { name: 'About Us', path: '/about' },
        ...(user?.role === 'customer' ? [{ name: 'Orders', path: '/myorders' }] : []),
        ...(user && user.role !== 'admin' ? [{ name: 'Messages', path: '/messages' }] : []),
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
            <div className="grain-overlay" />

            <header
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                    background: 'var(--glass)',
                    borderBottom: '2px solid var(--border)',
                    padding: '0.5rem 0',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 4px 20px rgba(61,43,31,0.1)'
                }}
            >
                <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                    {/* ── Heritage Logo ── */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        <div style={{
                            background: 'var(--soil)',
                            padding: '0.55rem',
                            borderRadius: '6px',
                            display: 'flex',
                            boxShadow: '3px 3px 0px var(--soil-light)',
                            border: '1.5px solid var(--soil)'
                        }}>
                            <Leaf color="var(--parchment)" size={22} strokeWidth={2} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontSize: '1.6rem',
                                color: 'var(--soil)',
                                fontFamily: "'IM Fell English SC', Georgia, serif",
                                lineHeight: '1',
                                letterSpacing: '0.02em'
                            }}>OneKart</span>
                            <span style={{
                                fontSize: '0.58rem',
                                color: 'var(--rust)',
                                fontFamily: "'Outfit', sans-serif",
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.35em'
                            }}>Organic Estate</span>
                        </div>
                    </Link>

                    {/* ── Nav Links ── */}
                    <div className="nav-menu-desktop" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                        {navItems.map(item => (
                            <Link key={item.path} to={item.path} className="nav-link">
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* ── Right Controls ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRight: '1.5px solid var(--border)', paddingRight: '1.5rem' }}>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    if (searchQuery.trim()) {
                                        navigate(`/marketplace?keyword=${searchQuery}`);
                                        setSearchOpen(false);
                                    }
                                }}
                                style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
                            >
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    background: searchOpen ? 'var(--parchment-dk)' : 'transparent',
                                    borderRadius: '4px',
                                    padding: searchOpen ? '2px 2px 2px 1rem' : '0',
                                    transition: 'all 0.35s ease',
                                    border: searchOpen ? '1.5px solid var(--border)' : '1.5px solid transparent'
                                }}>
                                    <input
                                        type="text" placeholder="Search harvest..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => !searchQuery && setSearchOpen(false)}
                                        style={{
                                            width: searchOpen ? '160px' : '0',
                                            opacity: searchOpen ? 1 : 0,
                                            transition: 'all 0.35s ease',
                                            border: 'none', background: 'transparent',
                                            fontSize: '0.85rem', outline: 'none',
                                            color: 'var(--soil)', fontFamily: "'Lora', serif"
                                        }}
                                    />
                                    <button type="button"
                                        onClick={() => {
                                            if (searchOpen && searchQuery.trim()) {
                                                navigate(`/marketplace?keyword=${searchQuery}`);
                                                setSearchOpen(false);
                                            } else { setSearchOpen(!searchOpen); }
                                        }}
                                        style={{
                                            background: 'transparent', border: 'none',
                                            color: 'var(--soil)', cursor: 'pointer',
                                            display: 'flex', padding: '0.5rem', transition: 'color 0.3s ease'
                                        }}
                                    >
                                        <Search size={18} strokeWidth={2} />
                                    </button>
                                </div>
                            </form>

                            {user?.role === 'customer' && (
                                <Link to="/cart" style={{ position: 'relative', color: 'var(--soil)', display: 'flex' }}>
                                    <ShoppingBag size={22} strokeWidth={2} />
                                    {cart.length > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '-8px', right: '-8px',
                                            background: 'var(--rust)', color: 'white',
                                            fontSize: '0.6rem', width: '17px', height: '17px',
                                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontWeight: '700',
                                            border: '2px solid var(--parchment)'
                                        }}>{cart.length}</span>
                                    )}
                                </Link>
                            )}
                        </div>

                        {user ? (
                            <div className="desktop-user-details" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{
                                        fontSize: '0.88rem', fontWeight: '600',
                                        color: 'var(--soil)', fontFamily: "'Lora', serif"
                                    }}>{user.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: user.role === 'farmer' ? 'var(--sage)' : 'var(--rust)' }} />
                                        <span style={{
                                            fontSize: '0.6rem', color: 'var(--text-muted)',
                                            textTransform: 'uppercase', letterSpacing: '0.15em',
                                            fontFamily: "'Outfit', sans-serif", fontWeight: '700'
                                        }}>{user.role}</span>
                                    </div>
                                </div>
                                <button onClick={handleLogout} style={{
                                    padding: '0.5rem',
                                    border: '1.5px solid var(--border)',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    color: 'var(--soil)',
                                    display: 'flex', alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)',
                                    boxShadow: '2px 2px 0px var(--border)'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--soil)'; e.currentTarget.style.color = 'var(--parchment)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--soil)'; }}
                                >
                                    <LogOut size={17} strokeWidth={2} />
                                </button>
                            </div>
                        ) : (
                            <div className="desktop-user-details" style={{ display: 'flex', gap: '0.6rem' }}>
                                <Link to="/login" className="btn btn-outline" style={{ padding: '0.55rem 1.2rem', fontSize: '0.8rem' }}>Sign In</Link>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.8rem' }}>Join Estate</Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="mobile-menu-btn"
                            style={{
                                background: 'transparent', border: 'none', color: 'var(--soil)',
                                cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center',
                                padding: '0.5rem'
                            }}
                        >
                            {menuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Nav Drawer */}
                {menuOpen && (
                    <div style={{
                        position: 'fixed', top: '70px', left: 0, right: 0,
                        background: 'var(--glass)', borderBottom: '2.5px solid var(--border)',
                        boxShadow: '0 8px 30px rgba(61,43,31,0.1)',
                        backdropFilter: 'blur(16px)', zIndex: 999,
                        display: 'flex', flexDirection: 'column', gap: '1.25rem',
                        padding: '2rem 1.5rem', animation: 'dustFadeIn 0.3s ease-out'
                    }}>
                        {navItems.map(item => (
                            <Link 
                                key={item.path} 
                                to={item.path} 
                                onClick={() => setMenuOpen(false)}
                                style={{ 
                                    fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem',
                                    fontWeight: '700', letterSpacing: '0.12em',
                                    textTransform: 'uppercase', color: 'var(--soil)',
                                    borderBottom: '1px solid rgba(197, 180, 154, 0.3)',
                                    paddingBottom: '0.5rem'
                                }}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {user ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <span style={{ fontFamily: "'Lora', serif", fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>Logged in as: {user.name} ({user.role})</span>
                                <button 
                                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                                    style={{ 
                                        alignSelf: 'flex-start',
                                        fontFamily: "'Outfit', sans-serif", fontSize: '0.85rem',
                                        fontWeight: '700', textTransform: 'uppercase',
                                        color: 'var(--rust)', background: 'transparent',
                                        border: 'none', cursor: 'pointer', padding: '0.5rem 0'
                                    }}
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <Link 
                                    to="/login" 
                                    onClick={() => setMenuOpen(false)}
                                    style={{ 
                                        fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem',
                                        fontWeight: '700', letterSpacing: '0.12em',
                                        textTransform: 'uppercase', color: 'var(--rust)'
                                    }}
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setMenuOpen(false)}
                                    style={{ 
                                        fontFamily: "'Outfit', sans-serif", fontSize: '0.95rem',
                                        fontWeight: '700', letterSpacing: '0.12em',
                                        textTransform: 'uppercase', color: 'var(--soil)'
                                    }}
                                >
                                    Join Estate
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <main style={{ flexGrow: 1, marginTop: 0 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/place-order" element={<PlaceOrder />} />
                    <Route path="/myorders" element={<MyOrders />} />
                    <Route path="/track-order" element={<TrackOrder />} />
                    <Route path="/track-order/:id" element={<TrackOrder />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/messages" element={<Messages />} />

                    {/* Seller Routes */}
                    <Route path="/seller/dashboard" element={<SellerDashboard />} />
                    <Route path="/seller/add-product" element={<AddProduct />} />
                    <Route path="/seller/products" element={<MyProducts />} />
                    <Route path="/seller/edit-product/:id" element={<EditProduct />} />
                    <Route path="/seller/orders" element={<SellerOrders />} />
                    <Route path="/seller/reviews" element={<SellerReviews />} />

                    {/* Admin Routes */}
                    <Route element={<AdminRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/users" element={<ManageUsers />} />
                        <Route path="/admin/requests" element={<ManageRequests />} />
                        <Route path="/admin/orders" element={<ManageOrders />} />
                        <Route path="/admin/products" element={<ManageProducts />} />
                    </Route>
                </Routes>
            </main>

            <footer style={{ background: 'var(--soil)', color: 'var(--parchment)', padding: '5rem 0 2.5rem 0', borderTop: '3px solid var(--border-dk)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")', backgroundBlendMode: 'multiply' }}>
                <div className="container">
                    {/* Footer Brand */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.8fr 1.2fr', gap: '4rem', marginBottom: '4rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ background: 'var(--parchment)', padding: '0.5rem', borderRadius: '4px', boxShadow: '2px 2px 0px var(--border-dk)' }}>
                                    <Leaf color="var(--soil)" size={20} strokeWidth={2} />
                                </div>
                                <span style={{ color: 'var(--parchment)', fontSize: '1.6rem', fontFamily: "'IM Fell English SC', Georgia, serif", letterSpacing: '0.02em' }}>OneKart</span>
                            </div>
                            <p style={{ opacity: 0.75, lineHeight: '1.9', fontSize: '0.95rem', fontFamily: "'Lora', serif", fontStyle: 'italic', marginBottom: '1.5rem', maxWidth: '280px' }}>
                                From the roots of the earth to your table — honest, traditional, nourishing.
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.6 }}>
                                <div style={{ width: '30px', height: '1px', background: 'var(--gold)' }} />
                                <span style={{ fontSize: '0.7rem', fontFamily: "'Outfit', sans-serif", fontWeight: '600', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>Est. 2025</span>
                                <div style={{ width: '30px', height: '1px', background: 'var(--gold)' }} />
                            </div>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--gold-light)', marginBottom: '1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: "'Outfit', sans-serif" }}>Harvest</h4>
                            <ul style={{ listStyle: 'none', display: 'grid', gap: '1rem', opacity: 0.8 }}>
                                {[['Marketplace', '/marketplace'], ['Organic Seeds', '/marketplace?category=Seeds'], ['Organic Tools', '/marketplace?category=Tools']].map(([name, path]) => (
                                    <li key={name}><Link to={path} style={{ color: 'var(--parchment)', fontFamily: "'Lora', serif", fontSize: '0.92rem', opacity: 0.8, transition: 'opacity 0.2s' }}>{name}</Link></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--gold-light)', marginBottom: '1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: "'Outfit', sans-serif" }}>Company</h4>
                            <ul style={{ listStyle: 'none', display: 'grid', gap: '1rem', opacity: 0.8 }}>
                                {[['Our Story', '/about'], ['Contact Us', '/about'], ['Join as Farmer', '/register']].map(([name, path]) => (
                                    <li key={name}><Link to={path} style={{ color: 'var(--parchment)', fontFamily: "'Lora', serif", fontSize: '0.92rem', opacity: 0.8 }}>{name}</Link></li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--gold-light)', marginBottom: '1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.25em', fontFamily: "'Outfit', sans-serif" }}>Field Bulletin</h4>
                            <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '1.2rem', fontFamily: "'Lora', serif", fontStyle: 'italic' }}>Receive seasonal harvest updates from our estates.</p>
                            <div style={{ position: 'relative' }}>
                                <input
                                    placeholder="your@email.com"
                                    style={{
                                        background: 'rgba(245, 239, 215, 0.08)',
                                        border: '1.5px solid rgba(245, 239, 215, 0.25)',
                                        color: 'var(--parchment)', borderRadius: '4px',
                                        padding: '0.85rem 5rem 0.85rem 1.2rem',
                                        width: '100%', fontFamily: "'Lora', serif",
                                        fontSize: '0.88rem', outline: 'none'
                                    }}
                                />
                                <button style={{
                                    position: 'absolute', right: '6px', top: '6px', bottom: '6px',
                                    background: 'var(--gold)', color: 'var(--soil)',
                                    padding: '0 1rem', borderRadius: '3px',
                                    fontFamily: "'Outfit', sans-serif", fontWeight: '700',
                                    fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer',
                                    border: 'none', textTransform: 'uppercase'
                                }}>Sow</button>
                            </div>
                        </div>
                    </div>

                    {/* Aged Divider */}
                    <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(245,239,215,0.2), transparent)', marginBottom: '2rem' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.55, fontSize: '0.8rem', fontFamily: "'Outfit', sans-serif" }}>
                        <p>© 2025 OneKart Organic Estate. All harvests reserved.</p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <Link to="/about" style={{ color: 'var(--parchment)' }}>Privacy</Link>
                            <Link to="/about" style={{ color: 'var(--parchment)' }}>Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>
            <Toaster position="bottom-right" />
            <Chatbot />
        </div>
    );
};

const App = () => {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <CartProvider>
                <AppContent />
            </CartProvider>
        </Router>
    );
};

export default App;
