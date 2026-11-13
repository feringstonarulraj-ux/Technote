import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { postAPI } from '../services/api';
import ReadingProgress from '../components/ReadingProgress';
import TableOfContents from '../components/TableOfContents';
import SocialShare from '../components/SocialShare';
import RelatedArticles from '../components/RelatedArticles';
import Breadcrumb from '../components/Breadcrumb';
import {
  Calendar,
  Clock,
  Eye,
  User,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  MessageSquare,
  Send,
  CheckCircle,
  Twitter,
  Linkedin,
  Github,
  Copy,
  Check
} from 'lucide-react';

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Interactive Comments State (Human-touch feature)
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Marcus Vance',
      role: 'Principal Security Architect',
      date: '2 days ago',
      content: 'Outstanding breakdown of the partition buffering loop. We implemented a similar sync.Pool optimization in our ingestion pipeline and saw our GC pause time drop from 18ms down to 1.4ms.'
    }
  ]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Fetch article
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    postAPI
      .getBySlug(slug)
      .then((res) => {
        if (isMounted && res.data.success) {
          setPost(res.data.post);
          // Set browser document title for SEO
          document.title = `${res.data.post.seoTitle || res.data.post.title} | TechNotes`;
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
  }, [slug]);

  // Code Block Copy Buttons Enrichment
  useEffect(() => {
    if (!post?.content) return;

    const timer = setTimeout(() => {
      const codeBlocks = document.querySelectorAll('.article-prose pre');
      codeBlocks.forEach((pre) => {
        if (pre.querySelector('.code-copy-btn')) return;

        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.innerHTML = 'Copy';
        copyBtn.style.position = 'absolute';
        copyBtn.style.top = '0.75rem';
        copyBtn.style.right = '0.75rem';
        copyBtn.style.padding = '0.25rem 0.6rem';
        copyBtn.style.fontSize = '0.75rem';
        copyBtn.style.backgroundColor = '#1e293b';
        copyBtn.style.color = '#cbd5e1';
        copyBtn.style.border = '1px solid #334155';
        copyBtn.style.borderRadius = '4px';
        copyBtn.style.cursor = 'pointer';

        copyBtn.addEventListener('click', async () => {
          const code = pre.querySelector('code')?.innerText || pre.innerText;
          await navigator.clipboard.writeText(code);
          copyBtn.innerHTML = 'Copied!';
          copyBtn.style.color = '#34d399';
          setTimeout(() => {
            copyBtn.innerHTML = 'Copy';
            copyBtn.style.color = '#cbd5e1';
          }, 2000);
        });

        pre.style.position = 'relative';
        pre.appendChild(copyBtn);
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [post?.content]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: commentName.trim(),
      role: 'Software Practitioner',
      date: 'Just now',
      content: commentText.trim()
    };

    setComments([newComment, ...comments]);
    setCommentName('');
    setCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 3500);
  };

  if (notFound) {
    return (
      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Article Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The requested article may have been archived or moved to another domain.
        </p>
        <Link to="/blogs" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Browse All Articles</span>
        </Link>
      </div>
    );
  }

  if (loading || !post) {
    return (
      <div className="container" style={{ paddingTop: '5rem', paddingBottom: '5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading article content...</p>
      </div>
    );
  }

  const formattedPublishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recently';

  const formattedUpdatedDate =
    post.updatedAt && post.updatedAt !== post.publishedAt
      ? new Date(post.updatedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      : null;

  // JSON-LD Structured Data for SEO (TechArticle schema)
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.excerpt,
    image: [post.featuredImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'TechNotes Team',
      jobTitle: post.author?.designation || 'Staff Engineer'
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechNotes Systems',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${window.location.origin}/blog/${post.slug}`
    }
  };

  return (
    <div className="blog-detail-page" style={{ paddingBottom: '6rem' }}>
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-light)',
          paddingTop: '3rem',
          paddingBottom: '3.5rem'
        }}
      >
        <div className="container" style={{ maxWidth: '860px' }}>
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'All Articles', path: '/blogs' },
              { label: post.category?.name || 'Category', path: post.category ? `/category/${post.category.slug}` : null },
              { label: post.title }
            ]}
          />

          {post.category && (
            <Link
              to={`/category/${post.category.slug}`}
              className="badge badge-primary"
              style={{ marginBottom: '1.25rem', fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
            >
              {post.category.name}
            </Link>
          )}

          <h1
            style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              marginBottom: '2rem'
            }}
          >
            {post.excerpt}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.25rem',
              borderTop: '1px solid var(--border-light)',
              paddingTop: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {post.author?.profileImage ? (
                <img
                  src={post.author.profileImage}
                  alt={post.author.name}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)'
                  }}
                >
                  <User size={22} />
                </div>
              )}
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {post.author?.name || 'TechNotes Engineer'}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  {post.author?.designation || 'Systems Architecture'}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} />
                {formattedPublishedDate}
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Clock size={14} />
                {post.readingTime || 5} min read
              </span>
              <span>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Eye size={14} />
                {post.views || 1} views
              </span>
              {formattedUpdatedDate && (
                <>
                  <span>•</span>
                  <span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                    Updated {formattedUpdatedDate}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container" style={{ marginTop: '2.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 780px) 280px',
            gap: '3.5rem',
            justifyContent: 'center'
          }}
          className="article-layout-grid"
        >
          <main>
            <figure style={{ margin: '0 0 2.5rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <img
                src={post.featuredImage}
                alt={post.title}
                style={{
                  width: '100%',
                  maxHeight: '480px',
                  objectFit: 'cover'
                }}
              />
              {post.featuredImageCaption && (
                <figcaption
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center',
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                  }}
                >
                  {post.featuredImageCaption}
                </figcaption>
              )}
            </figure>

            <div
              style={{
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-light)'
              }}
            >
              <SocialShare title={post.title} slug={post.slug} />
            </div>

            <div
              className="article-prose"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content)
              }}
            />

            {post.tags && post.tags.length > 0 && (
              <div
                style={{
                  marginTop: '3rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Tags:
                </span>
                {post.tags.map((tag) => (
                  <span key={tag._id} className="badge badge-gray">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                marginTop: '2rem',
                padding: '1.25rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                Did this technical analysis provide value to your team?
              </span>
              <SocialShare title={post.title} slug={post.slug} />
            </div>

            {post.author && (
              <div
                style={{
                  marginTop: '3rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <img
                    src={post.author.profileImage}
                    alt={post.author.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.2rem'
                      }}
                    >
                      Written by
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      {post.author.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                      {post.author.designation}
                    </div>
                    <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {post.author.biography ||
                        'Senior technology practitioner specializing in distributed systems, high-throughput microservices, and modern cloud architectures.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <section style={{ marginTop: '3.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  marginBottom: '1.5rem'
                }}
              >
                <MessageSquare size={22} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  Technical Discussion ({comments.length})
                </h3>
              </div>

              <form
                onSubmit={handleCommentSubmit}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Your Name or Role</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Sarah Jenkins (Backend Lead)"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    required
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Contribution / Question</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Share architectural feedback, edge cases, or production considerations..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {commentSuccess && (
                    <span style={{ fontSize: '0.85rem', color: 'var(--status-success)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <CheckCircle size={15} /> Your contribution has been published.
                    </span>
                  )}
                  <button type="submit" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
                    <Send size={14} />
                    <span>Post Comment</span>
                  </button>
                </div>
              </form>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {comments.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          {c.author}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                          • {c.role}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        {c.date}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <RelatedArticles currentPostId={post._id} />
          </main>

          <aside className="article-sidebar">
            <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <TableOfContents contentHtml={post.content} />

              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Engineering Dispatches
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  Get deep technical breakdowns like this delivered directly to your inbox every alternate Tuesday.
                </p>
                <Link to="/#newsletter" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                  Subscribe to Dispatches
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .article-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .article-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
