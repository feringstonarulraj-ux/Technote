import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('technotes_admin');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('technotes_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setAdmin(res.data.admin);
            localStorage.setItem('technotes_admin', JSON.stringify(res.data.admin));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setAdmin(res.data.admin);
      localStorage.setItem('technotes_token', res.data.token);
      localStorage.setItem('technotes_admin', JSON.stringify(res.data.admin));
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('technotes_token');
    localStorage.removeItem('technotes_admin');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
