import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  CalendarCheck,
  Clock,
  Home,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  XCircle,
  Plus,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import api from '../api';
import { formatKSh } from '../utils/formatCurrency';

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get('admin/stats/'),
      api.get('admin/bookings/'),
      api.get('admin/messages/'),
    ])
      .then(([statsRes, bookingsRes, messagesRes]) => {
        setStats(statsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 5));
        setRecentMessages(messagesRes.data.slice(0, 4));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateBookingStatus = async (id, status) => {
    try {
      await api.patch(`admin/bookings/${id}/`, { status });
      loadData();
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  if (loading && !stats) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>Loading resort telemetry…</div>;
  }

  const kpis = [
    {
      label: 'Gross Revenue',
      value: formatKSh(stats?.total_revenue),
      icon: <DollarSign size={22} style={{ color: '#059669' }} />,
      bg: '#ECFDF5',
      note: 'Confirmed bookings (KSh)',
    },
    {
      label: 'Total Bookings',
      value: stats?.total_bookings || 0,
      icon: <CalendarCheck size={22} style={{ color: '#2563EB' }} />,
      bg: '#EFF6FF',
      note: `${stats?.pending_bookings || 0} pending review`,
    },
    {
      label: 'Upcoming Check-ins',
      value: stats?.upcoming_checkins || 0,
      icon: <Clock size={22} style={{ color: '#D97706' }} />,
      bg: '#FEF3C7',
      note: 'Active guests arriving soon',
    },
    {
      label: 'Active Sanctuaries',
      value: `${stats?.active_units || 0} / ${stats?.total_units || 0}`,
      icon: <Home size={22} style={{ color: '#7C3AED' }} />,
      bg: '#F5F3FF',
      note: 'Capsules & Container units',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#DEF7EC', color: '#03543F', text: 'Confirmed' };
      case 'pending':
        return { bg: '#FEF08A', color: '#854D0E', text: 'Pending' };
      case 'cancelled':
        return { bg: '#FEE2E2', color: '#991B1B', text: 'Cancelled' };
      default:
        return { bg: '#E5E7EB', color: '#374151', text: status };
    }
  };

  return (
    <div>
      {/* Title & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', margin: 0, fontWeight: 700 }}>Resort Overview</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#6B7280', fontSize: '0.95rem' }}>
            Real-time occupancy, guest reservations, and sanctuary operations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/cabins" className="btn btn-primary btn-sm">
            <Plus size={16} /> Add Sanctuary Unit
          </Link>
          <Link to="/admin/bookings" className="btn btn-outline btn-sm">
            View All Bookings
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {kpis.map((kpi, i) => (
          <div
            key={i}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {kpi.label}
              </span>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: kpi.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {kpi.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', lineHeight: 1.1, marginBottom: '0.35rem' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>
              {kpi.note}
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Bookings & Inquiries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem' }}>
        {/* Recent Bookings Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>Recent Reservations</h2>
            <Link to="/admin/bookings" style={{ fontSize: '0.85rem', color: 'var(--color-primary-700)', fontWeight: 600 }}>
              All Bookings →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1.25rem', color: '#4B5563', fontWeight: 600 }}>Guest & Sanctuary</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#4B5563', fontWeight: 600 }}>Dates</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#4B5563', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#4B5563', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', color: '#4B5563', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => {
                  const badge = getStatusBadge(b.status);
                  return (
                    <tr key={b.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{b.guest_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{b.cabin_name}</div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontSize: '0.85rem', color: '#374151' }}>{b.check_in}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{b.nights} night{b.nights > 1 ? 's' : ''}</div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#111827' }}>
                        {formatKSh(b.total_price)}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '999px',
                            display: 'inline-block',
                          }}
                        >
                          {badge.text}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        {b.status === 'pending' ? (
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'confirmed')}
                              title="Confirm Reservation"
                              style={{
                                border: 'none',
                                background: '#DEF7EC',
                                color: '#03543F',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'cancelled')}
                              title="Decline"
                              style={{
                                border: 'none',
                                background: '#FEE2E2',
                                color: '#991B1B',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Processed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>📋</div>
                      <div style={{ fontWeight: 700, color: '#374151', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                        No Reservations Yet
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
                        New guest reservations will automatically appear here once bookings are recorded.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guest Inquiries Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>Recent Guest Inquiries</h2>
            <Link to="/admin/messages" style={{ fontSize: '0.85rem', color: 'var(--color-primary-700)', fontWeight: 600 }}>
              Inbox ({stats?.unread_messages || 0}) →
            </Link>
          </div>

          <div style={{ padding: '1.25rem 1.5rem', display: 'grid', gap: '1rem', flex: 1 }}>
            {recentMessages.map(msg => (
              <div
                key={msg.id}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: msg.is_read ? '#F9FAFB' : '#EFF6FF',
                  border: msg.is_read ? '1px solid #E5E7EB' : '1px solid #BFDBFE',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.92rem' }}>
                    {msg.name}
                  </div>
                  {!msg.is_read && (
                    <span style={{ backgroundColor: '#2563EB', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                      NEW
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#4B5563', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {msg.subject || 'Guest Message'}
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {msg.message}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#9CA3AF', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{msg.email}</span>
                  <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Villula Resort Stay')}`} style={{ color: 'var(--color-primary-700)', fontWeight: 600 }}>
                    Reply →
                  </a>
                </div>
              </div>
            ))}
            {recentMessages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#6B7280' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>💬</div>
                <div style={{ fontWeight: 700, color: '#374151', marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                  No Guest Inquiries Yet
                </div>
                <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>
                  Inquiries submitted through the public contact form will appear here in real-time.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
