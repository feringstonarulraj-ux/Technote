import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, LogOut, ExternalLink, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminNavbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-light)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 900
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link
          to="/admin/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Layers size={18} strokeWidth={2.5} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: 'var(--text-primary)'
              }}
            >
              TechNotes <span style={{ color: 'var(--primary)', fontWeight: 600 }}></span>
            </span>
          </div>
        </Link>
        <span
          className="badge badge-primary"
          style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}
        >
          {admin?.role || 'Admin'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link
          to="/"
          target="_blank"
          className="btn btn-outline btn-sm"
          style={{ gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <span>View Public Publication</span>
          <ExternalLink size={13} />
        </Link>

        {/* <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-subtle)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            {admin?.name ? admin.name[0].toUpperCase() : <User size={16} />}
          </div>
          <div className="admin-user-info" style={{ lineHeight: 1.2 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {admin?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {admin?.email}
            </div>
          </div>
        </div> */}

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-ghost btn-sm"
          style={{ color: 'var(--status-danger)', gap: '0.35rem' }}
          title="Sign out of Admin CMS"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
