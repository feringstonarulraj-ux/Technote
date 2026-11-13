import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search articles by keywords, topics, technology...' }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%'
      }}
    >
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        className="form-control"
        style={{
          paddingLeft: '2.75rem',
          paddingRight: value ? '2.75rem' : '1rem',
          height: '46px',
          fontSize: '0.95rem',
          backgroundColor: '#ffffff'
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%'
          }}
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
