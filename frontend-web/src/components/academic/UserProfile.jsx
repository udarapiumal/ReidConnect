import React, { useState } from 'react';

const UserProfile = ({ onClose }) => {
  const [user, setUser] = useState({
    name: 'Academic Admin',
    email: 'admin@reidconnect.edu',
    phone: '+1 (555) 123-4567',
    location: 'University Campus',
    bio: 'Academic administrator passionate about creating efficient educational systems and supporting student success.',
    joinDate: 'January 2023',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: user.location,
    bio: user.bio
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validateEditForm = () => {
    const newErrors = {};

    if (!editData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!editData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!editData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (validateEditForm()) {
      setUser(prev => ({ ...prev, ...editData }));
      setEditModalOpen(false);
      setErrors({});
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      setPasswordModalOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      alert('Password changed successfully!');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="profile-container">
      <div className="profile-overlay" onClick={onClose}></div>
      <div className="profile-modal">
        <div className="profile-content">
          {/* Header */}
          <div className="profile-header">
            <h1>Profile Settings</h1>
            <p>Manage your account information and preferences</p>
            <button className="close-btn" onClick={onClose}>
              <i className="fa fa-times"></i>
            </button>
          </div>

          {/* Main Profile Card */}
          <div className="profile-card">
            {/* Cover Section */}
            <div className="cover-section">
              <div className="avatar-section">
                <div className="avatar-wrapper">
                  <img src={user.avatar} alt="Profile" className="avatar" />
                  <button className="camera-btn">
                    <i className="fa fa-camera"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="profile-info">
              <div className="info-header">
                <div className="user-details">
                  <h2>{user.name}</h2>
                  <p>{user.bio}</p>
                </div>
                <div className="action-buttons">
                  <button
                    onClick={() => setEditModalOpen(true)}
                    className="edit-btn"
                  >
                    <i className="fa fa-edit"></i>
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className="password-btn"
                  >
                    <i className="fa fa-lock"></i>
                    Change Password
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="contact-grid">
                <div className="contact-column">
                  <div className="contact-item">
                    <i className="fa fa-envelope"></i>
                    <span>{user.email}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fa fa-phone"></i>
                    <span>{user.phone}</span>
                  </div>
                </div>
                <div className="contact-column">
                  <div className="contact-item">
                    <i className="fa fa-map-marker-alt"></i>
                    <span>{user.location}</span>
                  </div>
                  <div className="contact-item">
                    <i className="fa fa-calendar"></i>
                    <span>Member since {user.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && <p className="error">{errors.phone}</p>}
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Enter your location"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      <i className="fa fa-save"></i>
                      Save Changes
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

          {/* Change Password Modal */}
          {passwordModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content password-modal">
                <div className="modal-header">
                  <h3>Change Password</h3>
                  <button
                    onClick={() => setPasswordModalOpen(false)}
                    className="modal-close"
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>

                <form onSubmit={handlePasswordSubmit} className="modal-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="password-toggle"
                      >
                        <i className={`fa ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    {errors.currentPassword && <p className="error">{errors.currentPassword}</p>}
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="password-toggle"
                      >
                        <i className={`fa ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    {errors.newPassword && <p className="error">{errors.newPassword}</p>}
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <div className="password-input">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="password-toggle"
                      >
                        <i className={`fa ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn full-width">
                      <i className="fa fa-lock"></i>
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setPasswordModalOpen(false)}
                      className="cancel-btn full-width"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
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
          max-width: 900px;
          max-height: 90vh;
          overflow-y: auto;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.9);
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
          padding: 30px 30px 20px 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
        }

        .profile-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }

        .profile-header p {
          color: rgba(255, 255, 255, 0.6);
          margin: 0;
          font-size: 14px;
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 18px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .profile-card {
          margin: 20px 30px 30px 30px;
          background: linear-gradient(145deg, #333333 0%, #2e2e2e 100%);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cover-section {
          height: 120px;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          position: relative;
        }

        .avatar-section {
          position: absolute;
          bottom: -60px;
          left: 30px;
        }

        .avatar-wrapper {
          position: relative;
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid #2a2a2a;
          object-fit: cover;
        }

        .camera-btn {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .camera-btn:hover {
          background: #2563eb;
          transform: scale(1.1);
        }

        .profile-info {
          padding: 80px 30px 30px 30px;
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .user-details h2 {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0 0 8px 0;
          letter-spacing: -0.02em;
        }

        .user-details p {
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .edit-btn, .password-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-btn {
          background: #3b82f6;
          color: white;
        }

        .edit-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .password-btn {
          background: #ef4444;
          color: white;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .password-btn:hover {
          background: #dc2626;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .contact-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .contact-item i {
          color: #60a5fa;
          width: 18px;
          flex-shrink: 0;
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
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          width: 100%;
          max-width: 450px;
          max-height: 70vh;
          overflow-y: auto;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .password-modal {
          max-width: 400px;
        }

        .modal-header {
          padding: 20px 20px 12px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .modal-close {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 18px;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .modal-form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }

        .form-group input, .form-group textarea {
          width: 100%;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 70px;
        }

        .password-input {
          position: relative;
        }

        .password-input input {
          padding-right: 45px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          padding: 4px;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #ffffff;
        }

        .error {
          color: #ef4444;
          font-size: 12px;
          margin-top: 4px;
          margin-bottom: 0;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .save-btn, .cancel-btn {
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
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
          background: #3b82f6;
          color: white;
          border: none;
        }

        .save-btn:hover {
          background: #2563eb;
        }

        .cancel-btn {
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .full-width {
          width: 100%;
          margin-bottom: 12px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-modal {
            width: 95%;
            max-height: 95vh;
          }

          .profile-header {
            padding: 20px 20px 16px 20px;
          }

          .profile-header h1 {
            font-size: 24px;
          }

          .profile-card {
            margin: 16px 20px 20px 20px;
          }

          .profile-info {
            padding: 80px 20px 20px 20px;
          }

          .avatar-section {
            left: 20px;
          }

          .avatar {
            width: 100px;
            height: 100px;
          }

          .info-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .action-buttons {
            width: 100%;
          }

          .edit-btn, .password-btn {
            flex: 1;
            justify-content: center;
          }

          .contact-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .modal-content {
            margin: 10px;
            max-height: 90vh;
          }

          .modal-header, .modal-form {
            padding: 20px;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions .save-btn, .form-actions .cancel-btn {
            width: 100%;
            flex: none;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
