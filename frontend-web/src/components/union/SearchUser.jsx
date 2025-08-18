import React, { useState } from 'react';
import axios from 'axios';
import { Search, User } from 'lucide-react';

function SearchUser() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const extractRegNumber = (email) => {
    return email.split('@')[0];
  };

  const handleSearch = async () => {
    const regNumber = extractRegNumber(email.trim());
    const token = localStorage.getItem("token");

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
    } catch (err) {
      setUser(null);
      setError('User not found or error occurred');
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <header className="gallery-header">
          <div className="header-text">
            <h1>Search Student</h1>
            <p>Enter a registration number to find a student</p>
          </div>

          <div className="controls">
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Enter student registration number..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="search-input"
              />
            </div>

            <button className="create-post-btn" onClick={handleSearch}>
              <User size={18} />
              Search Student
            </button>
          </div>
        </header>

        {error && (
          <div className="no-results">
            <h3>No Results Found</h3>
            <p>{error}</p>
          </div>
        )}

        {user && (
          <div className="gallery-grid">
            <div className="gallery-card">
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
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-info">
                <h3>{user.username}</h3>
                <p className="gallery-category">{user.role}</p>
                
                <div className="user-details">
                  <div className="detail-item">
                    <strong>ID:</strong>
                    <span>{user.id}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Email:</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        /* Main content - Dark Theme */
        .main-content {
          margin-left: 200px;
          padding: 2rem;
          min-height: 100vh;
          background-color: #1a1c1e;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #ffffff;
        }

        /* Gallery header */
        .gallery-header {
          background: #151718;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #333;
        }

        .header-text h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .header-text p {
          color: #a1a1a1;
          margin-bottom: 2rem;
        }

        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-bar {
          position: relative;
          flex: 1;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a1a1a1;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid #333;
          border-radius: 8px;
          background-color: #2a2a2a;
          color: #ffffff;
          font-size: 0.95rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
        }

        .create-post-btn {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }

        .create-post-btn:hover {
          background: #dc2626;
        }

        /* Gallery grid and card */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .gallery-card {
          background-color: #151718;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #333;
          overflow: hidden;
        }

        .gallery-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .gallery-info {
          padding: 1.5rem;
        }

        .gallery-info h3 {
          color: #ffffff;
          margin: 0 0 0.5rem;
          font-size: 1.25rem;
        }

        .gallery-category {
          background-color: #ef4444;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          display: inline-block;
          margin-bottom: 1rem;
        }

        .user-details {
          margin-top: 1rem;
          border-top: 1px solid #333;
          padding-top: 1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-item strong {
          color: #a1a1a1;
        }

        .detail-item span {
          color: #ffffff;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: #151718;
          border-radius: 8px;
          border: 1px solid #333;
        }

        .no-results h3 {
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .no-results p {
          color: #a1a1a1;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .controls {
            flex-direction: column;
          }

          .search-bar {
            width: 100%;
          }

          .create-post-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default SearchUser;