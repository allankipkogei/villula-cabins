import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('access'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('access', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch fresh user profile if not populated
      api.get('auth/me/')
        .then(res => {
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          // Token may be invalid/expired
        });
    } else {
      localStorage.removeItem('access');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Step 1: Register with Email (triggers 6-digit code to email)
  const register = async ({ email, password, full_name, phone }) => {
    const res = await api.post('auth/register/', {
      email,
      password,
      full_name,
      phone,
    });
    return res.data;
  };

  // Step 2: Verify 6-digit email authentication code
  const verifyCode = async (email, code) => {
    const res = await api.post('auth/verify-code/', { email, code });
    if (res.data.access) {
      setToken(res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    }
    return res.data;
  };

  // Resend authentication code
  const resendCode = async (email, purpose = 'signup') => {
    const res = await api.post('auth/resend-code/', { email, purpose });
    return res.data;
  };

  // Sign In with Email/Username & Password
  const login = async (emailOrUsername, password) => {
    try {
      const res = await api.post('auth/login/', { email: emailOrUsername, password });
      setToken(res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      return res.data;
    } catch (err) {
      // If error requires verification, rethrow so the UI can redirect to verify-code
      if (err.response?.data?.requires_verification) {
        throw err;
      }
      // Fallback to standard simplejwt endpoint for staff username/password
      const res = await api.post('token/', { username: emailOrUsername, password });
      setToken(res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      return res.data;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        register,
        verifyCode,
        resendCode,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
