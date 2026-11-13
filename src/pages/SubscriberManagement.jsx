import React, { useState, useEffect } from 'react';
import { newsletterAPI } from '../services/api';
import { Mail, Calendar, CheckCircle2, Copy, Check } from 'lucide-react';

export default function SubscriberManagement() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    newsletterAPI
      .getAll()
      .then((res) => {
        if (res.data.success) {
          setSubscribers(res.data.subscribers);
        }
      })
      .catch((err) => console.warn('Error loading subscribers:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyEmails = () => {
    const list = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(list);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Newsletter Subscribers</h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
            Readers subscribed to the newsletter
          </p>
        </div>

        {subscribers.length > 0 && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleCopyEmails}
            style={{ gap: '0.4rem' }}
          >
            {copied ? <Check size={14} style={{ color: 'var(--status-success)' }} /> : <Copy size={14} />}
            <span>{copied ? 'Copied Emails!' : 'Copy Email List'}</span>
          </button>
        )}
      </div>

      <div className="data-table-wrapper" style={{ boxShadow: 'var(--shadow-xs)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Subscriber Email</th>
              <th>Status</th>
              <th>Subscription Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Loading subscribers list...</p>
                </td>
              </tr>
            ) : subscribers.length > 0 ? (
              subscribers.map((sub) => (
                <tr key={sub._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-subtle)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Mail size={16} />
                      </div>
                      <strong style={{ fontSize: '0.925rem' }}>{sub.email}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                      {sub.status || 'Active'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No subscribers yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
