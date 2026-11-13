import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, ArrowRight, User } from 'lucide-react';

export default function BlogCard({ post }) {
  if (!post) return null;

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  return (
    <article
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff'
      }}
    >
      <Link
        to={`/blog/${post.slug}`}
        style={{
          position: 'relative',
          display: 'block',
          aspectRatio: '16/9',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-subtle)'
        }}
      >
        <img
          src={post.featuredImage}
          alt={post.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        {post.category && (
          <span
            className="badge badge-primary"
            style={{
              position: 'absolute',
              top: '0.85rem',
              left: '0.85rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {post.category.name}
          </span>
        )}
      </Link>

      <div
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
      >
        <h3
          style={{
            fontSize: '1.2rem',
            lineHeight: 1.4,
            marginBottom: '0.75rem',
            fontWeight: 700
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
        </h3>

        <p
          style={{
            fontSize: '0.925rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1
          }}
        >
          {post.excerpt}
        </p>

        <div
          style={{
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1rem',
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {post.author?.profileImage ? (
              <img
                src={post.author.profileImage}
                alt={post.author.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)'
                }}
              >
                <User size={16} />
              </div>
            )}
            <div>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2
                }}
              >
                {post.author?.name || 'TechNotes Team'}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{formattedDate}</span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                  <Clock size={12} />
                  {post.readingTime || 5} min read
                </span>
              </div>
            </div>
          </div>

          <Link
            to={`/blog/${post.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              color: 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
            aria-label="Read full article"
          >
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
