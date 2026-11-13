import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)'
        }}
      >
        <p style={{ color: 'var(--text-muted)' }}>Validating administrative session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-main)' }}>
      <AdminNavbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <AdminSidebar />
        <main style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
