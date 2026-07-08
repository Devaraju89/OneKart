import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Leaf, Loader } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Greetings. I am the Estate Assistant. Ask me to search organic products, track order status, or explain our vetting flow."
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (textToSend) => {
        const text = textToSend || input;
        if (!text.trim()) return;

        if (!textToSend) setInput('');

        const newMessages = [...messages, { role: 'user', content: text }];
        setMessages(newMessages);
        setLoading(true);

        try {
            // Get local storage token to guarantee authorization header is present
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const { data } = await axios.post('/api/chatbot', { messages: newMessages }, { headers });
            if (data.success) {
                setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: "Quiet channels. Please try again in a moment." }]);
            }
        } catch (error) {
            setMessages([...newMessages, { role: 'assistant', content: "Quiet channels. Please try again in a moment." }]);
        } finally {
            setLoading(false);
        }
    };

    const chips = [
        { label: 'Verify Organic Flow', query: 'Explain the vetting process for organic products.' },
        { label: 'Track My Orders', query: 'Track my order details and status.' }
    ];

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, fontFamily: "'Lora', Georgia, serif" }}>
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'var(--soil)', color: 'var(--parchment)',
                        border: '2px solid var(--border-dk)',
                        boxShadow: '0 4px 12px rgba(61,43,31,0.25)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', outline: 'none', transition: 'transform 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                    <MessageSquare size={24} />
                </button>
            )}

            {isOpen && (
                <div style={{
                    width: '360px', height: '550px', borderRadius: '12px',
                    background: 'var(--cream)', border: '2px solid var(--soil)',
                    boxShadow: '0 8px 24px rgba(61,43,31,0.15)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")'
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'var(--soil)',
                        backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-wood.png")',
                        backgroundBlendMode: 'multiply',
                        borderBottom: '2px solid var(--border-dk)',
                        padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', color: 'var(--parchment)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <Leaf color="var(--gold-light)" size={18} strokeWidth={2} />
                            <div>
                                <div style={{ fontFamily: "'IM Fell English SC', serif", fontSize: '1.1rem', letterSpacing: '0.01em', color: 'var(--gold-light)' }}>Estate Assistant</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'transparent', border: 'none', color: 'rgba(245,239,215,0.7)',
                                cursor: 'pointer', display: 'flex', transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(245,239,215,0.7)'}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Body */}
                    <div ref={scrollRef} style={{
                        flex: 1, overflowY: 'auto', padding: '1.2rem',
                        display: 'flex', flexDirection: 'column', gap: '0.8rem'
                    }}>
                        {messages.map((m, idx) => {
                            const isUser = m.role === 'user';
                            return (
                                <div key={idx} style={{
                                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%'
                                }}>
                                    <div style={{
                                        background: isUser ? 'var(--soil)' : 'var(--parchment-dk)',
                                        color: isUser ? 'var(--parchment)' : 'var(--soil)',
                                        border: isUser ? '1px solid var(--soil)' : '1px solid var(--border)',
                                        borderRadius: '8px', padding: '0.6rem 0.85rem',
                                        fontSize: '0.85rem', lineHeight: '1.5',
                                        fontStyle: isUser ? 'normal' : 'italic',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}>
                                        {m.content}
                                    </div>
                                </div>
                            );
                        })}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem', background: 'var(--parchment-dk)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--soil)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                                <Loader size={12} className="rotation" /> Searching records...
                            </div>
                        )}
                    </div>

                    {/* Quick Action Chips */}
                    {messages.length === 1 && (
                        <div style={{ padding: '0 1rem 0.6rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {chips.map(c => (
                                <button
                                    key={c.label}
                                    onClick={() => handleSend(c.query)}
                                    style={{
                                        background: 'var(--parchment)', border: '1px solid var(--border)',
                                        borderRadius: '4px', padding: '0.3rem 0.6rem',
                                        fontFamily: "'Outfit', sans-serif", fontSize: '0.62rem',
                                        fontWeight: '700', color: 'var(--soil)', letterSpacing: '0.03em',
                                        cursor: 'pointer', textTransform: 'uppercase',
                                        transition: 'all 0.15s'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--rust)'; e.currentTarget.style.color = 'var(--rust)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--soil)'; }}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Form */}
                    <form
                        onSubmit={e => { e.preventDefault(); handleSend(); }}
                        style={{
                            padding: '1rem', borderTop: '1px solid var(--border)',
                            background: 'var(--cream-dk)', display: 'flex', gap: '0.5rem',
                            alignItems: 'center'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Consult registry..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            disabled={loading}
                            style={{
                                flex: 1, padding: '0.55rem 0.8rem',
                                background: 'var(--parchment-dk)', border: '1px solid var(--border)',
                                borderRadius: '6px', color: 'var(--soil)',
                                fontFamily: "'Lora', serif", fontSize: '0.82rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            style={{
                                width: '34px', height: '34px', borderRadius: '6px',
                                background: 'var(--soil)', color: 'var(--parchment)',
                                border: 'none', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer',
                                opacity: (loading || !input.trim()) ? 0.5 : 1
                            }}
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
