import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';

const inputStyle = {
    width: '100%', padding: '0.9rem 1rem', borderRadius: '4px',
    background: 'var(--parchment-dk)', border: '1.5px solid var(--border)',
    outline: 'none', color: 'var(--soil)', fontSize: '0.9rem',
    fontFamily: "'Lora', serif", boxShadow: '2px 2px 0px var(--border)',
    transition: 'border-color 0.25s ease'
};
const labelStyle = {
    display: 'block', fontFamily: "'Outfit', sans-serif",
    fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase',
    letterSpacing: '0.2em', color: 'var(--soil)', marginBottom: '0.5rem'
};
const focusFn = (e) => { e.target.style.borderColor = 'var(--rust)'; };
const blurFn = (e) => { e.target.style.borderColor = 'var(--border)'; };

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('kg');
    const [category, setCategory] = useState('Vegetables');
    const [image_url, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                const p = data.data;
                setName(p.name); setPrice(p.price); setDescription(p.description);
                setQuantity(p.quantity); setUnit(p.unit || 'kg');
                setCategory(p.category || 'Vegetables'); setImageUrl(p.image_url);
            } catch { toast.error('Error fetching product'); navigate('/seller/products'); }
        };
        fetchProduct();
    }, [id, navigate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);
        try {
            const { data } = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setImageUrl(data.image_path);
            toast.success('Image uploaded!');
        } catch { toast.error('Image upload failed'); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/products/${id}`, { name, price, description, quantity, unit, category, image_url });
            toast.success('Product updated!');
            navigate('/seller/products');
        } catch { toast.error('Update failed'); }
    };

    return (
        <div style={{ background: 'var(--parchment)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")', minHeight: '100vh', paddingTop: '80px', paddingBottom: '6rem' }}>
            {/* Header */}
            <div style={{ background: 'var(--soil)', backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")', backgroundBlendMode: 'multiply', borderBottom: '3px solid var(--border-dk)', padding: '3rem 0 2.5rem', marginBottom: '4rem' }}>
                <div className="container" style={{ maxWidth: '680px' }}>
                    <Link to="/seller/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(245,239,215,0.6)', fontFamily: "'Outfit', sans-serif", fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                        <ArrowLeft size={15} /> Back to My Products
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '0.8rem' }}>
                        <div style={{ width: '24px', height: '1.5px', background: 'var(--gold)' }} />
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>Farmer · Edit Listing</span>
                    </div>
                    <h1 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--parchment)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '400', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Edit3 size={28} strokeWidth={1.5} style={{ opacity: 0.7 }} />
                        Update Listing
                    </h1>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '680px' }}>
                <form className="glass-card" onSubmit={handleSubmit} style={{ padding: '3rem', background: 'var(--cream)' }}>

                    {/* Product Name */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Product Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} onFocus={focusFn} onBlur={blurFn} />
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focusFn} onBlur={blurFn}>
                            {['Vegetables', 'Fruits', 'Seeds', 'Organic Dairy', 'Tools'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Price + Quantity + Unit */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={labelStyle}>Price (₹)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
                        </div>
                        <div>
                            <label style={labelStyle}>Quantity</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} style={inputStyle} onFocus={focusFn} onBlur={blurFn} />
                        </div>
                        <div>
                            <label style={labelStyle}>Unit</label>
                            <select value={unit} onChange={e => setUnit(e.target.value)} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={focusFn} onBlur={blurFn}>
                                <option value="kg">Kilogram (kg)</option>
                                <option value="g">Gram (g)</option>
                                <option value="piece">Single Piece</option>
                                <option value="dozen">Dozen</option>
                                <option value="bundle">Bundle</option>
                            </select>
                        </div>
                    </div>

                    {/* Image */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={labelStyle}>Product Image</label>
                        {image_url && (
                            <div style={{ marginBottom: '0.8rem', width: '100px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1.5px solid var(--border)' }}>
                                <img src={image_url} alt="Current" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.15)' }} />
                            </div>
                        )}
                        <input type="text" value={image_url} onChange={e => setImageUrl(e.target.value)} placeholder="Paste image URL…" style={{ ...inputStyle, marginBottom: '0.8rem' }} onFocus={focusFn} onBlur={blurFn} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.85rem 1.2rem', background: 'var(--parchment-dk)', border: '1.5px dashed var(--border)', borderRadius: '4px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', fontWeight: '700', color: 'var(--soil)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            <Upload size={16} color="var(--rust)" strokeWidth={2} />
                            {uploading ? 'Uploading…' : 'Replace image'}
                            <input type="file" onChange={uploadFileHandler} style={{ display: 'none' }} />
                        </label>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link to="/seller/products" className="btn btn-outline" style={{ padding: '0.9rem 1.8rem', fontSize: '0.85rem' }}>Cancel</Link>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '0.85rem' }}>Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
