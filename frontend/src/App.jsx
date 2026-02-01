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
    const location = useLocation();

    // Pages that have transparent hero headers
    const isHeroPage = location.pathname === '/' || location.pathname === '/marketplace';
    const headerScrolled = scrolled || !isHeroPage;

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
                className={headerScrolled ? 'header-scrolled' : ''}
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                    background: headerScrolled ? 'var(--glass)' : 'transparent',
                    borderBottom: headerScrolled ? '1px solid var(--glass-border)' : 'none',
                    padding: headerScrolled ? '0.6rem 0' : '1.2rem 0',
                    transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                    backdropFilter: headerScrolled ? 'blur(20px)' : 'none',
                    boxShadow: headerScrolled ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
                }}
            >
                <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        zIndex: 10,
                        textDecoration: 'none'
                    }}>
                        <div style={{
                            background: headerScrolled ? 'var(--primary)' : 'var(--creamy)',
                            padding: '0.7rem',
                            borderRadius: '16px',
                            display: 'flex',
                            boxShadow: headerScrolled ? '0 4px 15px rgba(22, 66, 60, 0.2)' : '0 4px 15px rgba(0,0,0,0.1)',
                            transform: headerScrolled ? 'scale(0.9)' : 'scale(1)',
                            transition: 'var(--transition)'
                        }}>
                            <Leaf color={headerScrolled ? 'var(--creamy)' : 'var(--primary)'} size={24} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{
                                fontSize: '1.8rem',
                                fontWeight: '900',
                                color: headerScrolled ? 'var(--primary)' : 'var(--creamy)',
                                fontFamily: "'Playfair Display', serif",
                                letterSpacing: '-0.04em',
                                lineHeight: '1',
                                transition: 'color 0.4s ease'
                            }}>OneKart</span>
                            <span style={{
                                fontSize: '0.65rem',
                                color: headerScrolled ? 'var(--primary-light)' : 'rgba(250, 250, 238, 0.7)',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3em',
                                opacity: headerScrolled ? 1 : 1,
                                height: headerScrolled ? 'auto' : 'auto', // Keep auto height for both states
                                overflow: 'hidden',
                                transition: 'var(--transition)'
                            }}>Estate Registry</span>
                        </div>
                    </Link>

                    <div style={{
                        display: 'flex',
                        gap: '3rem',
                        alignItems: 'center',
                        background: headerScrolled ? 'rgba(22, 66, 60, 0.03)' : 'transparent',
                        padding: headerScrolled ? '0.5rem 2rem' : '0',
                        borderRadius: '100px',
                        transition: 'all 0.4s ease'
                    }}>
                        {navItems.map(item => (
                            <Link key={item.path} to={item.path} className="nav-link" style={{
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                color: headerScrolled ? 'var(--primary)' : 'var(--creamy)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                transition: 'color 0.4s ease'
                            }}>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRight: `1px solid ${headerScrolled ? 'var(--border)' : 'rgba(250,250,238,0.2)'}`, paddingRight: '1.5rem' }}>
                            {/* Functional Search Bar */}
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
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: searchOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    borderRadius: '100px',
                                    padding: searchOpen ? '2px 2px 2px 1.2rem' : '0',
                                    transition: 'all 0.4s ease',
                                    border: searchOpen ? `1px solid ${headerScrolled ? 'var(--border)' : 'rgba(250,250,238,0.4)'}` : '1px solid transparent'
                                }}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => !searchQuery && setSearchOpen(false)}
                                        style={{
                                            width: searchOpen ? '180px' : '0',
                                            opacity: searchOpen ? 1 : 0,
                                            transition: 'all 0.4s ease',
                                            border: 'none',
                                            background: 'transparent',
                                            fontSize: '0.85rem',
                                            outline: 'none',
                                            color: headerScrolled ? 'var(--primary)' : 'var(--creamy)',
                                            fontWeight: '600'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (searchOpen && searchQuery.trim()) {
                                                navigate(`/marketplace?keyword=${searchQuery}`);
                                                setSearchOpen(false);
                                            } else {
                                                setSearchOpen(!searchOpen);
                                            }
                                        }}
                                        style={{
                                            background: searchOpen ? (headerScrolled ? 'var(--primary)' : 'var(--creamy)') : 'transparent',
                                            border: 'none',
                                            color: searchOpen ? (headerScrolled ? 'white' : 'var(--primary)') : (headerScrolled ? 'var(--primary)' : 'var(--creamy)'),
                                            cursor: 'pointer',
                                            display: 'flex',
                                            padding: '0.6rem',
                                            borderRadius: '50%',
                                            transition: 'var(--transition)'
                                        }}
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                            </form>

                            {user?.role === 'customer' && (
                                <Link to="/cart" style={{ position: 'relative', color: headerScrolled ? 'var(--primary)' : 'var(--creamy)', transition: 'var(--transition)' }}>
                                    <ShoppingBag size={22} />
                                    {cart.length > 0 && (
                                        <span style={{
                                            position: 'absolute', top: '-10px', right: '-10px',
                                            background: 'var(--primary-light)', color: 'white',
                                            fontSize: '0.65rem', width: '18px', height: '18px',
                                            borderRadius: '50%', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontWeight: '900',
                                            boxShadow: '0 4px 10px rgba(106, 156, 137, 0.4)',
                                            border: '2px solid var(--bg-main)'
                                        }}>{cart.length}</span>
                                    )}
                                </Link>
                            )}
                        </div>

                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: headerScrolled ? 'var(--primary)' : 'var(--creamy)', letterSpacing: '-0.01em' }}>{user.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: user.role === 'farmer' ? '#10b981' : '#3b82f6' }} />
                                        <span style={{ fontSize: '0.65rem', color: headerScrolled ? 'var(--text-muted)' : 'rgba(250, 250, 238, 0.6)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800' }}>{user.role}</span>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="btn-outline" style={{
                                    padding: '0.6rem',
                                    borderRadius: '14px',
                                    border: `1.5px solid ${headerScrolled ? 'var(--border)' : 'rgba(250, 250, 238, 0.3)'}`,
                                    background: headerScrolled ? 'white' : 'transparent',
                                    color: headerScrolled ? 'var(--primary)' : 'var(--creamy)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'var(--transition)'
                                }}>
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link to="/login" className="btn-outline" style={{
                                    padding: '0.7rem 1.5rem',
                                    fontSize: '0.85rem',
                                    background: 'transparent',
                                    color: headerScrolled ? 'var(--primary)' : 'var(--creamy)',
                                    borderColor: headerScrolled ? 'var(--border)' : 'rgba(250, 250, 238, 0.4)',
                                    fontWeight: '800'
                                }}>Member Login</Link>
                                <Link to="/register" className="btn btn-primary" style={{
                                    padding: '0.7rem 1.5rem',
                                    fontSize: '0.85rem',
                                    boxShadow: '0 4px 15px rgba(22, 66, 60, 0.2)'
                                }}>Registry Access</Link>
                            </div>
                        )}
                    </div>
                </nav>
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

            <footer style={{ background: 'var(--primary)', color: 'var(--creamy)', padding: '6rem 0 3rem 0' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr', gap: '4rem', marginBottom: '5rem' }}>
                        <div className="reveal">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'var(--creamy)', padding: '0.5rem', borderRadius: '10px' }}>
                                    <Leaf color="var(--primary)" size={20} />
                                </div>
                                <h3 style={{ color: 'var(--creamy)', fontSize: '1.8rem', letterSpacing: '-0.02em', margin: 0 }}>OneKart</h3>
                            </div>
                            <p style={{ opacity: 0.7, lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '2rem' }}>
                                Connecting discerning collectors with the world's most exceptional, sustainable estate harvests.
                            </p>
                        </div>
                        <div className="reveal" style={{ transitionDelay: '0.1s' }}>
                            <h4 style={{ color: 'var(--creamy)', marginBottom: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Collection</h4>
                            <ul style={{ listStyle: 'none', display: 'grid', gap: '1.2rem', opacity: 0.8 }}>
                                <li><Link to="/marketplace" className="nav-link">Private Reserve</Link></li>
                                <li><Link to="/marketplace" className="nav-link">Seasonal Harvest</Link></li>
                                <li><Link to="/marketplace" className="nav-link">Estate Tools</Link></li>
                            </ul>
                        </div>
                        <div className="reveal" style={{ transitionDelay: '0.2s' }}>
                            <h4 style={{ color: 'var(--creamy)', marginBottom: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Company</h4>
                            <ul style={{ listStyle: 'none', display: 'grid', gap: '1.2rem', opacity: 0.8 }}>
                                <li><Link to="/" className="nav-link">Our Story</Link></li>
                                <li><Link to="/" className="nav-link">Impact Report</Link></li>
                                <li><Link to="/" className="nav-link">Contact</Link></li>
                            </ul>
                        </div>
                        <div className="reveal" style={{ transitionDelay: '0.3s' }}>
                            <h4 style={{ color: 'var(--creamy)', marginBottom: '2rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Estate Newsletter</h4>
                            <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>Join the registry for release updates.</p>
                            <div style={{ position: 'relative' }}>
                                <input placeholder="estate@domain.com" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '100px', padding: '1rem 1.5rem', width: '100%' }} />
                                <button style={{ position: 'absolute', right: '8px', top: '8px', bottom: '8px', background: 'var(--creamy)', color: 'var(--primary)', padding: '0 1.2rem', borderRadius: '100px', fontWeight: '700', fontSize: '0.8rem' }}>Join</button>
                            </div>
                        </div>
                    </div>
                    <div style={{ paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6, fontSize: '0.85rem' }}>
                        <p>© 2026 OneKart Estate Commerce. All rights preserved.</p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <span>Privacy Protocol</span>
                            <span>Terms of Service</span>
                        </div>
                    </div>
                </div>
            </footer>
            <Toaster position="bottom-right" />
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
