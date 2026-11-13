import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Breadcrumb from '../components/Breadcrumb';
import { useDebounce } from '../hooks/useDebounce';
import {
  Code,
  Cpu,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Cloud,
  TrendingUp,
  Layers,
  BookX,
  ArrowLeft
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

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const debouncedSearch = useDebounce(search, 350);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    categoryAPI
      .getBySlug(slug, {
        page: currentPage,
        limit: 9,
        search: debouncedSearch
      })
      .then((res) => {
        if (isMounted && res.data.success) {
          setCategory(res.data.category);
          setPosts(res.data.posts);
          setTotalPages(res.data.totalPages || 1);
          setTotalPosts(res.data.totalPosts || 0);
        }
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          if (isMounted) setNotFound(true);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, debouncedSearch, currentPage]);

  if (notFound) {
    return (
      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Category Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The requested technology domain could not be found or has been restructured.
        </p>
        <Link to="/blogs" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to All Articles</span>
        </Link>
      </div>
    );
  }

  const IconComponent = category ? iconMap[category.icon] || Layers : Layers;

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'All Articles', path: '/blogs' },
            { label: category?.name || 'Category' }
          ]}
        />

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconComponent size={26} strokeWidth={2} />
            </div>
            <div>
              <span className="section-label" style={{ marginBottom: '0.2rem' }}>
                Technical Category
              </span>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2 }}>
                {category?.name || 'Loading...'}
              </h1>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.6 }}>
            {category?.description}
          </p>
        </div>

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
          <div style={{ flex: '1 1 320px', maxWidth: '480px' }}>
            <SearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setCurrentPage(1);
              }}
              placeholder={`Search within ${category?.name || 'this category'}...`}
            />
          </div>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing <strong>{posts.length}</strong> of <strong>{totalPosts}</strong> articles
          </div>
        </div>

        {loading ? (
          <div
            style={{
              padding: '4rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)'
            }}
          >
            <p style={{ color: 'var(--text-muted)' }}>Loading articles...</p>
          </div>
        ) : posts.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '2rem'
            }}
          >
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-light)',
              maxWidth: '600px',
              margin: '2rem auto'
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              <BookX size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No articles found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              No published articles matched your search query in this category.
            </p>
            {search && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setSearch('')}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 200, behavior: 'smooth' });
          }}
        />
      </div>
    </div>
  );
}
