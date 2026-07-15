import React, { useEffect, useState } from 'react';
import AcademicSidebar from './AcademicSidebar';
import axios from '../../api/axiosInstance';
import Header from './components/Header';
import Select from 'react-select';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const API_URL = 'https://reidconnect-api.duckdns.org/api/staff';

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
    rank: ''
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
      rank: ''
    });
  };

  const handleEditLecturer = (lecturer) => {
    setEditingLecturer(lecturer.id);
    setFormData(lecturer);
    setShowAddForm(true);
  };

  const handleDeleteLecturer = async (lecturerId) => {
    try {
      await axios.delete(`${API_URL}/${lecturerId}`);
      fetchLecturers();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Lecturer has been removed successfully.',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Cannot Delete Lecturer',
          background: 'rgba(20, 20, 20, 0.95)',
          color: 'white',
          text: error.response.data,
          confirmButtonColor: '#ff3e3e'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unexpected Error',
          text: 'Something went wrong while deleting the lecturer.',
          confirmButtonColor: '#ff3e3e'
        });
      }
    }
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

  const facultyOptions = [
    { value: 'UCSC', label: 'UCSC' },
    { value: 'FOS', label: 'FOS' },
    { value: 'STAT', label: 'STAT' },
    { value: 'ALL', label: 'ALL' }
  ];

  const rankOptions = [
    { value: 'PROFESSOR', label: 'Professor' },
    { value: 'DEPARTMENT_HEAD', label: 'Department Head' },
    { value: 'SENIOR_LECTURER', label: 'Senior Lecturer' },
    { value: 'LECTURER', label: 'Lecturer' },
    { value: 'LECTURER_PROBATIONARY', label: 'Lecturer (Probationary)' },
    { value: 'INSTRUCTOR_PERMANENT', label: 'Permanent Instructor' },
    { value: 'SENIOR_LECTURER_ON_CONTRACT', label: 'Senior Lecturer (On Contract)' },
    { value: 'LECTURER_ON_CONTRACT', label: 'Lecturer (On Contract)' },
    { value: 'ASSISTANT_LECTURER_TEMPORARY', label: 'Assistant Lecturers' },
    { value: 'INSTRUCTOR_TEMPORARY', label: 'Temporary Instructor' },
  ];

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      background: 'rgba(255, 255, 255, 0.03)',
      border: `1px solid ${state.isFocused ? 'rgba(249, 115, 22, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
      borderRadius: '12px',
      padding: '4px 8px',
      color: 'white',
      fontSize: '15px',
      fontWeight: '400',
      backdropFilter: 'blur(10px)',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(249, 115, 22, 0.1)' : 'none',
      minHeight: '40px',
      '&:hover': {
        border: '1px solid rgba(249, 115, 22, 0.3)',
      },
    }),
    menu: (provided) => ({
      ...provided,
      background: 'rgba(20, 20, 20, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '8px',
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isFocused ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
      color: state.isSelected ? '#FF453A' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: '8px',
      margin: '2px 0',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: state.isSelected ? '600' : '400',
      '&:hover': {
        background: 'rgba(249, 115, 22, 0.2)',
        color: 'white',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.4)',
      fontSize: '15px',
      fontWeight: '400',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    input: (provided) => ({
      ...provided,
      color: 'white',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      background: 'rgba(255, 255, 255, 0.1)',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.6)',
      '&:hover': {
        color: '#FF453A',
      },
    }),
  };

  return (
    <div className={`dashboard-container ${showAddForm ? 'blur-background' : ''}`}>
      <Header />

      {showAddForm && (
        <>
          <div className="notification-overlay" onClick={handleCancel}></div>
          <div className="form-popup">
            <div className="form-header">
              <h3>{editingLecturer ? "Edit Lecturer" : "Add New Lecturer"}</h3>
              <button className="close-btn" onClick={handleCancel}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="form-content">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <div className="form-group">
                  <label>Name</label>
                  <input 
                    type="text" 
                    placeholder="Name" 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label>Code</label>
                  <input 
                    type="text" 
                    placeholder="Code (3 letters)" 
                    required 
                    value={formData.code} 
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
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
                </div>

                <div className="form-group">
                  <label>Degree</label>
                  <input 
                    type="text" 
                    placeholder="Degree" 
                    value={formData.degree} 
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })} 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <Select
                      options={facultyOptions}
                      value={facultyOptions.find(opt => opt.value === formData.faculty)}
                      onChange={(selectedOption) => setFormData({ ...formData, faculty: selectedOption.value })}
                      placeholder="Select faculty..."
                      styles={customSelectStyles}
                      isSearchable={false}
                      isClearable={false}
                    />
                  </div>

                  <div className="form-group">
                    <label>Rank</label>
                    <Select
                      options={rankOptions}
                      value={rankOptions.find(opt => opt.value === formData.rank)}
                      onChange={(selectedOption) => setFormData({ ...formData, rank: selectedOption.value })}
                      placeholder="Select rank..."
                      styles={customSelectStyles}
                      isSearchable={false}
                      isClearable={false}
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="button" onClick={handleCancel}>Cancel</button>
                  <button type="submit">{editingLecturer ? 'Update' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      <div className="dashboard-content">
        <AcademicSidebar 
          activeItem={activeNavItem} 
          onNavigate={handleNavigation} 
          isDarkMode={true}
        />

        <main className="dashboard-main">
          <h2 className="page-title">Lecturer Management</h2>

          <div className="controls">
            <input
              className="search-input"
              type="text"
              placeholder="Search by name, email, code or degree..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="add-button" onClick={handleAddLecturer}>
              <i className="fa fa-plus" /> Add New
            </button>
          </div>

          <div className="table-container">
            <table className="lecturer-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Email</th>
                  <th>Department</th>
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
          </div>
        </main>
      </div>

      {/* Embedded CSS */}
      <style>{`
        .dashboard-container {
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          letter-spacing: -0.01em;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: white;
        }
          .header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 70px;
                    backdrop-filter: blur(20px);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 24px;
                    z-index: 1001;
                    transition: all 0.3s ease;
                    background: rgba(20, 20, 20, 0.95);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }

        .dashboard-container.blur-background .dashboard-content {
          filter: blur(8px);
          pointer-events: none;
        }

        .dashboard-container.blur-background .header {
          filter: blur(8px);
        }

        .notification-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          backdrop-filter: blur(4px);
        }

        .form-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          max-width: 90vw;
          max-height: 80vh;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          z-index: 9999;
          overflow: hidden;
          backdrop-filter: blur(20px);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        .form-header {
          padding: 20px 20px 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .form-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .form-content {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .form-content form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group input {
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

        .form-group input::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }

        .form-group input:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
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

        .dashboard-content {
          display: flex;
          padding-top: 70px;
          flex: 1;
          min-height: calc(100vh - 70px);
        }

        main.dashboard-main {
          flex: 1;
          padding: 40px;
          background: transparent;
          margin-left: 200px;
          overflow-y: auto;
          min-height: calc(100vh - 70px);
        }

        .page-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          letter-spacing: -0.03em;
          transition: all 0.3s ease;
          color: white;
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

        .search-input {
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 15px;
          font-weight: 400;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          outline: none;
          flex-grow: 1;
          min-width: 300px;
          box-sizing: border-box;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .add-button {
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

        .add-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .table-container {
          backdrop-filter: blur(8px);
          border-radius: 16px;
          overflow: hidden;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .lecturer-table {
          width: 100%;
          border-collapse: collapse;
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

        /* Responsive Design */
        @media (max-width: 1200px) {
          main.dashboard-main {
            margin-left: 0;
          }
        }

        @media (max-width: 768px) {
          main.dashboard-main {
            padding: 20px 12px;
          }
          
          .page-title {
            font-size: 24px;
            margin-bottom: 24px;
          }

          .controls {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          
          .search-input {
            min-width: unset;
            width: 100%;
          }
          
          .form-popup {
            width: 90vw;
            max-height: 90vh;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .lecturer-table {
            font-size: 14px;
          }
          
          .lecturer-table th,
          .lecturer-table td {
            padding: 12px 16px;
          }

          .lecturer-table th {
            font-size: 12px;
          }

          .edit-btn, .delete-btn {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default LecturerManagement;