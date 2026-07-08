import React, { useEffect } from 'react';
import { ArrowLeft, Leaf, Heart, Users, Wheat, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const pillars = [
        {
            icon: Leaf,
            title: "100% Pure Harvest",
            text: "Zero preservatives. Zero middlemen. Just fresh, soil-traced produce delivered from the estate to your doorstep, the way nature intended."
        },
        {
            icon: Users,
            title: "Empowering Farmers",
            text: "We connect you directly with the growers, ensuring they receive the fair value they deserve for a lifetime of hard, honest labour."
        },
        {
            icon: Heart,
            title: "Community First",
            text: "Building a sustainable ecosystem where every purchase supports local agriculture, indigenous seed varieties, and healthier family lifestyles."
        },
    ];

    return (
        <div style={{ background: 'var(--bg-main)', minHeight: '100vh', backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }}>

            {/* ── Heritage Banner ── */}
            <div style={{
                position: 'relative', height: '42vh', minHeight: '320px', overflow: 'hidden',
                paddingTop: '70px', display: 'flex', alignItems: 'center'
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2000")',
                    backgroundSize: 'cover', backgroundPosition: 'center 25%',
                    filter: 'sepia(0.25) contrast(1.05)'
                }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(61,43,31,0.92) 45%, rgba(61,43,31,0.5) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, var(--parchment), transparent)' }} />

                <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(245,239,215,0.65)', fontFamily: "'Outfit', sans-serif", fontSize: '0.8rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem' }}>
                        <ArrowLeft size={16} /> Return Home
                    </Link>

                    <div className="hero-fade-in">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
                            <div style={{ width: '30px', height: '1.5px', background: 'var(--gold)' }} />
                            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>Est. 1996 · Our Heritage</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--parchment)', fontWeight: '400', lineHeight: '1.15' }}>
                            The OneKart Story.
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '8rem' }}>

                {/* ── Mission Quote ── */}
                <div className="reveal-up" style={{ maxWidth: '750px', margin: '5rem auto', textAlign: 'center' }}>
                    <div style={{ width: '50px', height: '50px', background: 'var(--parchment-dk)', border: '1.5px solid var(--border)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '3px 3px 0px var(--border)' }}>
                        <Leaf color="var(--rust)" size={24} strokeWidth={1.5} />
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--soil)', marginBottom: '1.5rem', lineHeight: '1.35' }}>
                        We are here to flip the script.<br />
                        <span style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontWeight: '400', color: 'var(--rust)', fontSize: '0.8em' }}>No middlemen. No old stock. Just the farmer.</span>
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-body)', fontFamily: "'Lora', serif", lineHeight: '1.85', opacity: 0.9 }}>
                        We deliver the freshest harvest straight from the soil to your soul — preserving a legacy of traditional, chemical-free farming that has nourished communities across Karnataka for over three decades.
                    </p>
                </div>

                {/* ── Aged Divider ── */}
                <div style={{ width: '100%', height: '1.5px', background: 'linear-gradient(to right, transparent, var(--border-dk), transparent)', marginBottom: '5rem' }} />

                {/* ── Pillars ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', marginBottom: '6rem' }}>
                    {pillars.map((item, i) => (
                        <div key={i} className="reveal-up glass-card" style={{
                            padding: '3rem 2.5rem', textAlign: 'center',
                            background: 'var(--cream)', transitionDelay: `${i * 0.1}s`
                        }}>
                            <div style={{
                                width: '66px', height: '66px',
                                background: 'var(--parchment-dk)',
                                border: '1.5px solid var(--border)', borderRadius: '4px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 2rem',
                                boxShadow: '3px 3px 0px var(--border)',
                                color: 'var(--rust)'
                            }}>
                                <item.icon size={28} strokeWidth={1.5} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontFamily: "'IM Fell English SC', Georgia, serif", color: 'var(--soil)', marginBottom: '1rem', fontWeight: '400' }}>
                                {item.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontFamily: "'Lora', serif", fontStyle: 'italic', lineHeight: '1.75', fontSize: '0.95rem' }}>
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Heritage Quote Banner ── */}
                <div className="reveal-up" style={{
                    position: 'relative',
                    background: 'var(--soil)',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")',
                    backgroundBlendMode: 'multiply',
                    borderRadius: '6px',
                    padding: '5rem 4rem',
                    textAlign: 'center',
                    border: '2px solid var(--border-dk)',
                    overflow: 'hidden'
                }}>
                    {/* Decorative wheat icons */}
                    <Wheat style={{ position: 'absolute', top: '2rem', left: '2rem', opacity: 0.1, color: 'var(--gold)' }} size={60} />
                    <Wheat style={{ position: 'absolute', bottom: '2rem', right: '2rem', opacity: 0.1, color: 'var(--gold)', transform: 'scaleX(-1)' }} size={60} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ width: '40px', height: '1.5px', background: 'var(--gold)' }} />
                        <Sun color="var(--gold)" size={20} />
                        <div style={{ width: '40px', height: '1.5px', background: 'var(--gold)' }} />
                    </div>

                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                        fontFamily: "'IM Fell English SC', Georgia, serif",
                        color: 'var(--parchment)', marginBottom: '1.5rem',
                        fontWeight: '400', lineHeight: '1.4', fontStyle: 'italic'
                    }}>
                        "Good food is a right,<br />not a luxury."
                    </h2>

                    <p style={{ fontSize: '1rem', color: 'rgba(245,239,215,0.72)', fontFamily: "'Lora', serif", fontStyle: 'italic', lineHeight: '1.8', maxWidth: '580px', margin: '0 auto 3rem' }}>
                        We are on a mission to restore the lost connection between the plate and the soil. Join us in this quiet, honest revolution.
                    </p>

                    <Link to="/register" className="btn" style={{
                        padding: '1rem 3rem', fontSize: '0.88rem',
                        background: 'var(--gold)', color: 'var(--soil)',
                        border: '2px solid var(--gold)', borderRadius: '4px',
                        boxShadow: '4px 4px 0px rgba(61,43,31,0.4)',
                        fontFamily: "'Outfit', sans-serif", fontWeight: '700',
                        letterSpacing: '0.1em', textTransform: 'uppercase'
                    }}>
                        Join the Estate
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
