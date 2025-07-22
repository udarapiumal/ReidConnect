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
      {/* Main Content */}
      <main className="main-content">
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 className="heading">Search Student</h2>

          <div className="input-group">
            <input
              type="text"
              placeholder="Enter student registration number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <button onClick={handleSearch} className="button">
              Search
            </button>
          </div>

          {user && (
            <div className="user-profile-card">
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
                    console.log('✓ Image loaded successfully:', e.target.src);
                    e.target.style.border = '3px solid #22c55e'; // Green border on success
                  }}
                  onError={(e) => {
                    console.log('✗ Failed to load profile picture:', e.target.src);
                    e.target.style.border = '3px solid #dc2626'; // Red border on error
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

          {error && <p className="error">{error}</p>}
        </div>
      </main>

      <style jsx>{`
        /* Main content - Dark Theme */
        .main-content {
          margin-left: 200px;
          padding: 2rem;
          min-height: 100vh;
          background-color: #1a1c1e;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        h2.heading {
          font-size: 24px;
          color: #ffffff;
          margin-bottom: 1.5rem;
          text-align: center;
          border-bottom: 2px solid #ef4444;
          padding-bottom: 0.5rem;
        }

        .input-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .input {
          padding: 12px;
          flex: 1;
          min-width: 250px;
          border-radius: 6px;
          border: 1px solid #333;
          font-size: 16px;
          background-color: #2a2a2a;
          color: #ffffff;
        }

        .button {
          padding: 12px 20px;
          background-color: #ef4444;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .button:hover {
          background-color: #dc2626;
        }

        /* User Profile Card - Dark Theme */
        .user-profile-card {
          background-color: #151718;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 20px;
          color: white;
          width: 100%;
          margin-top: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

        .error {
          color: #ef4444;
          margin-top: 1rem;
          text-align: center;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .input-group {
            justify-content: stretch;
            flex-direction: column;
          }

          .input, .button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default SearchUser;