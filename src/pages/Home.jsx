import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  postAPI,
  categoryAPI
} from '../services/api';
import FeaturedArticle from '../components/FeaturedArticle';
import BlogCard from '../components/BlogCard';
import CategoryList from '../components/CategoryList';
import Newsletter from '../components/Newsletter';
import { ArrowRight, Flame, Sparkles, BookOpen, Clock } from 'lucide-react';

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomepageData() {
      try {
        const [featRes, latestRes, popRes, catRes] = await Promise.all([
          postAPI.getFeatured(4),
          postAPI.getPublic({ page: 1, limit: 6, sort: 'latest' }),
          postAPI.getPopular(5),
          categoryAPI.getAll()
        ]);

        if (isMounted) {
          if (featRes.data.success) setFeaturedPosts(featRes.data.posts);
          if (latestRes.data.success) setLatestPosts(latestRes.data.posts);
          if (popRes.data.success) setPopularPosts(popRes.data.posts);
          if (catRes.data.success) setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomepageData();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroPost = featuredPosts[0] || latestPosts[0];
  const secondaryFeatured = featuredPosts.slice(1, 4);

  return (
    <div className="home-page" style={{ paddingBottom: '5rem' }}>
      <section
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-light)',
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="section-label">TechNotes Publication</span>
            <h1
              style={{
                fontSize: '2.75rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                letterSpacing: '-0.03em',
                marginBottom: '1rem'
              }}
            >
              Architectural Insights & Engineering Perspectives
            </h1>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: '1.5rem'
              }}
            >
              Written by software architects, distributed systems engineers, and research leads. Practical lessons in cloud-native platforms, AI/ML inference, zero-trust security, and high-performance software craft.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/blogs" className="btn btn-primary">
                <span>Browse All Articles</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn btn-outline">
                <span>About Our Publication</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {heroPost && (
        <section style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
          <div className="container">
            <FeaturedArticle post={heroPost} />
          </div>
        </section>
      )}

      {secondaryFeatured.length > 0 && (
        <section style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
          <div className="container">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="section-label">Curated Selection</span>
                <h2 className="section-title">Editor's Recommended Reading</h2>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.75rem'
              }}
            >
              {secondaryFeatured.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        style={{
          paddingTop: '4rem',
          paddingBottom: '4rem',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-light)',
          borderBottom: '1px solid var(--border-light)'
        }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-label">Knowledge Domains</span>
            <h2 className="section-title">Explore by Technology Category</h2>
            <p className="section-description">
              Browse our architectural blueprints, technical retrospectives, and deep dives across specialized computing domains.
            </p>
          </div>

          <CategoryList categories={categories} />
        </div>
      </section>

      <section style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)',
              gap: '3.5rem'
            }}
            className="latest-layout-grid"
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  marginBottom: '2rem'
                }}
              >
                <div>
                  <span className="section-label">Fresh Off the Press</span>
                  <h2 className="section-title" style={{ fontSize: '1.85rem' }}>
                    Latest Publications
                  </h2>
                </div>
                <Link
                  to="/blogs"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 600,
                    fontSize: '0.925rem',
                    color: 'var(--primary)'
                  }}
                >
                  <span>View All Archive</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {latestPosts.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.75rem'
                  }}
                >
                  {latestPosts.map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: '3rem',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <p>No published articles found.</p>
                </div>
              )}
            </div>

            <div>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  boxShadow: 'var(--shadow-xs)',
                  position: 'sticky',
                  top: '90px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.25rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border-light)'
                  }}
                >
                  <Flame size={20} style={{ color: '#ea580c' }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                    Most Read This Month
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {popularPosts.map((post, idx) => (
                    <div
                      key={post._id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: idx < 3 ? 'var(--primary)' : 'var(--text-subtle)',
                          lineHeight: 1,
                          width: '22px'
                        }}
                      >
                        0{idx + 1}
                      </span>
                      <div style={{ flex: 1 }}>
                        {post.category && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: 'var(--primary)',
                              display: 'block',
                              marginBottom: '0.2rem'
                            }}
                          >
                            {post.category.name}
                          </span>
                        )}
                        <h4 style={{ fontSize: '0.95rem', lineHeight: 1.4, fontWeight: 600 }}>
                          <Link
                            to={`/blog/${post.slug}`}
                            style={{ color: 'var(--text-primary)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                          >
                            {post.title}
                          </Link>
                        </h4>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            marginTop: '0.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <Clock size={11} />
                          <span>{post.readingTime || 5} min read</span>
                          <span>•</span>
                          <span>{post.views || 0} reads</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginTop: '2rem',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 700,
                      fontSize: '0.825rem',
                      color: 'var(--text-primary)',
                      marginBottom: '0.4rem'
                    }}
                  >
                    <BookOpen size={15} style={{ color: 'var(--primary)' }} />
                    <span>Editorial Standards</span>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Every article published on TechNotes is authored and code-reviewed by active practitioners before release.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: '2rem' }}>
        <div className="container">
          <Newsletter />
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .latest-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
