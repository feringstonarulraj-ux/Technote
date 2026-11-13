import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Editorial Inquiry',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        topic: 'Editorial Inquiry',
        subject: '',
        message: ''
      });
    }, 800);
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Contact Us' }]} />

        <div style={{ maxWidth: '780px', marginBottom: '3.5rem' }}>
          <span className="section-label">Editorial Board Contact</span>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '1rem' }}>
            Get in Touch with Our Editorial Team
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Have feedback on a published technical piece, want to submit a guest article proposal, or discuss an enterprise case study? We’d love to hear from you.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1.2fr)',
            gap: '3.5rem'
          }}
          className="contact-layout-grid"
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Send an Editorial Inquiry
            </h2>

            {submitted && (
              <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <span>
                  Thank you for reaching out! Our editorial board has received your message and will review it within 1-2 business days.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rachel Adams"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="rachel@company.io"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div>
                  <label className="form-label">Inquiry Topic</label>
                  <select
                    className="form-control"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  >
                    <option value="Editorial Inquiry">General Editorial Inquiry</option>
                    <option value="Guest Article Proposal">Guest Article Pitch / Submission</option>
                    <option value="Technical Correction">Technical Correction or Errata</option>
                    <option value="Press & Media">Press & Publication Syndication</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Subject *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Summary of inquiry"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Message Details *</label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Provide context, references, or your proposed outline..."
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', height: '46px' }}
              >
                {loading ? 'Sending Message...' : 'Submit Inquiry'}
                {!loading && <Send size={16} />}
              </button>
            </form>
          </div>

          <div>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Direct Contact Information
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Our team is available Monday through Friday across Pacific and Eastern time zones.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Editorial Desk</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    editorial@technotes.io
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Headquarters</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    500 Technology Way, Suite 400<br />San Francisco, CA 94105
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Clock size={18} />
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Editorial Review SLA</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Response within 24 to 48 business hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
