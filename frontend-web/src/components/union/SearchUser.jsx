import React, { useState } from 'react';
import axios from 'axios';

function SearchUser() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const extractRegNumber = (email) => {
    return email.split('@')[0];
  };

  const handleSearch = async () => {
    const regNumber = extractRegNumber(email.trim());

    const token = localStorage.getItem("token"); // get the JWT token

    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/users/search`, {
        params: { regNumber },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      setError('');

      console.log('User data received:', response.data);
    } catch (err) {
      setUser(null);
      setError('User not found or error occurred');
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <div className="form-container">
          <div className="form-header">
            <h1>Search Student</h1>
            <p>Enter a registration number to find a student</p>
          </div>

          <div className="form-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="regNumber">Registration Number</label>
                <input
                  type="text"
                  id="regNumber"
                  placeholder="Enter student registration number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-actions">
              <button onClick={handleSearch} className="btn-primary">
                <i className="fa fa-search" />
                Search Student
              </button>
            </div>

            {error && <p className="error">{error}</p>}

            {user && (
              <div className="user-profile-card enhanced-border">
                <div className="user-profile-header">User Found:</div>
                <div className="profile-pic-container">
                  <img 
                    src={
                      user.profilePicUrl
                        ? `http://localhost:8080${user.profilePicUrl}`
                        : user.profile_picture_url
                        ? `http://localhost:8080${user.profile_picture_url}`
                        : user.profilePictureUrl
                        ? `http://localhost:8080${user.profilePictureUrl}`
                        : 'https://via.placeholder.com/100x100.png?text=No+Image'
                    }
                    alt="Profile"
                    className="profile-pic"
                    onLoad={(e) => {
                      e.target.style.border = '3px solid #22c55e';
                    }}
                    onError={(e) => {
                      e.target.style.border = '3px solid #dc2626';
                      e.target.alt = 'Image failed to load';
                    }}
                  />
                </div>
                <div className="user-profile-detail">
                  <div className="user-profile-field">
                    <span className="user-profile-label">ID:</span>
                    <span className="user-profile-value">{user.id}</span>
                  </div>
                  <div className="user-profile-field">
                    <span className="user-profile-label">Username:</span>
                    <span className="user-profile-value">{user.username}</span>
                  </div>
                  <div className="user-profile-field">
                    <span className="user-profile-label">Email:</span>
                    <span className="user-profile-value">{user.email}</span>
                  </div>
                  <div className="user-profile-field">
                    <span className="user-profile-label">Role:</span>
                    <span className="user-profile-value">{user.role}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <style jsx>{`
        .main-content {
          margin-left: 200px;
          padding: 2rem;
          min-height: 100vh;
          background-color: #1a1a1a;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: #2a2a2a;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 2rem;
        }

        .form-header h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .form-header p {
          font-size: 14px;
          color: #d1d5db;
          margin-bottom: 1.5rem;
        }

        .form-content {
          background: #2a2a2a;
          border-radius: 8px;
        }

        .form-group {
          margin-bottom: 1.5rem;
          width: 100%;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 14px;
          color: #d1d5db;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #444;
          background-color: #1f1f1f;
          color: white;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-input:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .btn-primary {
          padding: 0.75rem 1.5rem;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #dc2626;
        }

        .error {
          color: #ef4444;
          margin-top: 1rem;
          text-align: center;
          font-weight: 500;
        }

        /* Keep existing user-profile-card styles */
        .user-profile-card {
          background-color: #151718;
          border: 2px solid #ef4444;
          border-radius: 12px;
          padding: 24px;
          color: white;
          width: 100%;
          margin-top: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
        }

        .enhanced-border {
          border: 2px solid #ef4444;
        }
        .user-profile-header {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 16px;
          color: #ffffff;
          border-bottom: 1px solid #333;
          padding-bottom: 8px;
        }
        .profile-pic-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .profile-pic {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #333;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: border-color 0.3s ease;
          background-color: #2a2a2a;
        }
        .user-profile-detail {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
        .user-profile-field {
          display: flex;
          flex-direction: column;
        }
        .user-profile-label {
          font-size: 12px;
          color: #a1a1a1;
          margin-bottom: 4px;
        }
        .user-profile-value {
          font-size: 14px;
          color: #ffffff;
          font-weight: 400;
        }
        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .form-container {
            padding: 1rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-primary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default SearchUser;