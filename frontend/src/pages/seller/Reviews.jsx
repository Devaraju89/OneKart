import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, MessageSquare, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const SellerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get('/api/products/seller/reviews');
                setReviews(data.data || []);
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
        <div style={{
            background: 'var(--parchment)',
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")',
            minHeight: '100vh',
            paddingTop: '80px',
            paddingBottom: '6rem'
        }}>
            <PageHeader
                eyebrow="Farmer · Guestbook"
                title="Customer Feedback"
                subtitle="Read what the community has to say about your harvest and products."
                extra={
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                        <Link to="/seller/dashboard" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.3rem', fontSize: '0.8rem' }}>
                            <ArrowLeft size={15} /> Dashboard
                        </Link>
                        {reviews.length > 0 && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.8rem',
                                background: 'var(--cream)', padding: '0.5rem 1.2rem',
                                border: '1.5px solid var(--border)', borderRadius: '4px',
                                boxShadow: '3px 3px 0px var(--border)'
                            }}>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average Rating</div>
                                    <div style={{ fontFamily: "'IM Fell English SC', serif", fontSize: '1.25rem', color: 'var(--soil)', fontWeight: '600' }}>{averageRating} / 5.0</div>
                                </div>
                                <Star size={24} fill="var(--gold)" color="var(--gold)" />
                            </div>
                        )}
                    </div>
                }
            />

            <div className="container">
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '6rem' }}>
                        <div className="loader" style={{ margin: '0 auto' }} />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--cream)' }}>
                        <div style={{ width: '90px', height: '90px', background: 'var(--parchment-dk)', border: '1.5px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '3px 3px 0px var(--border)', color: 'var(--text-muted)' }}>
                            <MessageSquare size={44} strokeWidth={1.5} />
                        </div>
                        <h2 style={{ fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--soil)', fontWeight: '400', marginBottom: '1rem' }}>No feedback yet</h2>
                        <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto', lineHeight: '1.7' }}>
                            Deliver your first harvest to start building your farm's reputational ledger.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.8rem' }}>
                        {reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((review, i) => (
                            <div key={review._id} className="glass-card reveal-up active" style={{
                                padding: '2.5rem', background: 'var(--cream)',
                                display: 'grid', gridTemplateColumns: '1.2fr 2fr 1fr',
                                gap: '3rem', alignItems: 'start',
                                transitionDelay: `${i * 0.05}s`
                            }}>
                                {/* Reviewer & Stars */}
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                                        <div style={{
                                            width: '40px', height: '40px', background: 'var(--soil)',
                                            color: 'var(--parchment)', borderRadius: '4px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontFamily: "'IM Fell English SC', serif", fontSize: '1.1rem',
                                            boxShadow: '2px 2px 0px var(--soil-light)', flexShrink: 0
                                        }}>
                                            {review.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: "'Lora', serif", fontWeight: '600', color: 'var(--soil)', fontSize: '0.95rem' }}>{review.name}</div>
                                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'var(--rust)', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Verified Customer</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.8rem' }}>
                                        {[...Array(5)].map((_, idx) => (
                                            <Star key={idx} size={15} fill={idx < review.rating ? "var(--gold)" : "none"} color="var(--gold)" />
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: "'Outfit', sans-serif", fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        <Calendar size={13} /> {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div style={{ borderLeft: '1.5px solid var(--border)', borderRight: '1.5px solid var(--border)', padding: '0 2.5rem', minHeight: '80px', display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--soil)', lineHeight: '1.7' }}>
                                        "{review.comment}"
                                    </div>
                                </div>

                                {/* Sourced Item */}
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Item Reviewed</span>
                                    <Link to={`/product/${review.productId}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', fontFamily: "'IM Fell English SC', serif", fontSize: '1.15rem', color: 'var(--rust)', textDecoration: 'none', marginTop: '0.4rem' }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--soil)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--rust)'}>
                                        {review.productName} <ExternalLink size={13} strokeWidth={2} />
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
