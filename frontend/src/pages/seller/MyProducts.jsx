import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft, RefreshCw, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const PageHeader = ({ eyebrow, title, subtitle, extra }) => (
    <div style={{
        background: 'var(--soil)',
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")',
        backgroundBlendMode: 'multiply',
        borderBottom: '3px solid var(--border-dk)',
        padding: '3rem 0 2.5rem', marginBottom: '4rem'
    }}>
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.8rem' }}>
                        <div style={{ width: '24px', height: '1.5px', background: 'var(--gold)' }} />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>{eyebrow}</span>
                    </div>
                    <h1 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--parchment)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '400', margin: 0 }}>{title}</h1>
                    {subtitle && <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'rgba(245,239,215,0.65)', fontSize: '0.95rem', marginTop: '0.5rem' }}>{subtitle}</p>}
                </div>
                {extra}
            </div>
        </div>
    </div>
);

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        try {
            const { data } = await axios.get('/api/products');
            const myProds = data.data.filter(p => p.seller && (p.seller._id === user.id || p.seller === user.id));
            setProducts(myProds);
        } catch (error) {
            console.error(error);
            toast.error('Failed to sync catalog');
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Strike this listing from your estate catalog?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    return (
        <div style={{
            background: 'var(--parchment)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
            minHeight: '100vh',
            paddingTop: '80px',
            paddingBottom: '6rem'
        }}>
            <PageHeader
                eyebrow="Farmer · Inventory Ledger"
                title="My Products"
                subtitle="Browse, update, and manage the active offerings of your estate."
                extra={
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        <Link to="/seller/dashboard" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.3rem', fontSize: '0.8rem' }}>
                            <ArrowLeft size={15} /> Dashboard
                        </Link>
                        <Link to="/seller/add-product" className="btn" style={{
                            background: 'var(--gold)', color: 'var(--soil)', border: '2px solid var(--gold)',
                            padding: '0.65rem 1.4rem', fontFamily: "'Outfit', sans-serif", fontWeight: '700',
                            fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                            boxShadow: '3px 3px 0px rgba(61,43,31,0.25)', borderRadius: '4px'
                        }}>
                            <Plus size={16} /> Add Product
                        </Link>
                    </div>
                }
            />

            <div className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div className="loader" style={{ margin: '0 auto' }} />
                    </div>
                ) : products.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--cream)' }}>
                        <div style={{ width: '90px', height: '90px', background: 'var(--parchment-dk)', border: '1.5px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '3px 3px 0px var(--border)', color: 'var(--text-muted)' }}>
                            <ImageIcon size={44} strokeWidth={1.5} />
                        </div>
                        <h2 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--soil)', fontWeight: '400', marginBottom: '1rem' }}>Your catalog is empty</h2>
                        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto', lineHeight: '1.7' }}>
                            List your first organic product or seed variety to begin selling to the community!
                        </p>
                    </div>
                ) : (
                    <div className="glass-card" style={{ overflow: 'hidden', background: 'var(--cream)', padding: 0 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'var(--parchment-dkr)', borderBottom: '2px solid var(--border)' }}>
                                    {['Harvest Image', 'Name', 'Price', 'Stock Level', 'Actions'].map((h, idx) => (
                                        <th key={h} style={{
                                            padding: '1.2rem 2rem', textAlign: idx === 4 ? 'right' : 'left',
                                            fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem',
                                            fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em',
                                            color: 'var(--text-muted)'
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, idx) => (
                                    <tr key={product._id} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? 'var(--cream)' : 'var(--parchment)' }}>
                                        <td style={{ padding: '1.3rem 2rem' }}>
                                            <div style={{
                                                width: '56px', height: '56px', borderRadius: '4px',
                                                overflow: 'hidden', border: '1.5px solid var(--border)',
                                                background: 'var(--parchment-dk)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <img
                                                    src={product.image_url || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=150'}
                                                    alt={product.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.15)' }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.3rem 2rem' }}>
                                            <div style={{ fontFamily: "'Lora', serif", fontWeight: '600', color: 'var(--soil)', fontSize: '0.95rem' }}>{product.name}</div>
                                            <span style={{
                                                display: 'inline-block', fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem',
                                                fontWeight: '700', textTransform: 'uppercase', color: 'var(--rust)', letterSpacing: '0.05em', marginTop: '0.2rem'
                                            }}>{product.category || 'ESTATE DIRECT'}</span>
                                        </td>
                                        <td style={{ padding: '1.3rem 2rem' }}>
                                            <div style={{ fontFamily: "'IM Fell English SC', serif", fontSize: '1.25rem', color: 'var(--soil)' }}>₹{product.price}</div>
                                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>per {product.unit || 'kg'}</span>
                                        </td>
                                        <td style={{ padding: '1.3rem 2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{
                                                    width: '6px', height: '6px', borderRadius: '50%',
                                                    background: product.quantity < 20 ? 'var(--rust)' : 'var(--sage)',
                                                    boxShadow: `0 0 6px ${product.quantity < 20 ? 'var(--rust)' : 'var(--sage)'}`
                                                }} />
                                                <span style={{
                                                    fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: '700',
                                                    color: product.quantity < 20 ? 'var(--rust)' : 'var(--soil)'
                                                }}>
                                                    {product.quantity} {product.unit || 'kg'}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.3rem 2rem', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                                <Link to={`/seller/edit-product/${product._id}`} style={{
                                                    padding: '0.5rem', background: 'var(--parchment-dk)', border: '1.5px solid var(--border)', borderRadius: '4px', color: 'var(--soil)', display: 'inline-flex', boxShadow: '2px 2px 0px var(--border)', transition: 'all 0.2s ease'
                                                }}><Edit3 size={16} strokeWidth={2} /></Link>
                                                <button
                                                    onClick={() => deleteHandler(product._id)}
                                                    style={{
                                                        padding: '0.5rem', background: 'rgba(193,68,14,0.08)',
                                                        border: '1.5px solid rgba(193,68,14,0.25)', borderRadius: '4px',
                                                        color: 'var(--rust)', cursor: 'pointer', display: 'inline-flex',
                                                        transition: 'all 0.25s ease', boxShadow: '2px 2px 0px rgba(193,68,14,0.1)'
                                                    }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--rust)'; e.currentTarget.style.color = 'white'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(193,68,14,0.08)'; e.currentTarget.style.color = 'var(--rust)'; }}
                                                >
                                                    <Trash2 size={16} strokeWidth={2} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProducts;
