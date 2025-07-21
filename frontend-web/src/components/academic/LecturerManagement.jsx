import React, { useEffect, useState } from 'react';
import AcademicSidebar from './AcademicSidebar';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/staff';

const LecturerManagement = () => {
  const [activeNavItem, setActiveNavItem] = useState("Academic Staff");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    email: '',
    degree: '',
    faculty: 'UCSC',
    rank: 'LECTURER'
  });
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    const res = await axios.get(API_URL);
    setLecturers(res.data);
  };

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
  };

  const handleAddLecturer = () => {
    setShowAddForm(true);
    setEditingLecturer(null);
    setFormData({
      id: '',
      name: '',
      code: '',
      email: '',
      degree: '',
      faculty: 'UCSC',
      rank: 'LECTURER'
    });
  };

  const handleEditLecturer = (lecturer) => {
    setEditingLecturer(lecturer.id);
    setFormData(lecturer);
    setShowAddForm(true);
  };

  const handleDeleteLecturer = async (lecturerId) => {
    await axios.delete(`${API_URL}/${lecturerId}`);
    fetchLecturers();
  };

  const handleSubmit = async () => {
    const data = { ...formData };
    if (editingLecturer) {
      await axios.put(`${API_URL}/${editingLecturer}`, data);
    } else {
      await axios.post(API_URL, data);
    }
    fetchLecturers();
    setShowAddForm(false);
    setEditingLecturer(null);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingLecturer(null);
  };

  const filteredLecturers = lecturers.filter(lecturer =>
    lecturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecturer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecturer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lecturer.degree.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="lecturer-management">
      <header className="header">
        <div className="title">ReidConnect <span className="highlight">AcademicAdmin</span></div>
        <div className="admin-info">
          <i className="fa fa-bell" />
          <i className="fa fa-user" />
          <span>Admin</span>
        </div>
      </header>

      <div className="layout">
        <AcademicSidebar activeItem={activeNavItem} onNavigate={handleNavigation} />
        <main className="main-content">
          <h1>Lecturer Management</h1>

          {!showAddForm ? (
            <>
              <div className="controls">
                <input
                  type="text"
                  placeholder="Search by name, email, code or degree..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleAddLecturer}>
                  <i className="fa fa-plus" /> Add New
                </button>
              </div>

              <table className="lecturer-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Email</th>
                    <th>Faculty</th>
                    <th>Rank</th>
                    <th>Degree</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLecturers.map((lecturer) => (
                    <tr key={lecturer.id}>
                      <td>{lecturer.id}</td>
                      <td>{lecturer.name}</td>
                      <td>{lecturer.code}</td>
                      <td>{lecturer.email}</td>
                      <td>{lecturer.faculty}</td>
                      <td>{lecturer.rank}</td>
                      <td>{lecturer.degree}</td>
                      <td>
                        <button onClick={() => handleEditLecturer(lecturer)} className="edit-btn">
                          <i className="fa fa-edit" />
                        </button>
                        <button onClick={() => handleDeleteLecturer(lecturer.id)} className="delete-btn">
                          <i className="fa fa-trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div className="form-section">
              <h2>{editingLecturer ? "Edit Lecturer" : "Add New Lecturer"}</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="text" placeholder="Code (3 letters)" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
                <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                <input type="text" placeholder="Degree" value={formData.degree} onChange={(e) => setFormData({ ...formData, degree: e.target.value })} />
                <select value={formData.faculty} onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}>
                  <option value="UCSC">UCSC</option>
                  <option value="FOS">FOS</option>
                  <option value="ALL">ALL</option>
                </select>
                <select value={formData.rank} onChange={(e) => setFormData({ ...formData, rank: e.target.value })}>
                  <option value="SENIOR_LECTURER">Senior Lecturer</option>
                  <option value="LECTURER">Lecturer</option>
                  <option value="ASSOCIATE_PROFESSOR">Associate Professor</option>
                  <option value="PROFESSOR">Professor</option>
                  <option value="DEPARTMENT_HEAD">Department Head</option>
                  <option value="ACADEMIC_SUPPORT_STAFF">Academic Support Staff</option>
                </select>
                <div className="form-buttons">
                  <button type="button" onClick={handleCancel}>Cancel</button>
                  <button type="submit">{editingLecturer ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

      <style>{`
        .lecturer-management {
          background-color: #1a1a1a;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          background-color: #2a2a2a;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          z-index: 1001;
        }

        .title {
          font-weight: bold;
          font-size: 20px;
          color: white;
        }

        .title .highlight {
          color: #ef4444;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 16px;
          color: white;
        }

        .admin-info i {
          font-size: 20px;
          cursor: pointer;
        }

        .admin-info span {
          font-size: 14px;
        }

        .layout {
          display: flex;
          padding-top: 64px; /* header height */
          flex: 1;
          min-height: calc(100vh - 64px);
        }

        main.main-content {
          flex: 1;
          padding: 32px;
          background-color: #1a1a1a;
          margin-left: 200px; /* width of sidebar */
          overflow-y: auto;
          min-height: calc(100vh - 64px);
        }

        main.main-content h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 24px;
          color: white;
        }

        .controls {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }

        .controls input[type="text"] {
          background-color: #333;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          color: white;
          font-size: 14px;
          flex-grow: 1;
          min-width: 240px;
          outline: none;
          transition: background-color 0.3s;
        }

        .controls input[type="text"]:focus {
          background-color: #444;
        }

        .controls button {
          background-color: #ef4444;
          border: none;
          border-radius: 8px;
          padding: 10px 18px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.3s;
        }

        .controls button i {
          font-size: 16px;
        }

        .controls button:hover {
          background-color: #dc2626;
        }

        /* Category sections */
        .category-section {
          margin-bottom: 40px;
        }

        .category-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .category-label {
          font-weight: 700;
          font-size: 18px;
          color: white;
        }

        .category-count {
          font-size: 14px;
          color: #9ca3af;
          font-weight: 600;
        }

        /* Table */
        .table-container {
          background-color: #2a2a2a;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0,0,0,0.6);
          overflow-x: auto;
          border: 1px solid #444;
        }

        .table-header, .table-row {
          display: grid;
          grid-template-columns: 60px 60px 1.5fr 2fr 1.2fr 1.8fr 120px;
          align-items: center;
          padding: 12px 16px;
          gap: 12px;
          color: #d1d5db;
        }

        .table-header {
          font-weight: 700;
          font-size: 14px;
          background-color: #333;
          border-bottom: 1px solid #444;
          text-transform: uppercase;
          user-select: none;
        }

        .table-row {
          border-bottom: 1px solid #444;
          color: white;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .table-row:hover {
          background-color: #3b3b3b;
        }

        .lecturer-img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 50%;
          border: 1px solid #555;
        }

        .actions {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .actions button {
          background: none;
          border: none;
          cursor: pointer;
          color: #9ca3af;
          font-size: 18px;
          padding: 4px;
          border-radius: 6px;
          transition: background-color 0.3s, color 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }

        .actions button.edit-btn:hover {
          background-color: #2563eb;
          color: white;
        }

        .actions button.delete-btn:hover {
          background-color: #dc2626;
          color: white;
        }

        /* Form section */
        .form-section {
          background-color: #2a2a2a;
          padding: 24px;
          border-radius: 12px;
          max-width: 480px;
          box-shadow: 0 0 10px rgba(0,0,0,0.7);
          color: white;
        }

        .form-section h2 {
          margin-top: 0;
          margin-bottom: 24px;
          font-weight: 700;
          font-size: 24px;
        }

        .form-section form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-section input,
        .form-section select {
          padding: 10px 14px;
          border-radius: 8px;
          border: none;
          font-size: 14px;
          outline: none;
          background-color: #333;
          color: white;
          transition: background-color 0.3s;
        }

        .form-section input:focus,
        .form-section select:focus {
          background-color: #444;
        }

        .image-preview {
          margin-top: 8px;
          text-align: center;
        }

        .image-preview p {
          margin-bottom: 8px;
          font-size: 14px;
          color: #9ca3af;
        }

        .image-preview img {
          max-width: 80px;
          max-height: 80px;
          border-radius: 12px;
          object-fit: cover;
          border: 1px solid #555;
        }

        .form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 12px;
        }

        .form-buttons button {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s;
          min-width: 80px;
        }

        .form-buttons button[type="button"] {
          background-color: #444;
          color: white;
        }

        .form-buttons button[type="button"]:hover {
          background-color: #555;
        }

        .form-buttons button[type="submit"] {
          background-color: #ef4444;
          color: white;
        }

        .form-buttons button[type="submit"]:hover {
          background-color: #dc2626;
        }

        /* Scrollbar */
        main.main-content::-webkit-scrollbar {
          width: 8px;
        }
        main.main-content::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        main.main-content::-webkit-scrollbar-thumb {
          background-color: #444;
          border-radius: 20px;
          border: 2px solid #1a1a1a;
        }
      `}</style>

export default LecturerManagement;
