import React, { useEffect, useState } from 'react';
import AcademicSidebar from './AcademicSidebar';
import axios from '../../api/axiosInstance';
import Select from 'react-select';

const COURSES_API_URL = 'http://localhost:8080/api/courses';
const LECTURERS_API_URL = 'http://localhost:8080/api/staff';

const CourseManagement = () => {
  const [activeNavItem, setActiveNavItem] = useState("Courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    credits: 1,
    lecturerIds: []
  });
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
    fetchLecturers();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(COURSES_API_URL);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setCourses(data);
    } catch (error) {
      console.error("Failed to fetch courses", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLecturers = async () => {
    try {
      const res = await axios.get(LECTURERS_API_URL);
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

  const handleAddCourse = () => {
    setShowAddForm(true);
    setEditingCourse(null);
    setFormData({
      id: '',
      name: '',
      code: '',
      credits: 1,
      lecturerIds: []
    });
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course.id);
    setFormData({
      ...course,
      lecturerIds: course.lecturerIds || []
    });
    setShowAddForm(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`${COURSES_API_URL}/${courseId}`);
        fetchCourses();
      } catch (error) {
        console.error("Failed to delete course", error);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = {
        code: formData.code,
        name: formData.name,
        credits: formData.credits,
        lecturerIds: formData.lecturerIds
      };
      if (editingCourse) {
        await axios.put(`${COURSES_API_URL}/${editingCourse}`, data);
      } else {
        await axios.post(COURSES_API_URL, data);
      }
      fetchCourses();
      setShowAddForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error("Failed to save course", error);
      alert("Failed to save course. Please check all fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCourse(null);
  };

  const getLecturerNames = (course) => {
    if (course.lecturerNames && course.lecturerNames.length > 0) {
      return Array.from(course.lecturerNames).join(', ');
    }
    return 'No lecturers assigned';
  };

  const filteredCourses = courses.filter(course =>
    (course.name && course.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (course.code && course.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const lecturerOptions = lecturers.map(l => ({
    value: l.id,
    label: `${l.name} (${l.code})`
  }));

  const creditOptions = [
    { value: 1, label: '1 Credit' },
    { value: 2, label: '2 Credits' },
    { value: 3, label: '3 Credits' },
    { value: 4, label: '4 Credits' }
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
    multiValue: (provided) => ({
      ...provided,
      background: 'rgba(249, 115, 22, 0.2)',
      borderRadius: '8px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.8)',
      '&:hover': {
        background: 'rgba(239, 68, 68, 0.3)',
        color: 'white',
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
    clearIndicator: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.6)',
      '&:hover': {
        color: '#ef4444',
      },
    }),
  };

  const handleLecturerSelectChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      lecturerIds: selectedOptions.map(option => option.value)
    }));
  };

  return (
    <div className="course-management">
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
          <h1>Course Management</h1>

          {!showAddForm ? (
            <>
              <div className="controls">
                <input
                  type="text"
                  placeholder="Search by course name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleAddCourse} disabled={loading}>
                  <i className="fa fa-plus" /> Add New Course
                </button>
              </div>

              {loading ? (
                <div className="loading">Loading courses...</div>
              ) : (
                <table className="course-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Course Name</th>
                      <th>Code</th>
                      <th>Credits</th>
                      <th>Lecturers</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                          No courses found
                        </td>
                      </tr>
                    ) : (
                      filteredCourses.map((course) => (
                        <tr key={course.id}>
                          <td>{course.id}</td>
                          <td>{course.name}</td>
                          <td>{course.code}</td>
                          <td>{course.credits}</td>
                          <td>{getLecturerNames(course)}</td>
                          <td>
                            <button onClick={() => handleEditCourse(course)} className="edit-btn" disabled={loading}>
                              <i className="fa fa-edit" />
                            </button>
                            <button onClick={() => handleDeleteCourse(course.id)} className="delete-btn" disabled={loading}>
                              <i className="fa fa-trash" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <div className="form-overlay">
              <div className="form-section">
                <h2>{editingCourse ? "Edit Course" : "Add New Course"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Course Name</label>
                  <input 
                    type="text" 
                    placeholder="Course Name" 
                    required 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  />
                </div>

                <div className="form-group">
                  <label>Course Code</label>
                  <input 
                    type="text" 
                    placeholder="Course Code (e.g., CS101)" 
                    required 
                    value={formData.code} 
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Credits</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Enter credits (1-10)"
                      required
                      value={formData.credits}
                      onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Lecturers (Search & Select Multiple)</label>
                    <Select
                      isMulti
                      options={lecturerOptions}
                      value={lecturerOptions.filter(opt => formData.lecturerIds.includes(opt.value))}
                      onChange={handleLecturerSelectChange}
                      placeholder="Search lecturers..."
                      styles={customSelectStyles}
                      isSearchable={true}
                      isClearable={true}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#FF453A',
                          primary75: 'rgba(249, 115, 22, 0.75)',
                          primary50: 'rgba(249, 115, 22, 0.5)',
                          primary25: 'rgba(249, 115, 22, 0.25)',
                        },
                      })}
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <button type="button" onClick={handleCancel} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (editingCourse ? 'Update' : 'Add Course')}
                  </button>
                </div>
              </form>
            </div>
            </div>
          )}
        </main>
      </div>


      <style>{`
        .course-management {
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

        .controls button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .controls button i {
          font-size: 16px;
        }

        .controls button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .controls button:active:not(:disabled) {
          transform: translateY(0);
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
        }

        .course-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
        }

        .course-table thead {
          background: rgba(255, 255, 255, 0.03);
        }

        .course-table th {
          padding: 20px 24px;
          text-align: left;
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .course-table td {
          padding: 20px 24px;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          font-weight: 400;
        }

        .course-table tbody tr {
          transition: all 0.3s ease;
        }

        .course-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.03);
          transform: translateY(-1px);
        }

        .course-table tbody tr:last-child td {
          border-bottom: none;
        }

        .course-table td:last-child {
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

        .edit-btn:disabled, .delete-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .edit-btn {
          color: rgba(59, 130, 246, 0.8);
        }

        .edit-btn:hover:not(:disabled) {
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          transform: scale(1.1);
        }

        .delete-btn {
          color: rgba(239, 68, 68, 0.8);
        }

        .delete-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          transform: scale(1.1);
        }

        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1002;
          padding: 20px;
        }

        .form-section {
          background: rgba(255, 255, 255, 0.02);
          padding: 32px;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          position: relative;
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
        .form-section select,
        .form-section textarea {
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
          font-family: inherit;
          resize: vertical;
        }

        .form-section input::placeholder,
        .form-section textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }

        .form-section input:focus,
        .form-section select:focus,
        .form-section textarea:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .form-section select option {
          background: #1a1a1a;
          color: white;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
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

        .lecturer-checkboxes {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 16px;
          max-height: 200px;
          overflow-y: auto;
          backdrop-filter: blur(10px);
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          cursor: pointer;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          text-transform: none;
          letter-spacing: normal;
          font-weight: 400;
          transition: color 0.3s ease;
        }

        .checkbox-label:hover {
          color: white;
        }

        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          padding: 0;
          margin: 0;
          accent-color: #FF453A;
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

        .form-buttons button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-buttons button[type="button"] {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .form-buttons button[type="button"]:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          transform: translateY(-1px);
        }

        .form-buttons button[type="submit"] {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .form-buttons button[type="submit"]:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .form-buttons button[type="submit"]:active:not(:disabled) {
          transform: translateY(0);
        }

        .lecturer-checkboxes::-webkit-scrollbar {
          width: 6px;
        }

        .lecturer-checkboxes::-webkit-scrollbar-track {
          background: transparent;
        }

        .lecturer-checkboxes::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: none;
        }

        .lecturer-checkboxes::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
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
          
          .course-table {
            font-size: 14px;
          }
          
          .course-table th,
          .course-table td {
            padding: 12px 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseManagement;