import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Trash2, Search, Edit3, Star, ShoppingBag, AlertCircle, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/products');
            setProducts(data.data);
        } catch (error) {
            toast.error("Inventory Insight: Could not fetch catalog");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Strike this item from the platform catalog?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                toast.success('Catalog entry removed');
                fetchProducts();
            } catch (error) {
                toast.error('Deletion failed: Access denied');
            }
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.seller?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '8rem 0 4rem 0' }}>
            <div className="container">
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Marketplace Catalog</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Inventory oversight and quality control for all farm listings</p>
                </div>

                <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Find product by name or farmer identity..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '1.2rem', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: '700' }}>
                        {products.length} Items Listed
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="loader"></div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {filteredProducts.map((product) => (
                            <div key={product._id} className="card animate-fade" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '1.5rem' }}>
                                    <img
                                        src={product.image_url && product.image_url !== 'no-image.jpg' ? product.image_url : 'https://placehold.co/100x100?text=Item'}
                                        alt=""
                                        style={{ width: '80px', height: '80px', borderRadius: '15px', objectFit: 'cover', border: '1px solid #f1f5f9' }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{product.category || 'Fresh Harvest'}</div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', fontWeight: '800' }}>{product.name}</h3>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Sold by <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{product.seller?.name || 'Local Farm'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1.2rem', background: '#f8fafc', borderRadius: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Price</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '900' }}>₹{product.price}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Volume</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: product.quantity < 10 ? '#dc2626' : 'inherit' }}>{product.quantity} kg</div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: '800' }}>
                                        <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                        {product.rating ? product.rating.toFixed(1) : 'New'}
                                        <span style={{ fontWeight: '400', color: 'var(--text-muted)', marginLeft: '4px' }}>({product.numReviews})</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                                        <Link to={`/seller/edit-product/${product._id}`} style={{ padding: '0.6rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: '0.8rem', color: '#64748b' }}>
                                            <Edit3 size={18} />
                                        </Link>
                                        <button
                                            onClick={() => deleteProduct(product._id)}
                                            style={{ padding: '0.6rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.8rem', color: '#ef4444', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
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
