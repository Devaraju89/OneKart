import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('kg');
    const [image_url, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            setImageUrl(data.image_path);
            setUploading(false);
            toast.success('Image uploaded!');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/products', {
                name, description, price, quantity, unit, image_url
            });
            toast.success('Product Added');
            navigate('/seller/products');
        } catch (error) {
            toast.error('Failed to add product');
        }
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', maxWidth: '600px' }}>
            <h1>Add Product</h1>
            <form className="card" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }}></textarea>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Price</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Unit of Measurement</label>
                    <select value={unit} onChange={e => setUnit(e.target.value)} required style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="kg">Kilogram (kg)</option>
                        <option value="g">Gram (g)</option>
                        <option value="piece">Single Piece</option>
                        <option value="dozen">Dozen (12 pcs)</option>
                        <option value="bundle">Bundle</option>
                    </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Image</label>
                    <input
                        type="text"
                        value={image_url}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="Enter URL or upload file"
                        style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
                    />
                    <input
                        type="file"
                        onChange={uploadFileHandler}
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                    {uploading && <p>Uploading...</p>}
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
