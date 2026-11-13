import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        paddingTop: '6rem',
        paddingBottom: '8rem',
        textAlign: 'center'
      }}
    >
      <div className="container" style={{ maxWidth: '580px' }}>
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 800,
            color: 'var(--primary)',
            lineHeight: 1,
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)'
          }}
        >
          404
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The publication page or resource you requested could not be located. It might have been moved, renamed, or temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
