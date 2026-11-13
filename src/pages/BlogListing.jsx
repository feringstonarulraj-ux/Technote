import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postAPI, categoryAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Breadcrumb from '../components/Breadcrumb';
import { useDebounce } from '../hooks/useDebounce';
import { Filter, SlidersHorizontal, ArrowUpDown, BookX } from 'lucide-react';

export default function BlogListing() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = searchParams.get('sort') || 'latest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortOption, setSortOption] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const debouncedSearch = useDebounce(search, 350);

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load Categories for Filter Bar
  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      })
      .catch((err) => console.warn('Could not load categories:', err.message));
  }, []);

  // Sync state to URL Query Params
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (sortOption !== 'latest') params.sort = sortOption;
    if (currentPage > 1) params.page = currentPage;

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, selectedCategory, sortOption, currentPage, setSearchParams]);

  // Fetch articles from MongoDB backend
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const queryParams = {
      page: currentPage,
      limit: 9,
      sort: sortOption
    };

    if (debouncedSearch) queryParams.search = debouncedSearch;
    if (selectedCategory && selectedCategory !== 'all') queryParams.category = selectedCategory;

    postAPI
      .getPublic(queryParams)
      .then((res) => {
        if (isMounted && res.data.success) {
          setPosts(res.data.posts);
          setTotalPages(res.data.totalPages || 1);
          setTotalPosts(res.data.totalPosts || 0);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch posts:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, selectedCategory, sortOption, currentPage]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortOption('latest');
    setCurrentPage(1);
  };

  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <div className="container">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'All Articles' }]} />

        <div style={{ marginBottom: '2.5rem', maxWidth: '780px' }}>
          <span className="section-label">Editorial Archive</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.85rem' }}>
            All Engineering Publications
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Explore technical deep dives, distributed systems patterns, cloud infrastructure architectures, and software craft written by senior engineers at TechNotes.
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-xs)',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ flex: '1 1 320px', maxWidth: '520px' }}>
            <SearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setCurrentPage(1);
              }}
              placeholder="Search by keywords, architecture, Kafka, React..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Sort:
            </span>
            <select
              className="form-control"
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: 'auto',
                minWidth: '160px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="latest">Latest Published</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular (Views)</option>
              <option value="readingTime">Shortest Read</option>
            </select>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '2rem'
          }}
        >
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.85rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              border: selectedCategory === 'all' ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
              backgroundColor: selectedCategory === 'all' ? 'var(--primary)' : '#ffffff',
              color: selectedCategory === 'all' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
          >
            All Categories
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => handleCategoryChange(cat.slug)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                  backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>{cat.name}</span>
                {cat.articleCount > 0 && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      opacity: 0.8,
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg-subtle)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-pill)'
                    }}
                  >
                    {cat.articleCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{posts.length}</strong> of{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{totalPosts}</strong> published article
            {totalPosts !== 1 ? 's' : ''}
            {debouncedSearch && <span> matching "{debouncedSearch}"</span>}
          </div>
          {(debouncedSearch || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                fontSize: '0.825rem',
                fontWeight: 600,
                color: 'var(--primary)',
                textDecoration: 'underline'
              }}
            >
              Reset filters
            </button>
          )}
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
            <div
              style={{
                width: '32px',
                height: '32px',
                border: '3px solid var(--border-subtle)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem'
              }}
            />
            <p style={{ color: 'var(--text-muted)' }}>Loading technical publications...</p>
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
              We couldn't find any published articles matching your criteria. Try adjusting your search keywords or browsing other categories.
            </p>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 180, behavior: 'smooth' });
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
