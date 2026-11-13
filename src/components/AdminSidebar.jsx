import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Tag,
  Users,
  Mail,
  ExternalLink
} from 'lucide-react';

export default function AdminSidebar() {
  const links = [
    { label: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Articles Management', path: '/admin/posts', icon: FileText },
    { label: 'Write New Article', path: '/admin/posts/new', icon: PlusCircle },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Tags Management', path: '/admin/tags', icon: Tag },
    { label: 'Authors & Profiles', path: '/admin/authors', icon: Users },
    { label: 'Newsletter Subscribers', path: '/admin/subscribers', icon: Mail }
  ];

  return (
    <aside
      style={{
        width: '250px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid var(--border-light)',
        minHeight: 'calc(100vh - 64px)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}
    >
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '0 0.75rem 0.75rem'
        }}
      >
        Editorial Controls
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin/dashboard' || link.path === '/admin/posts'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                transition: 'all 0.15s ease'
              })}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div
        style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1rem',
          marginTop: 'auto',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}
      >
        <div>TechNotes  </div>
        <div>MERN Stack Architecture</div>
      </div>
    </aside>
  );
}
