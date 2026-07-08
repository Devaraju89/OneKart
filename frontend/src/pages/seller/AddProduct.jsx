import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Sprout } from 'lucide-react';
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

const AddProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('kg');
    const [category, setCategory] = useState('Vegetables');
    const [image_url, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

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
            await axios.post('/api/products', { name, description, price, quantity, unit, category, image_url });
            toast.success('Product listed!');
            navigate('/seller/products');
        } catch { toast.error('Failed to add product'); }
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
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.65rem', fontWeight: '700', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>Farmer · New Listing</span>
                    </div>
                    <h1 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--parchment)', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: '400', margin: 0 }}>List a New Harvest</h1>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '680px' }}>
                <form className="glass-card" onSubmit={handleSubmit} style={{ padding: '3rem', background: 'var(--cream)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem', padding: '1rem 1.2rem', background: 'rgba(200,147,26,0.1)', border: '1.5px solid rgba(200,147,26,0.3)', borderLeft: '4px solid var(--gold)', borderRadius: '4px' }}>
                        <Sprout size={18} color="var(--gold)" strokeWidth={1.5} />
                        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.88rem', color: 'var(--soil)' }}>
                            Fill in your product details below. Your listing will appear in the marketplace after submission.
                        </p>
                    </div>

                    {/* Product Name */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Product Name</label>
                        <input type="text" placeholder="e.g., Fresh Tomatoes" value={name} onChange={e => setName(e.target.value)} style={inputStyle} onFocus={focusFn} onBlur={blurFn} required />
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>Description</label>
                        <textarea placeholder="Describe your product, growing method, origin…" value={description} onChange={e => setDescription(e.target.value)} rows={4}
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} onFocus={focusFn} onBlur={blurFn} required />
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
                            <input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} onFocus={focusFn} onBlur={blurFn} required />
                        </div>
                        <div>
                            <label style={labelStyle}>Quantity</label>
                            <input type="number" placeholder="0" value={quantity} onChange={e => setQuantity(e.target.value)} style={inputStyle} onFocus={focusFn} onBlur={blurFn} required />
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
                        <input type="text" value={image_url} onChange={e => setImageUrl(e.target.value)} placeholder="Paste image URL…" style={{ ...inputStyle, marginBottom: '0.8rem' }} onFocus={focusFn} onBlur={blurFn} />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.85rem 1.2rem', background: 'var(--parchment-dk)', border: '1.5px dashed var(--border)', borderRadius: '4px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: '0.78rem', fontWeight: '700', color: 'var(--soil)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            <Upload size={16} color="var(--rust)" strokeWidth={2} />
                            {uploading ? 'Uploading…' : 'Upload from device'}
                            <input type="file" onChange={uploadFileHandler} style={{ display: 'none' }} />
                        </label>
                        {image_url && (
                            <div style={{ marginTop: '0.8rem', width: '80px', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1.5px solid var(--border)' }}>
                                <img src={image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(0.15)' }} />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link to="/seller/products" className="btn btn-outline" style={{ padding: '0.9rem 1.8rem', fontSize: '0.85rem' }}>Cancel</Link>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '0.85rem' }}>List Product</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
