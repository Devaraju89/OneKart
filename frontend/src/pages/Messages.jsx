import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Mail, Send, CheckCircle2, User, Clock, Package, MessageSquare, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [replyBody, setReplyBody] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get('/api/inquiries');
            setMessages(data.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (msg) => {
        const recipientId = (msg.recipient?._id || msg.recipient)?.toString();
        if (recipientId === user.id?.toString() && !msg.isRead) {
            try {
                await axios.put(`/api/inquiries/${msg._id}/read`);
                fetchMessages();
            } catch (error) {
                console.error(error);
            }
        }
        setSelectedMsg(msg);
    };

    const sendReply = async (e) => {
        e.preventDefault();
        if (!replyBody.trim()) return;

        const senderId = (selectedMsg.sender?._id || selectedMsg.sender)?.toString();
        const isSender = senderId === user.id?.toString();

        // recipient can be an object (if populated) or a string (ID)
        const rawRecipient = isSender ? selectedMsg.recipient : selectedMsg.sender;
        const recipientId = (rawRecipient?._id || rawRecipient)?.toString();
        const recipientRole = rawRecipient?.role || (isSender ? (selectedMsg.recipientRole || 'farmer') : (selectedMsg.senderRole || 'customer'));

        if (!recipientId) {
            return toast.error("Correspondence partner not identified in registry");
        }

        try {
            await axios.post('/api/inquiries', {
                recipient: recipientId,
                recipientRole: recipientRole,
                subject: `Re: ${selectedMsg.subject}`,
                message: replyBody,
                repliedTo: selectedMsg._id,
                product: selectedMsg.product?._id
            });
            toast.success("Reply dispatched");
            setReplyBody('');
            fetchMessages();
        } catch (error) {
            console.error(error);
            toast.error("Dispatch failure");
        }
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #E2E8F0', borderTopColor: '#064E3B', borderRadius: '50%', animation: 'rotation 1s linear infinite' }}></div>
        </div>
    );

    return (
        <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '8rem', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', height: '70vh' }}>

                    {/* Inbox Column */}
                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-pure)' }}>
                            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <MessageSquare color="var(--primary)" size={24} />
                                Central Registry
                            </h2>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {messages.length === 0 ? (
                                <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <Mail size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                    <p>No messages found in archives.</p>
                                </div>
                            ) : (
                                messages.map(msg => (
                                    <div
                                        key={msg._id}
                                        onClick={() => markAsRead(msg)}
                                        style={{
                                            padding: '1.5rem',
                                            borderBottom: '1px solid #f1f5f9',
                                            cursor: 'pointer',
                                            background: selectedMsg?._id === msg._id ? '#f8fafc' : 'transparent',
                                            borderLeft: msg.recipient?._id === user.id && !msg.isRead ? '4px solid var(--primary)' : '4px solid transparent',
                                            transition: 'var(--transition)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary-light)' }}>
                                                {((msg.sender?._id || msg.sender)?.toString() === user.id?.toString()) ? 'SENT TO: ' : 'FROM: '}{((msg.sender?._id || msg.sender)?.toString() === user.id?.toString()) ? (msg.recipient?.name || 'Partner') : (msg.sender?.name || 'Member')}
                                            </span>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                                {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.3rem' }}>{msg.subject}</div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                            {msg.message}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Column */}
                    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                        {selectedMsg ? (
                            <>
                                <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-pure)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: '800', letterSpacing: '0.1em', uppercase: 'true' }}>
                                            Communication Channel
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{selectedMsg.subject}</h3>
                                    </div>
                                    {selectedMsg.product && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-main)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                            <Package size={16} color="var(--primary)" />
                                            <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{selectedMsg.product.name}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <div style={{
                                        padding: '2rem',
                                        background: '#f8fafc',
                                        borderRadius: '20px',
                                        border: '1px solid #e2e8f0',
                                        maxWidth: '90%'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={16} color="var(--primary)" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>{selectedMsg.sender?.name || 'Registry Member'}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{(selectedMsg.sender?.role || selectedMsg.senderRole || 'User').toUpperCase()} • {new Date(selectedMsg.createdAt).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--text-body)', margin: 0 }}>
                                            {selectedMsg.message}
                                        </p>
                                    </div>

                                    {/* Show Thread? For now simple reply */}
                                </div>

                                <div style={{ padding: '2rem', borderTop: '1px solid var(--border)', background: 'var(--bg-pure)' }}>
                                    <form onSubmit={sendReply} style={{ display: 'flex', gap: '1rem' }}>
                                        <textarea
                                            value={replyBody}
                                            onChange={(e) => setReplyBody(e.target.value)}
                                            placeholder="Compose official response..."
                                            style={{
                                                flex: 1,
                                                padding: '1rem 1.5rem',
                                                borderRadius: '16px',
                                                border: '1px solid var(--border)',
                                                background: 'white',
                                                minHeight: '60px',
                                                maxHeight: '120px',
                                                outline: 'none',
                                                fontSize: '0.95rem',
                                                fontFamily: 'inherit'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{ borderRadius: '16px', padding: '0 2rem' }}
                                        >
                                            <Send size={18} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                                <MessageSquare size={80} style={{ marginBottom: '2rem' }} />
                                <h3 style={{ fontSize: '1.5rem' }}>Select a dossier to view details</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
