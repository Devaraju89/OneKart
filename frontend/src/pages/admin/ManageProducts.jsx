import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Search, Edit3, Star, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const PageHeader = ({ eyebrow, title, subtitle }) => (
    <div style={{ background: 'var(--soil)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")', backgroundBlendMode: 'multiply', borderBottom: '3px solid var(--border-dk)', padding: '3rem 0 2.5rem', marginBottom: '4rem' }}>
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.8rem' }}>
                <div style={{ width: '24px', height: '1.5px', background: 'var(--gold)' }} />
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>{eyebrow}</span>
            </div>
            <h1 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--parchment)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '400', margin: 0 }}>{title}</h1>
            {subtitle && <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'rgba(245,239,215,0.65)', fontSize: '0.95rem', marginTop: '0.5rem' }}>{subtitle}</p>}
        </div>
    </div>
);

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try { const { data } = await axios.get('/api/products'); setProducts(data.data); }
        catch { toast.error('Could not fetch catalog'); }
        finally { setLoading(false); }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Remove this listing from the estate catalog?')) {
            try { await axios.delete(`/api/products/${id}`); toast.success('Listing removed'); fetchProducts(); }
            catch { toast.error('Deletion failed'); }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ background: 'var(--parchment)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")', minHeight: '100vh', paddingTop: '80px', paddingBottom: '6rem' }}>
            <PageHeader eyebrow="Admin · Catalog Registry" title="Marketplace Catalog" subtitle="Inventory oversight and quality control for all farm listings." />
            <div className="container">

                {/* Search Bar */}
                <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '2.5rem', background: 'var(--cream)', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                        <Search size={16} strokeWidth={2} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Find by product name or farmer…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', background: 'var(--parchment-dk)', border: '1.5px solid var(--border)', borderRadius: '4px', fontFamily: "'Lora', serif", fontSize: '0.88rem', color: 'var(--soil)', outline: 'none', boxShadow: '2px 2px 0px var(--border)' }} />
                    </div>
                    <div style={{ padding: '0.55rem 1.2rem', background: 'var(--soil)', borderRadius: '4px', boxShadow: '3px 3px 0px var(--soil-light)', fontFamily: "'Outfit', sans-serif", fontWeight: '700', fontSize: '0.75rem', color: 'var(--parchment)', letterSpacing: '0.1em' }}>
                        {products.length} Items Listed
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}><div className="loader" style={{ margin: '0 auto' }} /></div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {filteredProducts.map((product, i) => (
                            <div key={product._id} className="glass-card reveal-up active" style={{ padding: 0, background: 'var(--cream)', overflow: 'hidden', transitionDelay: `${i * 0.05}s` }}>
                                {/* Product Image */}
                                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                                    <img src={product.image_url && product.image_url !== 'no-image.jpg' ? product.image_url : 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400'} alt={product.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.15)' }} />
                                    <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '0.2rem 0.7rem', background: 'rgba(61,43,31,0.75)', border: '1px solid rgba(245,239,215,0.5)', borderRadius: '2px' }}>
                                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--parchment)' }}>{product.category || 'Organic'}</span>
                                    </div>
                                    {product.quantity < 10 && (
                                        <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.2rem 0.7rem', background: 'var(--rust)', borderRadius: '2px' }}>
                                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', fontWeight: '700', textTransform: 'uppercase', color: 'white', letterSpacing: '0.1em' }}>Low Stock</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '0.3rem' }}>
                                        By {product.seller?.name || 'Estate Direct'}
                                    </div>
                                    <h3 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", fontSize: '1.25rem', color: 'var(--soil)', marginBottom: '1rem', fontWeight: '400' }}>{product.name}</h3>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem' }}>
                                        {[['Price', `₹${product.price} / ${product.unit || 'kg'}`], ['Stock', `${product.quantity} kg`]].map(([label, val]) => (
                                            <div key={label} style={{ padding: '0.8rem', background: 'var(--parchment)', border: '1px solid var(--border)', borderRadius: '4px' }}>
                                                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</div>
                                                <div style={{ fontFamily: "'IM Fell English SC', serif", fontSize: '1.1rem', color: label === 'Stock' && product.quantity < 10 ? 'var(--rust)' : 'var(--soil)' }}>{val}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} size={13} fill={s <= Math.round(product.rating || 0) ? 'var(--gold)' : 'none'} color="var(--gold)" />)}
                                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '4px', fontWeight: '600' }}>({product.numReviews})</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to={`/seller/edit-product/${product._id}`} style={{
                                                padding: '0.5rem', background: 'var(--parchment-dk)', border: '1.5px solid var(--border)', borderRadius: '4px', color: 'var(--soil)', display: 'inline-flex', boxShadow: '2px 2px 0px var(--border)', transition: 'all 0.2s ease'
                                            }}><Edit3 size={16} strokeWidth={2} /></Link>
                                            <button onClick={() => deleteProduct(product._id)} style={{
                                                padding: '0.5rem', background: 'rgba(193,68,14,0.08)', border: '1.5px solid rgba(193,68,14,0.25)', borderRadius: '4px', color: 'var(--rust)', cursor: 'pointer', display: 'flex', boxShadow: '2px 2px 0px rgba(193,68,14,0.1)', transition: 'all 0.2s ease'
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--rust)'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(193,68,14,0.08)'; e.currentTarget.style.color = 'var(--rust)'; }}
                                            ><Trash2 size={16} strokeWidth={2} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProducts;
