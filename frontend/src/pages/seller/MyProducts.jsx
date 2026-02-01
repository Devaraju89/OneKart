import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        try {
            const { data } = await axios.get('/api/products');
            // Assuming data.data is an array of products
            const myProds = data.data.filter(p => p.seller && (p.seller._id === user.id || p.seller === user.id));
            setProducts(myProds);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await axios.delete(`/api/products/${id}`);
                toast.success('Product Deleted');
                fetchProducts();
            } catch (error) {
                toast.error('Failed to delete');
            }
        }
    };

    return (
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>My Products</h1>
                <Link to="/seller/add-product" className="btn btn-primary">Add Product</Link>
            </div>

            <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '10px' }}>Image</th>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Price</th>
                        <th style={{ padding: '10px' }}>Stock</th>
                        <th style={{ padding: '10px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>
                                <img
                                    src={product.image_url || 'https://placehold.co/50x50?text=No+Img'}
                                    alt={product.name}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                                />
                            </td>
                            <td style={{ padding: '10px' }}>{product.name}</td>
                            <td style={{ padding: '10px' }}>₹{product.price}</td>
                            <td style={{ padding: '10px' }}>{product.quantity}</td>
                            <td style={{ padding: '10px' }}>
                                <Link to={`/seller/edit-product/${product._id}`} className="btn btn-secondary" style={{ marginRight: '10px' }}>Edit</Link>
                                <button className="btn" style={{ background: 'red', color: 'white' }} onClick={() => deleteHandler(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyProducts;
