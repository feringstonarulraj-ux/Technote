import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { postAPI, categoryAPI, tagAPI, authorAPI, uploadAPI } from '../services/api';
import {
  Save,
  ArrowLeft,
  Upload,
  Eye,
  FileCode,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  Calendar
} from 'lucide-react';

export default function PostEditor() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [authors, setAuthors] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    featuredImageCaption: '',
    category: '',
    tags: [],
    author: '',
    status: 'draft',
    isFeatured: false,
    scheduledAt: '',
    seoTitle: '',
    metaDescription: '',
    canonicalUrl: ''
  });

  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto generate slug from title when creating
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    const updates = { title: newTitle };
    if (!isEditMode && (!formData.slug || formData.slug === slugify(formData.title))) {
      updates.slug = slugify(newTitle);
    }
    if (!formData.seoTitle || formData.seoTitle === formData.title) {
      updates.seoTitle = newTitle;
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Load Categories, Tags, Authors
  useEffect(() => {
    Promise.all([categoryAPI.getAll(), tagAPI.getAll(), authorAPI.getAll()])
      .then(([catRes, tagRes, authRes]) => {
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
          // Set default category if none set
          if (!isEditMode && catRes.data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, category: catRes.data.categories[0]._id }));
          }
        }
        if (tagRes.data.success) setTags(tagRes.data.tags);
        if (authRes.data.success) {
          setAuthors(authRes.data.authors);
          // Set default author if none set
          if (!isEditMode && authRes.data.authors.length > 0) {
            setFormData((prev) => ({ ...prev, author: authRes.data.authors[0]._id }));
          }
        }
      })
      .catch((err) => console.error('Error loading metadata:', err));
  }, [isEditMode]);

  // Load existing post if editing
  useEffect(() => {
    if (isEditMode) {
      postAPI
        .getByIdAdmin(id)
        .then((res) => {
          if (res.data.success) {
            const p = res.data.post;
            setFormData({
              title: p.title || '',
              slug: p.slug || '',
              excerpt: p.excerpt || '',
              content: p.content || '',
              featuredImage: p.featuredImage || '',
              featuredImageCaption: p.featuredImageCaption || '',
              category: p.category?._id || p.category || '',
              tags: p.tags ? p.tags.map((t) => (t._id ? t._id : t)) : [],
              author: p.author?._id || p.author || '',
              status: p.status || 'draft',
              isFeatured: !!p.isFeatured,
              scheduledAt: p.scheduledAt ? new Date(p.scheduledAt).toISOString().slice(0, 16) : '',
              seoTitle: p.seoTitle || '',
              metaDescription: p.metaDescription || '',
              canonicalUrl: p.canonicalUrl || ''
            });
          }
        })
        .catch((err) => setError(err.response?.data?.message || 'Failed to load article'))
        .finally(() => setInitialLoading(false));
    }
  }, [id, isEditMode]);

  // Handle Multer image upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploadingImage(true);
    setError('');

    try {
      const res = await uploadAPI.uploadImage(data);
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, featuredImage: res.data.url }));
        setSuccessMsg('Image uploaded successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Content formatting insertion helpers
  const insertFormatting = (before, after = '') => {
    const textarea = document.getElementById('article-content-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previous = textarea.value;
    const selected = previous.substring(start, end) || 'text';

    const replacement = `${before}${selected}${after}`;
    const nextValue = previous.substring(0, start) + replacement + previous.substring(end);

    setFormData((prev) => ({ ...prev, content: nextValue }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  // Form submission
  const handleSubmit = async (e, forcedStatus = null) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...formData,
      status: forcedStatus || formData.status
    };

    if (payload.status === 'scheduled' && !payload.scheduledAt) {
      setError('Please choose a scheduled publication date and time.');
      setLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        const res = await postAPI.update(id, payload);
        if (res.data.success) {
          setSuccessMsg('Article updated successfully.');
          setTimeout(() => navigate('/admin/posts'), 800);
        }
      } else {
        const res = await postAPI.create(payload);
        if (res.data.success) {
          setSuccessMsg('Article published/created successfully.');
          setTimeout(() => navigate('/admin/posts'), 800);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving article');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading article data for editing...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/admin/posts" className="btn btn-outline btn-sm">
            <ArrowLeft size={15} />
            <span>Articles</span>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {isEditMode ? 'Edit Publication' : 'Write New Publication'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={loading}
            onClick={(e) => handleSubmit(e, 'draft')}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={loading}
            onClick={(e) => handleSubmit(e, formData.status === 'draft' ? 'published' : formData.status)}
          >
            <Save size={15} />
            <span>{loading ? 'Saving...' : isEditMode ? 'Update Article' : 'Publish / Save'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
          <CheckCircle size={18} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e)}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 340px',
            gap: '2rem',
            alignItems: 'start'
          }}
          className="editor-grid"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Article Title *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Architecting High-Throughput Event-Driven Microservices with Kafka"
                required
                style={{ fontSize: '1.25rem', fontWeight: 700, padding: '0.75rem 1rem' }}
                value={formData.title}
                onChange={handleTitleChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">URL Slug *</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRight: 'none',
                    padding: '0.625rem 0.75rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-muted)',
                    borderRadius: 'var(--radius-md) 0 0 var(--radius-md)'
                  }}
                >
                  /blog/
                </span>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}
                  placeholder="article-url-slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Editorial Excerpt / Subtitle *</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Short, compelling executive summary displayed on cards and search results..."
                required
                value={formData.excerpt}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    excerpt: e.target.value,
                    metaDescription: formData.metaDescription || e.target.value
                  });
                }}
              />
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-light)',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'var(--bg-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      backgroundColor: activeTab === 'write' ? '#ffffff' : 'transparent',
                      color: activeTab === 'write' ? 'var(--primary)' : 'var(--text-secondary)',
                      boxShadow: activeTab === 'write' ? 'var(--shadow-xs)' : 'none'
                    }}
                  >
                    Write Content (HTML / Markdown)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      backgroundColor: activeTab === 'preview' ? '#ffffff' : 'transparent',
                      color: activeTab === 'preview' ? 'var(--primary)' : 'var(--text-secondary)',
                      boxShadow: activeTab === 'preview' ? 'var(--shadow-xs)' : 'none'
                    }}
                  >
                    <Eye size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Live Reader Preview
                  </button>
                </div>

                {activeTab === 'write' && (
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', fontWeight: 700 }}
                      onClick={() => insertFormatting('<h2>', '</h2>')}
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', fontWeight: 700 }}
                      onClick={() => insertFormatting('<h3>', '</h3>')}
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', fontWeight: 700 }}
                      onClick={() => insertFormatting('<strong>', '</strong>')}
                    >
                      B
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', fontStyle: 'italic' }}
                      onClick={() => insertFormatting('<em>', '</em>')}
                    >
                      I
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                      onClick={() => insertFormatting('<blockquote><p>', '</p></blockquote>')}
                    >
                      Quote
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                      onClick={() => insertFormatting('<pre><code class="language-javascript">\n', '\n</code></pre>')}
                    >
                      Code
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                      onClick={() => insertFormatting('<ul>\n  <li>', '</li>\n</ul>')}
                    >
                      List
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                      onClick={() => insertFormatting('<a href="https://..." target="_blank">', '</a>')}
                    >
                      Link
                    </button>
                  </div>
                )}
              </div>

              {activeTab === 'write' ? (
                <textarea
                  id="article-content-editor"
                  className="form-control"
                  style={{
                    border: 'none',
                    borderRadius: 0,
                    minHeight: '440px',
                    fontFamily: 'var(--font-code)',
                    fontSize: '0.925rem',
                    lineHeight: 1.6,
                    padding: '1.25rem'
                  }}
                  placeholder="Write comprehensive article content. HTML tags such as <h2>, <p>, <blockquote>, <pre><code>, <table>, <ul>, and <li> are natively supported..."
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              ) : (
                <div
                  style={{
                    padding: '2rem',
                    minHeight: '440px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div
                    className="article-prose"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(formData.content || '<p><em>No content entered yet.</em></p>')
                    }}
                  />
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Search Engine Optimization (SEO)</h3>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="form-label">SEO Page Title</label>
                  <span style={{ fontSize: '0.75rem', color: formData.seoTitle.length > 60 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                    {formData.seoTitle.length} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Custom title tag for Google search results"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label className="form-label">Meta Description</label>
                  <span style={{ fontSize: '0.75rem', color: formData.metaDescription.length > 160 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                    {formData.metaDescription.length} / 160 characters
                  </span>
                </div>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Search snippet description for SERPs and Open Graph..."
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                Publishing Controls
              </h3>

              <div className="form-group">
                <label className="form-label">Article Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">Draft (Internal)</option>
                  <option value="published">Published (Public)</option>
                  <option value="scheduled">Scheduled (Future release)</option>
                  <option value="unpublished">Unpublished (Hidden)</option>
                </select>
              </div>

              {formData.status === 'scheduled' && (
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} />
                    <span>Publication Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    required={formData.status === 'scheduled'}
                  />
                  <div className="form-hint">
                    The background scheduler automatically publishes the article when this time is reached.
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label
                  htmlFor="featured-checkbox"
                  style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
                >
                  Feature in Hero Editorial Section
                </label>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                Metadata & Attribution
              </h3>

              <div className="form-group">
                <label className="form-label">Category Domain *</label>
                <select
                  className="form-control"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category...</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Author Attribution *</label>
                <select
                  className="form-control"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                >
                  <option value="">Select Author...</option>
                  {authors.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assign Technology Tags</label>
                <div
                  style={{
                    maxHeight: '140px',
                    overflowY: 'auto',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.5rem'
                  }}
                >
                  {tags.map((t) => {
                    const isChecked = formData.tags.includes(t._id);
                    return (
                      <label
                        key={t._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem',
                          padding: '0.25rem 0',
                          cursor: 'pointer'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({ ...formData, tags: [...formData.tags, t._id] });
                            } else {
                              setFormData({
                                ...formData,
                                tags: formData.tags.filter((item) => item !== t._id)
                              });
                            }
                          }}
                        />
                        <span>#{t.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>
                Featured Cover Image
              </h3>

              {formData.featuredImage && (
                <div
                  style={{
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <img
                    src={formData.featuredImage}
                    alt="Featured preview"
                    style={{ width: '100%', height: '140px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://..."
                  required
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Or Upload Image File (Multer)</label>
                <label
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', cursor: 'pointer', gap: '0.4rem' }}
                >
                  <Upload size={14} />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload from Computer'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Image Caption / Credits</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Distributed telemetry dashboard topology"
                  value={formData.featuredImageCaption}
                  onChange={(e) => setFormData({ ...formData, featuredImageCaption: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 900px) {
          .editor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
