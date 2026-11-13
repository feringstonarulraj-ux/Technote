import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { newsletterAPI } from '../services/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setFeedback({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const res = await newsletterAPI.subscribe(email);
      setFeedback({ type: 'success', message: res.data.message });
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to subscribe. Please try again.';
      setFeedback({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2rem',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center',
        maxWidth: '820px',
        margin: '0 auto'
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-subtle)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem'
        }}
      >
        <Mail size={24} strokeWidth={2} />
      </div>

      <h2
        style={{
          fontSize: '1.85rem',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
          letterSpacing: '-0.02em'
        }}
      >
        Subscribe to TechNotes Team Dispatches
      </h2>

      <p
        style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: '580px',
          margin: '0 auto 2rem'
        }}
      >
        Join 25,000+ technology leaders, software engineers, and cloud architects who read our bi-weekly architectural breakdowns and technical deep dives.
      </p>

      {feedback && (
        <div
          className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'}`}
          style={{ maxWidth: '540px', margin: '0 auto 1.5rem', textAlign: 'left' }}
        >
          {feedback.type === 'success' ? (
            <CheckCircle size={18} style={{ flexShrink: 0 }} />
          ) : (
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
          maxWidth: '540px',
          margin: '0 auto'
        }}
      >
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            style={{
              height: '48px',
              fontSize: '0.95rem'
            }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
          style={{ height: '48px', padding: '0 1.5rem' }}
        >
          {loading ? 'Subscribing...' : 'Subscribe Free'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: '1.25rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <Shield size={14} style={{ color: 'var(--status-success)' }} />
        <span>No spam or marketing promotions. Unsubscribe with one click anytime.</span>
      </div>
    </section>
  );
}
