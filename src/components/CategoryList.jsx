import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Cpu,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Cloud,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';

const iconMap = {
  Code,
  Cpu,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Cloud,
  TrendingUp,
  Layers
};

export default function CategoryList({ categories = [] }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}
    >
      {categories.map((cat) => {
        const IconComponent = iconMap[cat.icon] || Layers;

        return (
          <Link
            key={cat._id}
            to={`/category/${cat.slug}`}
            className="card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
              backgroundColor: '#ffffff'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary-subtle)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconComponent size={22} strokeWidth={2} />
              </div>

              <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                {cat.articleCount || 0} articles
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
                lineHeight: 1.3
              }}
            >
              {cat.name}
            </h3>

            <p
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.55,
                marginBottom: '1.25rem',
                flex: 1
              }}
            >
              {cat.description || 'Explore tutorials, architectural patterns, and engineering insights.'}
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary)',
                marginTop: 'auto'
              }}
            >
              <span>Explore category</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
