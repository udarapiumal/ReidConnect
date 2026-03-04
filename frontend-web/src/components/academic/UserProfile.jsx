import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';

const UserProfile = ({ onClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [editData, setEditData] = useState({ username: '', email: '' });
  const [editErrors, setEditErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users/me');
      setUser(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = () => {
    setEditData({
      username: user.username || user.name || '',
      email: user.email || '',
    });
    setEditErrors({});
    setEditModalOpen(true);
  };

  const validateEditForm = () => {
    const newErrors = {};
    if (!editData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!editData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!validateEditForm()) return;

    try {
      setSaving(true);
      const res = await axios.put('/users/me', {
        username: editData.username,
        email: editData.email,
      });
      setUser(res.data);
      setEditModalOpen(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setEditErrors({ submit: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete('/users/me');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Error disabling account:', err);
      setDeleteConfirmOpen(false);
      setError('Failed to deactivate account');
      setDeleting(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'academic_admin': return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
      case 'lecturer': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'student': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'club': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  };

  const formatRole = (role) => {
    if (!role) return 'Unknown';
    return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="profile-container">
      <div className="profile-overlay" onClick={onClose}></div>
      <div className="profile-modal">
        <div className="profile-content">
          {/* Header */}
          <div className="profile-header">
            <h1>My Profile</h1>
            <p>Your account information</p>
            <button className="close-btn" onClick={onClose}>
              <i className="fa fa-times"></i>
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="profile-loading">
              <div className="spinner"></div>
              <p>Loading profile...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="profile-error">
              <i className="fa fa-exclamation-circle"></i>
              <p>{error}</p>
              <button onClick={fetchProfile} className="retry-btn">
                <i className="fa fa-redo"></i> Retry
              </button>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="success-toast">
              <i className="fa fa-check-circle"></i>
              {successMessage}
            </div>
          )}

          {/* Profile Card */}
          {user && !loading && (
            <div className="profile-card">
              <div className="cover-section">
                <div className="avatar-section">
                  <div className="avatar-wrapper">
                    <div className="avatar-placeholder">
                      <i className="fa fa-user"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-info">
                <div className="info-header">
                  <div className="user-details">
                    <div className="name-row">
                      <h2>{user.username || user.name}</h2>
                      <span
                        className="role-badge"
                        style={{ background: getRoleBadgeColor(user.role) }}
                      >
                        {formatRole(user.role)}
                      </span>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button onClick={openEditModal} className="edit-btn">
                      <i className="fa fa-edit"></i>
                      Edit Profile
                    </button>
                    <button onClick={() => setDeleteConfirmOpen(true)} className="delete-btn">
                      <i className="fa fa-ban"></i>
                      Deactivate Account
                    </button>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fa fa-user"></i>
                    </div>
                    <div className="info-text">
                      <label>Username</label>
                      <span>{user.username || user.name}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fa fa-envelope"></i>
                    </div>
                    <div className="info-text">
                      <label>Email</label>
                      <span>{user.email}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fa fa-shield-alt"></i>
                    </div>
                    <div className="info-text">
                      <label>Role</label>
                      <span>{formatRole(user.role)}</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fa fa-id-badge"></i>
                    </div>
                    <div className="info-text">
                      <label>User ID</label>
                      <span>#{user.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          {editModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Edit Profile</h3>
                  <button
                    onClick={() => setEditModalOpen(false)}
                    className="modal-close"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter your username"
                    />
                    {editErrors.username && <p className="error">{editErrors.username}</p>}
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                    {editErrors.email && <p className="error">{editErrors.email}</p>}
                  </div>

                  {editErrors.submit && (
                    <div className="submit-error">
                      <i className="fa fa-exclamation-triangle"></i>
                      {editErrors.submit}
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={saving}>
                      {saving ? (
                        <>
                          <div className="btn-spinner"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-save"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditModalOpen(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {deleteConfirmOpen && (
            <div className="modal-overlay">
              <div className="modal-content delete-modal">
                <div className="delete-icon-wrapper">
                  <i className="fa fa-exclamation-triangle"></i>
                </div>
                <h3>Deactivate Account</h3>
                <p className="delete-warning">
                  Are you sure you want to deactivate your account? Your account will be
                  <strong> disabled</strong> and you will be logged out. Contact an administrator to reactivate.
                </p>
                <div className="form-actions">
                  <button
                    onClick={handleDelete}
                    className="confirm-delete-btn"
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <div className="btn-spinner"></div>
                        Deactivating...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-ban"></i>
                        Yes, Deactivate My Account
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmOpen(false)}
                    className="cancel-btn"
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .profile-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
        }

        .profile-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
        }

        .profile-modal {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          background: linear-gradient(145deg, #1e1e1e 0%, #252525 100%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
          animation: profileSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes profileSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -55%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .profile-content {
          padding: 0;
        }

        .profile-header {
          text-align: center;
          padding: 28px 28px 20px 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
        }

        .profile-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 6px 0;
          letter-spacing: -0.02em;
        }

        .profile-header p {
          color: rgba(255, 255, 255, 0.5);
          margin: 0;
          font-size: 13px;
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.06);
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
        }

        /* Loading & Error States */
        .profile-loading, .profile-error {
          text-align: center;
          padding: 60px 20px;
          color: rgba(255, 255, 255, 0.6);
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .profile-error i {
          font-size: 40px;
          color: #ef4444;
          margin-bottom: 12px;
          display: block;
        }

        .retry-btn {
          margin-top: 12px;
          padding: 8px 20px;
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
        }

        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
        }

        /* Success Toast */
        .success-toast {
          position: absolute;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          background: #059669;
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
          animation: toastFadeIn 0.3s ease;
          box-shadow: 0 4px 20px rgba(5, 150, 105, 0.3);
        }

        @keyframes toastFadeIn {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        /* Profile Card */
        .profile-card {
          margin: 20px 24px 24px 24px;
          background: linear-gradient(145deg, #2a2a2a 0%, #262626 100%);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cover-section {
          height: 80px;
          background: linear-gradient(135deg, #2a2a2a 0%, #333333 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          position: relative;
        }

        .avatar-section {
          position: absolute;
          bottom: -36px;
          left: 24px;
        }

        .avatar-wrapper {
          position: relative;
        }

        .avatar-placeholder {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 3px solid #1e1e1e;
          background: linear-gradient(145deg, #374151, #4b5563);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.7);
          font-size: 28px;
        }

        .profile-info {
          padding: 52px 24px 24px 24px;
        }

        .info-header {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .user-details h2 {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .edit-btn, .delete-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          white-space: nowrap;
        }

        .edit-btn {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .edit-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          transform: translateY(-1px);
        }

        /* Info Grid */
        .info-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.2s;
        }

        .info-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .info-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          flex-shrink: 0;
        }

        .info-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          min-width: 0;
        }

        .info-text label {
          font-size: 11px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-text span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          word-break: break-word;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 10001;
        }

        .modal-content {
          background: linear-gradient(145deg, #1e1e1e 0%, #222222 100%);
          border-radius: 16px;
          width: 100%;
          max-width: 420px;
          max-height: 80vh;
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
          animation: modalFadeIn 0.25s ease;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          padding: 20px 20px 14px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.06);
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.12);
        }

        .modal-form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input {
          width: 100%;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-group input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.05);
        }

        .error {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 0;
        }

        .submit-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .save-btn, .cancel-btn, .confirm-delete-btn {
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          flex: 1;
        }

        .save-btn {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .save-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.18);
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-btn {
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .cancel-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.05);
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* Delete Modal */
        .delete-modal {
          text-align: center;
          padding: 32px 24px 24px;
          max-width: 380px;
        }

        .delete-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #ef4444;
          font-size: 24px;
        }

        .delete-modal h3 {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 10px 0;
        }

        .delete-warning {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .confirm-delete-btn {
          background: #ef4444;
          color: white;
          border: none;
        }

        .confirm-delete-btn:hover:not(:disabled) {
          background: #dc2626;
        }

        .confirm-delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .profile-modal {
            width: 95%;
            max-height: 95vh;
          }

          .action-buttons {
            flex-direction: column;
          }

          .edit-btn, .delete-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
