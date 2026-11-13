import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Layers,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  UserCheck
} from 'lucide-react';

import SearchBar from './SearchBar';
import { categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated, admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    categoryAPI
      .getAll()
      .then((res) => {
        if (isMounted && res.data.success) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => console.warn('Could not load header categories:', err.message));
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-light)',
          position: 'sticky',
          top: 0,
          zIndex: 900
        }}
      >
        <div
          className="container"
          style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem'
          }}
        >
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <Layers size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.03em'
                }}
              >
                Tech<span style={{ color: 'var(--primary)' }}>Note</span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--text-muted)',
                  lineHeight: 1
                }}
              >
              </span>
            </div>
          </Link>

          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem'
            }}
            className="desktop-nav"
          >
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem'
              })}
            >
              Home
            </NavLink>

            <NavLink
              to="/blogs"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem'
              })}
            >
              All Articles
            </NavLink>

            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  padding: '0.5rem 0'
                }}
              >
                Categories
                <ChevronDown size={15} style={{ opacity: 0.7 }} />
              </button>

              {isCategoryDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '-20px',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '0.6rem 0',
                    zIndex: 1000
                  }}
                >
                  <div
                    style={{
                      padding: '0.4rem 1rem 0.6rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid var(--border-light)'
                    }}
                  >
                    Publication Domains
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/category/${cat.slug}`}
                      onClick={() => setIsCategoryDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 1rem',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        transition: 'background-color 0.1s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>{cat.name}</span>
                      <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                        {cat.articleCount || 0}
                      </span>
                    </Link>
                  ))}
                  <div
                    style={{
                      borderTop: '1px solid var(--border-light)',
                      marginTop: '0.4rem',
                      padding: '0.5rem 1rem 0.2rem'
                    }}
                  >
                    <Link
                      to="/blogs"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--primary)'
                      }}
                    >
                      Browse full archive <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/about"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem'
              })}
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem'
              })}
            >
              Contact
            </NavLink>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <form
              onSubmit={handleSearchSubmit}
              className="header-search-form"
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search articles..."
              />
            </form>

            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="btn btn-outline btn-sm"
                style={{ gap: '0.4rem', borderColor: 'var(--primary-border)', color: 'var(--primary)' }}
              >
                <UserCheck size={14} />
                <span>Admin Panel</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}
              >
                Admin CMS
              </Link>
            )}

            <button
              type="button"
              className="mobile-hamburger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'none',
                padding: '0.4rem',
                color: 'var(--text-primary)'
              }}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      

      {isMobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1rem 1.5rem',
            boxShadow: 'var(--shadow-md)'
          }}
          className="mobile-drawer"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Home
            </Link>
            <Link
              to="/blogs"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              All Articles
            </Link>
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Categories
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.75rem' }}>
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Contact
            </Link>
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
              <Link
                to={isAuthenticated ? '/admin/dashboard' : '/admin/login'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn btn-outline btn-sm"
                style={{ width: '100%' }}
              >
                {isAuthenticated ? 'Go to Admin Dashboard' : 'Admin Login'}
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav { display: none !important; }
          .desktop-search-text { display: none; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
      <style>{`
  .header-search-form {
    width: 230px;
    flex-shrink: 0;
  }

  @media (max-width: 860px) {
    .desktop-nav {
      display: none !important;
    }

    .header-search-form {
      width: 180px;
    }

    .mobile-hamburger {
      display: block !important;
    }
  }

  @media (max-width: 480px) {
    .header-search-form {
      width: 140px;
    }
  }
`}</style>
    </>
  );
}
