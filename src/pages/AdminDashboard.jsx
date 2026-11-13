import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Clock,
  FolderTree,
  Users,
  Eye,
  Mail,
  PlusCircle,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    adminAPI
      .getDashboard()
      .then((res) => {
        if (isMounted && res.data.success) {
          setData(res.data);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading CMS analytics and dashboard statistics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: '2rem' }}>
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error || 'Error loading dashboard'}</span>
        </div>
      </div>
    );
  }

  const { stats, recentArticles, topArticles } = data;

  const statCards = [
    { label: 'Total Articles', value: stats.totalArticles, icon: FileText, color: 'var(--primary)', bg: 'var(--primary-subtle)' },
    { label: 'Published', value: stats.publishedArticles, icon: CheckCircle2, color: 'var(--status-success)', bg: 'var(--status-success-bg)' },
    { label: 'Drafts in Review', value: stats.draftArticles, icon: FileEdit, color: 'var(--status-warning)', bg: 'var(--status-warning-bg)' },
    { label: 'Scheduled Queue', value: stats.scheduledArticles, icon: Clock, color: 'var(--accent-teal)', bg: '#f0f9ff' },
    { label: 'Categories', value: stats.totalCategories, icon: FolderTree, color: '#6366f1', bg: '#eef2ff' },
    { label: 'Lead Authors', value: stats.totalAuthors, icon: Users, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Total Reads / Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: '#0284c7', bg: '#e0f2fe' },
    { label: 'Newsletter Subscribers', value: stats.totalSubscribers, icon: Mail, color: '#059669', bg: '#d1fae5' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Editorial Overview</h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
            Real-time publication performance metrics and administrative workflows
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/admin/posts/new" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>New Article</span>
          </Link>
          <Link to="/admin/categories" className="btn btn-outline btn-sm">
            <FolderTree size={15} />
            <span>Manage Categories</span>
          </Link>
          <Link to="/" target="_blank" className="btn btn-outline btn-sm">
            <span>Public Site</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {c.label}
                </span>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: c.bg,
                    color: c.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={16} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {c.value}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '2rem'
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recently Updated Articles</h3>
            <Link to="/admin/posts" style={{ fontSize: '0.825rem', fontWeight: 600 }}>
              View All ({stats.totalArticles}) →
            </Link>
          </div>

          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentArticles.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {p.title}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        by {p.author?.name || 'Staff'}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                        {p.category?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          p.status === 'published'
                            ? 'badge-success'
                            : p.status === 'draft'
                            ? 'badge-warning'
                            : p.status === 'scheduled'
                            ? 'badge-primary'
                            : 'badge-gray'
                        }`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/admin/posts/${p._id}/edit`}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Top Articles by Readership</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topArticles.map((p, idx) => (
              <div
                key={p._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: idx === 0 ? 'var(--primary)' : 'var(--text-muted)',
                      width: '20px'
                    }}
                  >
                    #{idx + 1}
                  </span>
                  <div>
                    <Link
                      to={`/blog/${p.slug}`}
                      target="_blank"
                      style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        color: 'var(--text-primary)',
                        display: 'block',
                        lineHeight: 1.3
                      }}
                    >
                      {p.title}
                    </Link>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {p.category?.name}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <Eye size={14} />
                  <span>{p.views.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
