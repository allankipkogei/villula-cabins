import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin');
    } catch {
      setError('Invalid username or password. Please verify your staff credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0E1B13',
        backgroundImage: `radial-gradient(rgba(201, 168, 106, 0.08) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        padding: '1.5rem',
      }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#A2B4AA',
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Return to Public Resort Site
        </Link>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Official Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <BrandLogo to="/" size="lg" style={{ marginBottom: '1rem' }} />
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.88rem' }}>
            Staff Property Management Portal
          </p>
        </div>


        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} style={{ color: 'var(--color-primary-700)' }} /> Username
            </label>
            <input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} style={{ color: 'var(--color-primary-700)' }} /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Authenticating…' : 'Sign In to Dashboard'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #E5E7EB', fontSize: '0.85rem', color: '#6B7280' }}>
            New administrator or staff?{' '}
            <Link to="/admin/register" style={{ color: 'var(--color-primary-700)', fontWeight: 700 }}>
              Sign Up with Email Verification →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
