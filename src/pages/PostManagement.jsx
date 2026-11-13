import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postAPI, categoryAPI } from '../services/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import Pagination from '../components/Pagination';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  FileEdit,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export default function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Status toggle loading map
  const [toggleLoading, setToggleLoading] = useState({});

  useEffect(() => {
    categoryAPI
      .getAll()
      .then((res) => {
        if (res.data.success) setCategories(res.data.categories);
      })
      .catch((err) => console.warn('Could not fetch categories:', err));
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await postAPI.getAllAdmin({
        page: currentPage,
        limit: 10,
        status: statusFilter,
        category: categoryFilter,
        search: search.trim()
      });

      if (res.data.success) {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages || 1);
        setTotalPosts(res.data.totalPosts || 0);
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [statusFilter, categoryFilter, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPosts();
  };

  const handleTogglePublish = async (post) => {
    setToggleLoading((prev) => ({ ...prev, [post._id]: true }));
    try {
      await postAPI.togglePublish(post._id);
      await loadPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update publication status');
    } finally {
      setToggleLoading((prev) => ({ ...prev, [post._id]: false }));
    }
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    setDeleteLoading(true);
    try {
      await postAPI.delete(postToDelete._id);
      setDeleteModalOpen(false);
      setPostToDelete(null);
      await loadPosts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete article');
    } finally {
      setDeleteLoading(false);
    }
  };

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Articles Management</h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
            Create, edit, publish, schedule, or remove technical publications
          </p>
        </div>

        <Link to="/admin/posts/new" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Write New Article</span>
        </Link>
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
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: '1 1 260px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '2.5rem', height: '40px', fontSize: '0.875rem' }}
              placeholder="Filter by title or excerpt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-outline btn-sm">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 'auto', height: '40px', fontSize: '0.875rem' }}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="scheduled">Scheduled</option>
            <option value="unpublished">Unpublished</option>
          </select>

          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 'auto', height: '40px', fontSize: '0.875rem' }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="data-table-wrapper" style={{ boxShadow: 'var(--shadow-xs)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>Cover</th>
              <th>Article Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Status</th>
              <th>Reads</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Loading articles...</p>
                </td>
              </tr>
            ) : posts.length > 0 ? (
              posts.map((post) => {
                const isToggleBusy = toggleLoading[post._id];

                return (
                  <tr key={post._id}>
                    <td>
                      <img
                        src={post.featuredImage}
                        alt=""
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '6px',
                          objectFit: 'cover'
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
                        {post.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                        /{post.slug}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>
                        {post.category?.name || 'Unassigned'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {post.author?.name || 'Anonymous'}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          post.status === 'published'
                            ? 'badge-success'
                            : post.status === 'draft'
                            ? 'badge-warning'
                            : post.status === 'scheduled'
                            ? 'badge-primary'
                            : 'badge-danger'
                        }`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {post.views || 0}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.3rem 0.5rem', color: 'var(--text-muted)' }}
                          title="Preview article"
                        >
                          <Eye size={14} />
                        </Link>

                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{
                            padding: '0.3rem 0.55rem',
                            fontSize: '0.75rem',
                            color: post.status === 'published' ? 'var(--status-warning)' : 'var(--status-success)'
                          }}
                          disabled={isToggleBusy}
                          onClick={() => handleTogglePublish(post)}
                          title={post.status === 'published' ? 'Unpublish to Draft' : 'Publish immediately'}
                        >
                          {post.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>

                        <Link
                          to={`/admin/posts/${post._id}/edit`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.3rem 0.5rem' }}
                          title="Edit article"
                        >
                          <Edit size={14} />
                        </Link>

                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '0.3rem 0.5rem', color: 'var(--status-danger)' }}
                          title="Delete article"
                          onClick={() => {
                            setPostToDelete(post);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No articles match your filter criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Article"
        message={`Are you sure you want to permanently delete "${postToDelete?.title}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setPostToDelete(null);
        }}
        loading={deleteLoading}
      />
    </div>
  );
}
