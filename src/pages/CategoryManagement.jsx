import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Layers,
  Code,
  Cpu,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Cloud,
  TrendingUp,
  X
} from 'lucide-react';

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: 'Layers'
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const availableIcons = [
    'Layers',
    'Code',
    'Cpu',
    'Smartphone',
    'Sparkles',
    'ShieldCheck',
    'Cloud',
    'TrendingUp'
  ];

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll();
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load categories' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', slug: '', description: '', icon: 'Layers' });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentId(cat._id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      icon: cat.icon || 'Layers'
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setAlert(null);

    try {
      if (isEditing) {
        await categoryAPI.update(currentId, formData);
        setAlert({ type: 'success', message: 'Category updated successfully.' });
      } else {
        await categoryAPI.create(formData);
        setAlert({ type: 'success', message: 'Category created successfully.' });
      }
      setModalOpen(false);
      await loadCategories();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save category.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    setActionLoading(true);
    try {
      await categoryAPI.delete(categoryToDelete._id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      setAlert({ type: 'success', message: 'Category deleted successfully.' });
      await loadCategories();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete category.'
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Category Management</h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
            Organize publications by domain topics and navigation hierarchies
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          <PlusCircle size={16} />
          <span>Add New Category</span>
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

      <div className="data-table-wrapper" style={{ boxShadow: 'var(--shadow-xs)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Slug / URL</th>
              <th>Description</th>
              <th>Articles Count</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Loading categories...</p>
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--primary-subtle)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FolderTree size={16} />
                      </div>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                        {cat.name}
                      </strong>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      /category/{cat.slug}
                    </span>
                  </td>
                  <td style={{ maxWidth: '380px' }}>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {cat.description || 'No description provided.'}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-gray">
                      {cat.articleCount || 0} article{cat.articleCount !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.5rem' }}
                        title="Edit category"
                        onClick={() => openEditModal(cat)}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '0.3rem 0.5rem', color: 'var(--status-danger)' }}
                        title="Delete category"
                        onClick={() => {
                          setCategoryToDelete(cat);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No categories configured yet.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="modal-content"
            style={{ padding: '2rem', maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {isEditing ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Distributed Systems"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData,
                      name,
                      slug: !isEditing ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : formData.slug
                    });
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="distributed-systems"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon Representation</label>
                <select
                  className="form-control"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  {availableIcons.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Summary of topics covered under this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {actionLoading ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Category"
        message={`Are you sure you want to delete the category "${categoryToDelete?.name}"? You cannot delete categories that currently have published articles.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        loading={actionLoading}
      />
    </div>
  );
}
