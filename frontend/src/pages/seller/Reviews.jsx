import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, MessageSquare, Package, User, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get('/api/products/seller/reviews');
                setReviews(data.data);
            } catch (err) {
                toast.error("Could not fetch feedback");
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 0' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>Customer Feedback</h1>
                        <p style={{ color: 'var(--text-muted)' }}>What the community thinks about your harvest</p>
                    </div>
                    {reviews.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem 2rem', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>Global Rating</div>
                                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)' }}>{averageRating} / 5.0</div>
                            </div>
                            <Star size={32} fill="#f59e0b" color="#f59e0b" />
                        </div>
                    )}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>
                        <div className="loader"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                        <div style={{ width: '80px', height: '80px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <MessageSquare size={40} />
                        </div>
                        <h3>No feedback yet</h3>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '1rem auto 0' }}>Deliver your first harvest to start building your farm's reputation.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review) => (
                            <div key={review._id} className="card animate-fade" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 3fr 1fr', gap: '3rem', alignItems: 'start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '40px', height: '40px', background: '#e0e7ff', color: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{review.name.charAt(0)}</div>
                                        <div>
                                            <div style={{ fontWeight: '800', fontSize: '1rem' }}>{review.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Customer</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill={i < review.rating ? "#f59e0b" : "none"} color="#f59e0b" />
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        <Calendar size={14} /> {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div style={{ borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9', padding: '0 3rem' }}>
                                    <div style={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#334155', lineHeight: '1.6' }}>
                                        "{review.comment}"
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Item Reviewed</div>
                                    <Link to={`/product/${review.productId}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end', fontWeight: '800', color: 'var(--primary)' }}>
                                        {review.productName} <ExternalLink size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerReviews;
