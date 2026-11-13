import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('feri@gmail.com');
    setPassword('feri@123');
    setError('');
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        backgroundColor: 'var(--bg-main)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: "black",
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}
          >
            <Layers size={24} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.35rem' }}>
            TechNotes
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Sign in to manage publications, authors, and categories
          </p>
        </div>

       

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="feri@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
           
            disabled={loading}
            style={{ width: '100%', height: '44px',backgroundColor:"black", color: '#ffffff', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', transition: 'all 0.15s ease' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
