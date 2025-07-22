import React, { useEffect, useState } from 'react';
import AcademicSidebar from './AcademicSidebar';
import axios from '../../api/axiosInstance';

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
  try {
    const res = await axios.get(API_URL);
    console.log("Full response:", res);
    console.log("Lecturers API response:", res.data);
    const data = Array.isArray(res.data) ? res.data : res.data.data || [];
    setLecturers(data);
  } catch (error) {
    console.error("Failed to fetch lecturers", error);
    setLecturers([]);
  }
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
                <div className="email-input-container">
                  <input 
                    type="text" 
                    placeholder="Enter username (e.g., john.doe)" 
                    required 
                    value={formData.email.replace('@ucsc.cmb.ac.lk', '')} 
                    onChange={(e) => {
                      const username = e.target.value.replace('@ucsc.cmb.ac.lk', '');
                      setFormData({ ...formData, email: username + '@ucsc.cmb.ac.lk' });
                    }}
                  />
                  <span className="email-domain">@ucsc.cmb.ac.lk</span>
                </div>
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

      <style>{`
        .lecturer-management {
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          min-height: 100vh;
          color: white;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          letter-spacing: -0.01em;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 1001;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .title {
          font-weight: 700;
          font-size: 22px;
          color: white;
          letter-spacing: -0.02em;
        }

        .title .highlight {
          color: #FF453A;
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .admin-info i {
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px;
          border-radius: 8px;
        }

        .admin-info i:hover {
          color: #FF453A;
          background: rgba(249, 115, 22, 0.1);
        }

        .admin-info span {
          font-size: 15px;
          font-weight: 500;
        }

        .layout {
          display: flex;
          padding-top: 70px;
          flex: 1;
          min-height: calc(100vh - 70px);
        }

        main.main-content {
          flex: 1;
          padding: 40px;
          background: transparent;
          margin-left: 200px;
          overflow-y: auto;
          min-height: calc(100vh - 70px);
        }

        main.main-content h1 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          color: white;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .controls {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
          align-items: center;
        }

        .controls input[type="text"] {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 14px 18px;
          color: white;
          font-size: 15px;
          flex-grow: 1;
          min-width: 300px;
          outline: none;
          transition: all 0.3s ease;
          font-weight: 400;
          backdrop-filter: blur(10px);
        }

        .controls input[type="text"]::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }

        .controls input[type="text"]:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .controls button {
          background: linear-gradient(135deg, #FF453A 0%, #FF453A 100%);
          border: none;
          border-radius: 12px;
          padding: 14px 24px;
          color: white;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .controls button i {
          font-size: 16px;
        }

        .controls button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .controls button:active {
          transform: translateY(0);
        }

        .lecturer-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
        }

        .lecturer-table thead {
          background: rgba(255, 255, 255, 0.03);
        }

        .lecturer-table th {
          padding: 20px 24px;
          text-align: left;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .lecturer-table td {
          padding: 20px 24px;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          font-weight: 400;
        }

        .lecturer-table tbody tr {
          transition: all 0.3s ease;
        }

        .lecturer-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.03);
          transform: translateY(-1px);
        }

        .lecturer-table tbody tr:last-child td {
          border-bottom: none;
        }

        .lecturer-table td:last-child {
          display: flex;
          gap: 12px;
          align-items: center;
          justify-content: flex-start;
        }

        .edit-btn, .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          padding: 10px;
          border-radius: 10px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
        }

        .edit-btn {
          color: rgba(59, 130, 246, 0.8);
        }

        .edit-btn:hover {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          transform: scale(1.1);
        }

        .delete-btn {
          color: rgba(239, 68, 68, 0.8);
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          transform: scale(1.1);
        }

        .form-section {
          background: rgba(255, 255, 255, 0.02);
          padding: 32px;
          border-radius: 20px;
          max-width: 500px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
        }

        .form-section h2 {
          margin-top: 0;
          margin-bottom: 28px;
          font-weight: 700;
          font-size: 26px;
          letter-spacing: -0.02em;
          color: white;
        }

        .form-section form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-section input,
        .form-section select {
          padding: 16px 20px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 15px;
          outline: none;
          background: rgba(255, 255, 255, 0.03);
          color: white;
          transition: all 0.3s ease;
          font-weight: 400;
          backdrop-filter: blur(10px);
        }

        .form-section input::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }

        .form-section input:focus,
        .form-section select:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .form-section select option {
          background: #1a1a1a;
          color: white;
        }

        .form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .form-buttons button {
          padding: 14px 28px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
        }

        .form-buttons button[type="button"] {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-buttons button[type="button"]:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          transform: translateY(-1px);
        }

        .form-buttons button[type="submit"] {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .form-buttons button[type="submit"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .form-buttons button[type="submit"]:active {
          transform: translateY(0);
        }

        .email-input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .email-input-container input {
          flex: 1;
          padding-right: 140px !important;
        }

        .email-domain {
          position: absolute;
          right: 16px;
          color: rgba(249, 115, 22, 0.8);
          font-size: 15px;
          font-weight: 500;
          pointer-events: none;
          user-select: none;
        }
        main.main-content::-webkit-scrollbar {
          width: 6px;
        }

        main.main-content::-webkit-scrollbar-track {
          background: transparent;
        }

        main.main-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: none;
        }

        main.main-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .controls input[type="text"] {
            min-width: unset;
            width: 100%;
          }
          
          .lecturer-table {
            font-size: 14px;
          }
          
          .lecturer-table th,
          .lecturer-table td {
            padding: 12px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default LecturerManagement;