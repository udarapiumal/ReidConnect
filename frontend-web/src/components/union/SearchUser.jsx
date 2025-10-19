import React, { useState } from 'react';
import axios from 'axios';
import { Search, User } from 'lucide-react';
import '../../components/academic/styles/TimeTable.css';

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

  const headerStyles = {
    headerBar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '70px',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      zIndex: 1200,
      background: 'rgba(20, 20, 20, 0.95)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0px',
    },
    reidConnect: {
      fontWeight: 700,
      fontSize: '22px',
      color: 'white',
      letterSpacing: '-0.02em',
    },
    highlight: {
      fontWeight: 700,
      fontSize: '22px',
      color: '#FF0033',
      background: 'linear-gradient(135deg, #FF0033 0%, #ea580c 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginLeft: '0px',
    },
    adminInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      color: 'rgba(255,255,255,0.8)',
    },
    headerIcon: {
      fontSize: '18px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '8px',
      transition: 'color 0.3s',
      color: '#fff',
    },
  };

  return (
    <div className="app-container">
      <header style={headerStyles.headerBar}>
        <div style={headerStyles.headerLeft}>
          <span style={headerStyles.reidConnect}>ReidConnect</span>
          <span style={headerStyles.highlight}>UnionAdmin</span>
        </div>
        <div style={headerStyles.adminInfo}>
          
        </div>
      </header>
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
                className="gallery-image round-image" // Add round-image or square-image class
                loading="lazy"
              />
              <div className="gallery-info">
                <div className="info-header">
                  <h3>{user.username}</h3>
                  <span className="gallery-category">{user.role}</span>
                </div>
                
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
          padding: 6rem;
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
          gap: 5rem;
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
          grid-template-columns: 1fr;
          gap: 1.5rem;
          padding: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .gallery-card {
          background-color: #151718;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #333;
          overflow: hidden;
          transition: all 0.3s ease;
          padding: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 12px rgba(239, 68, 68, 0.2);
        }

        .gallery-image {
          width: 100px;
          height: 100px;
          object-fit: cover;
          margin: 2rem auto;
          display: block;
          border: 3px solid #333;
          transition: all 0.3s ease;
        }

        /* Round Image Style */
        .round-image {
          border-radius: 50%;
        }

        /* Square Image Style */
        .square-image {
          border-radius: 15px;
        }

        .gallery-card:hover .gallery-image {
          border-color: #ef4444;
          transform: scale(1.05);
        }

        .gallery-info {
          padding: 1.5rem;
          text-align: center;
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .info-header h3 {
          color: #ffffff;
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .gallery-category {
          background-color: #ef4444;
          color: white;
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          text-transform: capitalize;
          margin: 0;
        }

        .user-details {
          margin-top: 1.5rem;
          border-top: 1px solid #2a2a2a;
          padding-top: 1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        .detail-item:not(:last-child) {
          border-bottom: 1px solid #2a2a2a;
        }

        .detail-item strong {
          color: #a1a1a1;
          font-weight: 500;
        }

        .detail-item span {
          color: #ffffff;
          font-weight: 400;
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

          .gallery-image {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
}

export default SearchUser;