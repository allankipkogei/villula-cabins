import { useEffect, useState } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  CheckCircle2,
  Reply,
  Calendar,
  Phone,
  User,
  Search
} from 'lucide-react';
import api from '../api';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all'); // all | unread | read
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const loadMessages = () => {
    setLoading(true);
    api.get('admin/messages/')
      .then(res => setMessages(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const toggleReadStatus = async (msg) => {
    try {
      const updated = !msg.is_read;
      await api.patch(`admin/messages/${msg.id}/`, { is_read: updated });
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: updated } : m));
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(prev => ({ ...prev, is_read: updated }));
      }
    } catch {
      alert('Failed to update message status.');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.delete(`admin/messages/${id}/`);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch {
      alert('Failed to delete message.');
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
          Guest Inquiries & Messages
        </h1>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>
          Questions and requests sent through the public concierge contact form.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { id: 'all', label: `All Inquiries (${messages.length})` },
          { id: 'unread', label: `Unread (${messages.filter(m => !m.is_read).length})` },
          { id: 'read', label: `Read (${messages.filter(m => m.is_read).length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: filter === tab.id ? 'var(--color-primary-700)' : '#E5E7EB',
              backgroundColor: filter === tab.id ? 'var(--color-primary-700)' : '#FFFFFF',
              color: filter === tab.id ? '#FFFFFF' : '#4B5563',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Inbox Left, Message Preview Right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: selectedMessage ? 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))' : '1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Messages List */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#6B7280' }}>
              Loading inquiries…
            </div>
          ) : filteredMessages.length === 0 ? (
            <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              <div style={{ fontWeight: 700, color: '#111827', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                No Inquiries Yet
              </div>
              <div style={{ fontSize: '0.85rem', color: '#9CA3AF', maxWidth: '380px', margin: '0 auto' }}>
                Guest inquiries and pre-launch contact form submissions will appear here in real-time.
              </div>
            </div>
          ) : (
            <div style={{ divideY: '1px solid #F3F4F6' }}>
              {filteredMessages.map(msg => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <div
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.is_read) toggleReadStatus(msg);
                    }}
                    style={{
                      padding: '1.25rem',
                      borderBottom: '1px solid #F3F4F6',
                      backgroundColor: isSelected ? 'var(--color-sand-100)' : msg.is_read ? '#FFFFFF' : '#F0FDF4',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    {!msg.is_read && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '6px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#059669',
                        }}
                      />
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: msg.is_read ? 600 : 800, color: '#111827', fontSize: '0.95rem' }}>
                        {msg.name}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                        {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: msg.is_read ? 500 : 700, color: '#374151', marginBottom: '0.25rem' }}>
                      {msg.subject || 'Direct Inquiry'}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.message}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Message View */}
        {selectedMessage && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setSelectedMessage(null)}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
              >
                ← Back to inquiries
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem', fontWeight: 700 }}>
                  {selectedMessage.subject || 'Guest Inquiry'}
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  Received: {selectedMessage.created_at ? new Date(selectedMessage.created_at).toLocaleString() : 'Recent'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => toggleReadStatus(selectedMessage)}
                  className="btn btn-outline btn-sm"
                  title="Toggle read status"
                >
                  {selectedMessage.is_read ? <Mail size={15} /> : <MailOpen size={15} />}
                  {selectedMessage.is_read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  style={{
                    border: '1px solid #FEE2E2',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                  title="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Sender details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                backgroundColor: 'var(--color-sand-50)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Sender</div>
                <div style={{ fontWeight: 600 }}>{selectedMessage.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Email</div>
                <a href={`mailto:${selectedMessage.email}`} style={{ color: 'var(--color-primary-700)', fontWeight: 600 }}>
                  {selectedMessage.email}
                </a>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#6B7280', fontWeight: 700 }}>Phone</div>
                <div>{selectedMessage.phone || 'None provided'}</div>
              </div>
            </div>

            {/* Body */}
            <div style={{ fontSize: '1rem', lineHeight: 1.8, color: '#1F2937', marginBottom: '2rem', whiteSpace: 'pre-line' }}>
              {selectedMessage.message}
            </div>

            {/* Reply CTA */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem' }}>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Villula Resort Stay')}`}
                className="btn btn-primary"
              >
                <Reply size={16} /> Reply to {selectedMessage.name} via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
