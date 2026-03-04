import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../../config';

function SearchUser() {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 6;

  const token = localStorage.getItem("token");
  const extractRegNumber = (email) => email.split('@')[0];

  useEffect(() => {
    const fetchAllStudents = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/student/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const studentsWithDetails = await Promise.all(
          response.data.map(async (stu) => {
            const res = await axios.get(`${API_BASE_URL}/users/search`, {
              params: { regNumber: extractRegNumber(stu.email) },
              headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
          })
        );

        setStudents(studentsWithDetails);
        setError('');
      } catch (err) {
        console.error(err);
        setError('Failed to fetch students');
      }
    };

    fetchAllStudents();
  }, [token]);

  const handleSearch = async () => {
    const regNumber = extractRegNumber(email.trim());
    if (!token) {
      alert("Please log in first");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/users/search`, {
        params: { regNumber },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setStudents([]);
      setError('');
      setCurrentPage(1);
    } catch (err) {
      setUser(null);
      setStudents([]);
      setError('User not found or error occurred');
    }
  };

  const renderStudentCard = (stu) => (
    <div className="su-card" key={stu.id}>
      <img
        src={
          stu.profilePicUrl
            ? `${API_BASE_URL}${stu.profilePicUrl}`
            : 'https://via.placeholder.com/100x100.png?text=No+Image'
        }
        alt="Profile"
        className="su-avatar"
        loading="lazy"
      />
      <div className="su-card-info">
        <div className="su-card-name">
          <h3>{stu.studentName || stu.name || stu.username}</h3>
        </div>

        <div className="su-details">
          <div className="su-detail-row">
            <strong>Email:</strong>
            <span>{stu.email}</span>
          </div>
          <div className="su-detail-row">
            <strong>Academic Year:</strong>
            <span>{stu.academicYear}</span>
          </div>
          <div className="su-detail-row">
            <strong>Contact:</strong>
            <span>{stu.contactNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Pagination calculations
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(students.length / studentsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="su-header-bar">
        <div className="su-header-left">
          <span className="su-title">ReidConnect</span>
          <span className="su-title su-highlight">UnionAdmin</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="su-main-content">
        <h2 className="su-page-title">Profile Management</h2>

        <header className="su-section-header">
          <div className="su-section-text">
            <h3 className="su-section-subtitle">Search Students</h3>
            <p>Search by registration number or view all registered students</p>
          </div>

          <div className="su-controls">
            <div className="su-search-bar">
              <Search className="su-search-icon" size={18} />
              <input
                type="text"
                placeholder="Enter student registration number..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="su-search-input"
              />
            </div>

            <button className="su-search-btn" onClick={handleSearch}>
              <User size={18} />
              Search Student
            </button>
          </div>
        </header>

        {error && (
          <div className="su-no-results">
            <h3>No Results Found</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Show single user */}
        {user && <div className="su-grid">{renderStudentCard(user)}</div>}

        {/* Show all students with pagination */}
        {!user && currentStudents.length > 0 && (
          <>
            <div className="su-grid">
              {currentStudents.map((stu) => renderStudentCard(stu))}
            </div>
            {/* Pagination Controls */}
            <div className="su-pagination">
              <button
                className="su-page-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`su-page-btn ${currentPage === page ? 'su-page-active' : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="su-page-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}

        {!user && students.length === 0 && !error && (
          <div className="su-no-results">
            <h3>Loading...</h3>
            <p>Please wait while we fetch all students.</p>
          </div>
        )}
      </main>

      <style>{`
        .su-main-content {
          margin-left: 200px;
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
          padding-top: 70px; /* Offset for fixed header */
        }

        .su-header-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 70px;
          backdrop-filter: blur(20px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 1200;
          background: rgba(20, 20, 20, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .su-header-left {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .su-title {
          font-weight: 700;
          font-size: 22px;
          color: white;
          letter-spacing: -0.02em;
        }

        .su-highlight {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .su-page-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .su-section-header {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 28px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .su-section-subtitle {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .su-section-text p {
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 20px;
          font-size: 14px;
        }

        .su-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .su-search-bar {
          position: relative;
          flex: 1;
          max-width: 600px;
        }

        .su-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
        }

        .su-search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 400;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          outline: none;
          backdrop-filter: blur(10px);
          box-sizing: border-box;
        }

        .su-search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .su-search-input:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .su-search-btn {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
          font-size: 15px;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .su-search-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .su-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          max-width: 1200px;
        }

        .su-card {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          transition: all 0.3s ease;
          padding: 20px;
        }

        .su-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .su-avatar {
          width: 80px;
          height: 80px;
          object-fit: cover;
          margin: 10px auto 16px;
          display: block;
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          border-radius: 50%;
        }

        .su-card:hover .su-avatar {
          border-color: #FF453A;
          transform: scale(1.05);
        }

        .su-card-info {
          text-align: center;
        }

        .su-card-name {
          margin-bottom: 16px;
        }

        .su-card-name h3 {
          color: #ffffff;
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .su-details {
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 12px;
        }

        .su-detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .su-detail-row:not(:last-child) {
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .su-detail-row strong {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .su-detail-row span {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 400;
          font-size: 14px;
        }

        .su-no-results {
          text-align: center;
          padding: 80px 20px;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .su-no-results h3 {
          color: #ffffff;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .su-no-results p {
          color: rgba(255, 255, 255, 0.5);
        }

        .su-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 32px;
        }

        .su-page-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          min-width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .su-page-btn:hover:not(:disabled):not(.su-page-active) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(249, 115, 22, 0.3);
          color: white;
          transform: translateY(-1px);
        }

        .su-page-active {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          border-color: #FF453A;
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
          font-weight: 600;
        }

        .su-page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .su-main-content {
            margin-left: 0;
            padding: 20px 12px;
          }

          .su-page-title {
            font-size: 24px;
          }

          .su-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .su-search-bar, .su-search-btn {
            width: 100%;
            max-width: none;
          }

          .su-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default SearchUser;
