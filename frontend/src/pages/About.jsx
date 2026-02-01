import React, { useEffect } from 'react';
import { ArrowLeft, Leaf, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '6rem' }}>
            <div className="container" style={{ paddingTop: '6rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: '600', width: 'fit-content' }}>
                    <ArrowLeft size={20} /> Return Home
                </Link>

                <div className="hero-fade-in" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', fontFamily: "'Playfair Display', serif", marginBottom: '1.5rem', color: 'var(--primary)' }}>The OneKart Vibe.</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-body)', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
                        We are here to flip the script. No middlemen. No old stock. Just you and the farmer. We deliver the freshest harvest straight from the soil to your soul. Simple.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
                    {[
                        { icon: Leaf, title: "100% Pure Harvest", text: "Zero preservatives. Zero middlemen. Just fresh, soil-traced produce delivered from the estate to your doorstep." },
                        { icon: Users, title: "Empowering Farmers", text: "We connect you directly with the growers, ensuring they get the fair value they deserve for their hard work." },
                        { icon: Heart, title: "Community First", text: "Building a sustainable ecosystem where every purchase supports local agriculture and healthier lifestyles." }
                    ].map((item, i) => (
                        <div key={i} className="card animate-fade" style={{ padding: '2.5rem', textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                            <div style={{ width: '60px', height: '60px', background: 'var(--primary-light)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                <item.icon size={28} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--primary)' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{item.text}</p>
                        </div>
                    ))}
                </div>

                <div className="reveal-up active" style={{ background: '#f0fdf4', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', border: '1px dashed #bbf7d0' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', fontFamily: "'Playfair Display', serif", color: '#166534' }}>"Good food is a right, not a luxury."</h2>
                    <p style={{ fontSize: '1.1rem', color: '#15803d', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                        We are on a mission to bring the lost connection between the plate and the soil back to life. Join us in this delicious revolution.
                    </p>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 3rem', borderRadius: '100px', boxShadow: '0 10px 25px rgba(22, 163, 74, 0.3)' }}>
                        Join the Revolution
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
