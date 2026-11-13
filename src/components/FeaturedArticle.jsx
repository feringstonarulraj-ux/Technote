import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, Sparkles, User } from 'lucide-react';

export default function FeaturedArticle({ post }) {
  if (!post) return null;

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently Published';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        alignItems: 'stretch'
      }}
      className="featured-hero-card"
    >
      <div
        style={{
          position: 'relative',
          minHeight: '340px',
          backgroundColor: '#0f172a',
          overflow: 'hidden'
        }}
      >
        <img
          src={post.featuredImage}
          alt={post.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            left: '1.25rem',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              color: '#f8fafc',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Sparkles size={12} style={{ color: '#38bdf8' }} />
            Editorial Highlight
          </span>
          {post.category && (
            <span
              className="badge"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--primary)',
                fontWeight: 700
              }}
            >
              {post.category.name}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            fontSize: '0.825rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} />
            {formattedDate}
          </span>
          <span>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={14} />
            {post.readingTime || 6} min read
          </span>
        </div>

        <h2
          style={{
            fontSize: '1.85rem',
            lineHeight: 1.3,
            marginBottom: '1rem',
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}
        >
          <Link
            to={`/blog/${post.slug}`}
            style={{
              color: 'var(--text-primary)',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          >
            {post.title}
          </Link>
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            marginBottom: '2rem'
          }}
        >
          {post.excerpt}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1.5rem',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {post.author?.profileImage ? (
              <img
                src={post.author.profileImage}
                alt={post.author.name}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <User size={20} />
              </div>
            )}
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {post.author?.name || 'Staff Engineering Lead'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {post.author?.designation || 'Systems Architecture'}
              </div>
            </div>
          </div>

          <Link to={`/blog/${post.slug}`} className="btn btn-primary" style={{ gap: '0.6rem' }}>
            <span>Read Full Article</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
