import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  // items: [{ label: 'Home', path: '/' }, { label: 'Category', path: '/category/...' }, { label: 'Current Page' }]
  if (!items || items.length === 0) return null;

  // JSON-LD schema for breadcrumbs
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.path ? `${window.location.origin}${item.path}` : window.location.href
    }))
  };

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.4rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginBottom: '1.5rem'
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index === 0 && (
              <Home size={14} style={{ color: 'var(--text-muted)', marginRight: '2px' }} />
            )}

            {isLast || !item.path ? (
              <span
                style={{
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  maxWidth: '300px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                style={{
                  color: 'var(--text-muted)',
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {item.label}
              </Link>
            )}

            {!isLast && (
              <ChevronRight size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
