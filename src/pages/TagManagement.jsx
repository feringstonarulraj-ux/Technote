import React, { useState, useEffect } from 'react';
import { tagAPI } from '../services/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { Tag as TagIcon, PlusCircle, Edit, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function TagManagement() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const loadTags = async () => {
    setLoading(true);
    try {
      const res = await tagAPI.getAll();
      if (res.data.success) {
        setTags(res.data.tags);
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load tags.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName('');
    setSlug('');
    setModalOpen(true);
  };

  const openEditModal = (tag) => {
    setIsEditing(true);
    setCurrentId(tag._id);
    setName(tag.name);
    setSlug(tag.slug);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setAlert(null);

    const payload = {
      name: name.trim(),
      slug: slug.trim() || name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    try {
      if (isEditing) {
        await tagAPI.update(currentId, payload);
        setAlert({ type: 'success', message: 'Tag updated successfully.' });
      } else {
        await tagAPI.create(payload);
        setAlert({ type: 'success', message: 'Tag created successfully.' });
      }
      setModalOpen(false);
      await loadTags();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save tag.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!tagToDelete) return;
    setActionLoading(true);
    try {
      await tagAPI.delete(tagToDelete._id);
      setDeleteModalOpen(false);
      setTagToDelete(null);
      setAlert({ type: 'success', message: 'Tag deleted successfully.' });
      await loadTags();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete tag.'
      });
      setDeleteModalOpen(false);
    } finally {
      setActionLoading(false);
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Technology Tags</h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
            Keywords and taxonomy for granular technical cross-referencing
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          <PlusCircle size={16} />
          <span>Add New Tag</span>
        </button>
      </div>

      {alert && (
        <div
          className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}
          style={{ marginBottom: '1.5rem' }}
        >
          {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{alert.message}</span>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading tags...</p>
        ) : tags.length > 0 ? (
          tags.map((tag) => (
            <div
              key={tag._id}
              className="card"
              style={{
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                  <TagIcon size={16} style={{ color: 'var(--primary)' }} />
                  <strong style={{ fontSize: '0.95rem' }}>#{tag.name}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                  {tag.articleCount || 0} articles tagged
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  style={{ padding: '0.25rem 0.45rem' }}
                  onClick={() => openEditModal(tag)}
                  title="Edit tag"
                >
                  <Edit size={13} />
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '0.25rem 0.45rem', color: 'var(--status-danger)' }}
                  onClick={() => {
                    setTagToDelete(tag);
                    setDeleteModalOpen(true);
                  }}
                  title="Delete tag"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No tags created yet.</p>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content"
            style={{ padding: '2rem', maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {isEditing ? 'Edit Tag' : 'Create New Tag'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Tag Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Distributed Systems"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!isEditing) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                    }
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">URL Slug *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="distributed-systems"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : isEditing ? 'Update Tag' : 'Create Tag'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Tag"
        message={`Are you sure you want to delete tag #${tagToDelete?.name}? It will be removed from all associated articles.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTagToDelete(null);
        }}
        loading={actionLoading}
      />
    </div>
  );
}
