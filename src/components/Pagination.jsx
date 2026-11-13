import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        marginTop: '3rem',
        marginBottom: '2rem'
      }}
    >
      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          opacity: currentPage <= 1 ? 0.5 : 1,
          cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
          padding: '0.45rem 0.85rem'
        }}
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              backgroundColor: isActive ? 'var(--primary)' : '#ffffff',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          opacity: currentPage >= totalPages ? 0.5 : 1,
          cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
          padding: '0.45rem 0.85rem'
        }}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
