import React, { useState, useEffect } from 'react';
import { authorAPI, uploadAPI } from '../services/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import {
  Users,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  User,
  Upload,
  Twitter,
  Linkedin,
  Github,
  X
} from 'lucide-react';

export default function AuthorManagement() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    biography: '',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    twitterUrl: '',
    linkedinUrl: '',
    githubUrl: ''
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [alert, setAlert] = useState(null);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const res = await authorAPI.getAll();
      if (res.data.success) {
        setAuthors(res.data.authors);
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to load authors.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      email: '',
      designation: 'Senior Software Engineer',
      biography: '',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      twitterUrl: '',
      linkedinUrl: '',
      githubUrl: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (author) => {
    setIsEditing(true);
    setCurrentId(author._id);
    setFormData({
      name: author.name,
      email: author.email,
      designation: author.designation || '',
      biography: author.biography || '',
      profileImage: author.profileImage || '',
      twitterUrl: author.twitterUrl || '',
      linkedinUrl: author.linkedinUrl || '',
      githubUrl: author.githubUrl || ''
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploadingImage(true);
    try {
      const res = await uploadAPI.uploadImage(data);
      if (res.data.success) {
        setFormData((prev) => ({ ...prev, profileImage: res.data.url }));
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Failed to upload author image.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setAlert(null);

    try {
      if (isEditing) {
        await authorAPI.update(currentId, formData);
        setAlert({ type: 'success', message: 'Author profile updated successfully.' });
      } else {
        await authorAPI.create(formData);
        setAlert({ type: 'success', message: 'Author profile created successfully.' });
      }
      setModalOpen(false);
      await loadAuthors();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save author.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!authorToDelete) return;
    setActionLoading(true);
    try {
      await authorAPI.delete(authorToDelete._id);
      setDeleteModalOpen(false);
      setAuthorToDelete(null);
      setAlert({ type: 'success', message: 'Author profile deleted successfully.' });
      await loadAuthors();
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete author.'
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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Author Management</h1>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
            Manage editorial contributors, researcher profiles, and publication attributions
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          <PlusCircle size={16} />
          <span>Add New Author</span>
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
              <th style={{ width: '60px' }}>Avatar</th>
              <th>Author Name</th>
              <th>Designation</th>
              <th>Email</th>
              <th>Articles</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Loading authors...</p>
                </td>
              </tr>
            ) : authors.length > 0 ? (
              authors.map((auth) => (
                <tr key={auth._id}>
                  <td>
                    <img
                      src={auth.profileImage}
                      alt={auth.name}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </td>
                  <td>
                    <strong style={{ fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                      {auth.name}
                    </strong>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {auth.designation}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {auth.email}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-gray">
                      {auth.articleCount || 0} article{auth.articleCount !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.3rem 0.5rem' }}
                        title="Edit author"
                        onClick={() => openEditModal(auth)}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '0.3rem 0.5rem', color: 'var(--status-danger)' }}
                        title="Delete author"
                        onClick={() => {
                          setAuthorToDelete(auth);
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
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No authors found.</p>
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
            style={{ padding: '2rem', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {isEditing ? 'Edit Author Profile' : 'Add New Contributor'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}
              >
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. FERI"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="feri@gmail.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Designation / Role *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Principal Cloud Architect"
                  required
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Profile Avatar Image</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <img
                    src={formData.profileImage}
                    alt=""
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://..."
                    value={formData.profileImage}
                    onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  />
                </div>
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', gap: '0.4rem' }}>
                  <Upload size={14} />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Avatar File (Multer)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label">Author Biography</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Professional background, expertise, and research domains..."
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Twitter URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://twitter.com/..."
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>LinkedIn URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  />
                </div>
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
                  {actionLoading ? 'Saving...' : isEditing ? 'Update Author' : 'Create Author'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Author Profile"
        message={`Are you sure you want to delete ${authorToDelete?.name}? You cannot delete authors who currently have attributed articles.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setAuthorToDelete(null);
        }}
        loading={actionLoading}
      />
    </div>
  );
}
