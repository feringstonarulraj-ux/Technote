import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to permanently delete this item? This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        style={{ padding: '2rem', maxWidth: '460px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-danger-bg)',
              color: 'var(--status-danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <AlertTriangle size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{title}</h3>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {message}
            </p>
          </div>

          <button onClick={onCancel} style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
