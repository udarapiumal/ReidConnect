import React, { useEffect, useState } from 'react';
import AcademicSidebar from './AcademicSidebar';
import Header from './components/Header';
import axios from '../../api/axiosInstance';
import Select from 'react-select';

const COURSES_API_URL = 'https://reidconnect-api.duckdns.org/api/courses';
const LECTURERS_API_URL = 'https://reidconnect-api.duckdns.org/api/staff';
const VENUES_API_URL = 'https://reidconnect-api.duckdns.org/api/venues';

const CourseManagement = () => {
  const [activeNavItem, setActiveNavItem] = useState("Courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    lectureCredits: '',
    practicalCredits: '',
    lecturerIds: [],
    lectureVenueId: '',
    practicalVenueId: '',
    tutorialVenueId: '',
    degree: '',
    year: '',
  });
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchLecturers();
    fetchVenues();
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

  const fetchVenues = async () => {
    try {
      const res = await axios.get(VENUES_API_URL);
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setVenues(data);
    } catch (error) {
      console.error("Failed to fetch venues", error);
      setVenues([]);
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
      lectureCredits: '',
      practicalCredits: '',
      lecturerIds: [],
      lectureVenueId: '',
      practicalVenueId: '',
      tutorialVenueId: '',
      degree: '',
      year: '',
    });
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course.id);
    setFormData({
      ...course,
      lecturerIds: course.lecturerIds || [],
      lectureVenueId: course.lectureVenueId || '',
      practicalVenueId: course.practicalVenueId || '',
      tutorialVenueId: course.tutorialVenueId || ''
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

      const code = formData.code?.toUpperCase() || "";
      let degree = null;
      let year = null;

      if (code.startsWith("SCS")) {
        degree = "CS";
      } else if (code.startsWith("IS")) {
        degree = "IS";
      }

      // Extract year digit after prefix
      let prefixLength = 0;
      if (code.startsWith("SCS")) prefixLength = 3;
      else if (code.startsWith("IS")) prefixLength = 2;

      if (prefixLength > 0 && code.length > prefixLength) {
        const yearChar = code.charAt(prefixLength);
        if (["1", "2", "3", "4"].includes(yearChar)) {
          year = `YEAR_${yearChar}`;
        }
      }

      const data = {
        code: formData.code,
        name: formData.name,
        lectureCredits: formData.lectureCredits,
        practicalCredits: formData.practicalCredits,
        lecturerIds: formData.lecturerIds,
        lectureVenueId: formData.lectureVenueId,
        practicalVenueId: formData.practicalVenueId,
        tutorialVenueId: formData.tutorialVenueId,
        degree,
        year
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
    <div className={`dashboard-container ${showAddForm ? 'blur-background' : ''}`}>
      <Header />

      <div className="dashboard-content">
        <AcademicSidebar 
          activeItem={activeNavItem} 
          onNavigate={handleNavigation}
        />

        <main className="dashboard-main">
          <h2 className="page-title">Course Management</h2>

          {!showAddForm ? (
            <>
              <div className="controls">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by course name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={handleAddCourse} disabled={loading} className="add-btn">
                  <i className="fa fa-plus" /> Add New Course
                </button>
              </div>

              {loading ? (
                <div className="loading">Loading courses...</div>
              ) : (
                <div className="table-container">
                  <table className="course-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Course Name</th>
                        <th>Code</th>
                        <th>Lecture Venue</th>
                        <th>Practical Venue</th>
                        <th>Tutorial Venue</th>
                        <th>Lecture Credits</th>
                        <th>Practical Credits</th>
                        <th>Lecturers</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '40px' }}>
                            No courses found
                          </td>
                        </tr>
                      ) : (
                        filteredCourses.map((course) => (
                          <tr key={course.id}>
                            <td>{course.id}</td>
                            <td>{course.name}</td>
                            <td>{course.code}</td>
                            <td>{course.lectureVenueName || '-'}</td>
                            <td>{course.practicalVenueName || '-'}</td>
                            <td>{course.tutorialVenueName || '-'}</td>
                            <td>{course.lectureCredits}</td>
                            <td>{course.practicalCredits}</td>
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
                </div>
              )}
            </>
          ) : null}
        </main>
      </div>

      {showAddForm && (
        <>
          <div className="form-overlay" onClick={handleCancel}></div>
          <div className="form-popup">
            <div className="form-header">
              <h3>{editingCourse ? "Edit Course" : "Add New Course"}</h3>
              <button className="close-btn" onClick={handleCancel}>
                <i className="fa fa-times"></i>
              </button>
            </div>
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
                  placeholder="Course Code (e.g., SCS 101)" 
                  required 
                  value={formData.code} 
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })} 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Lecture Credits</label>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    placeholder="Enter credits (1-4)"
                    required
                    value={formData.lectureCredits}
                    onChange={(e) => setFormData({ ...formData, lectureCredits: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="form-group">
                  <label>Practical Credits</label>
                  <input
                    type="number"
                    min="0"
                    max="8"
                    placeholder="Enter credits (1-8)"
                    required
                    value={formData.practicalCredits}
                    onChange={(e) => setFormData({ ...formData, practicalCredits: parseInt(e.target.value) || 1 })}
                  />
                </div>
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

              <div className="form-row">
                <div className="form-group">
                  <label>Lecture Venue</label>
                  <select
                    value={formData.lectureVenueId}
                    onChange={(e) => setFormData({ ...formData, lectureVenueId: e.target.value })}
                  >
                    <option value="">Select Lecture Venue</option>
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} ({venue.faculty})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Practical Venue</label>
                  <select
                    value={formData.practicalVenueId}
                    onChange={(e) => setFormData({ ...formData, practicalVenueId: e.target.value })}
                  >
                    <option value="">Select Practical Venue</option>
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} ({venue.faculty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Tutorial Venue</label>
                <select
                  value={formData.tutorialVenueId}
                  onChange={(e) => setFormData({ ...formData, tutorialVenueId: e.target.value })}
                >
                  <option value="">Select Tutorial Venue</option>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} ({venue.faculty})
                    </option>
                  ))}
                </select>
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
        </>
      )}

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

        .dashboard-content {
          display: flex;
          padding-top: 70px;
          flex: 1;
          min-height: calc(100vh - 70px);
        }

        .dashboard-main {
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

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }

        .search-input:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .add-btn {
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

        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .add-btn i {
          font-size: 16px;
        }

        .add-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .add-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
        }

        .table-container {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
        }

        .course-table {
          width: 100%;
          border-collapse: collapse;
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
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          backdrop-filter: blur(4px);
        }

        .form-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          z-index: 9999;
          overflow-y: auto;
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

        .form-popup form {
          padding: 20px;
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

        .form-popup input,
        .form-popup select {
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
        }

        .form-popup input::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }

        .form-popup input:focus,
        .form-popup select:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .form-popup select option {
          background: #1a1a1a;
          color: white;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
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

        /* Scrollbar styling */
        .form-popup::-webkit-scrollbar {
          width: 6px;
        }

        .form-popup::-webkit-scrollbar-track {
          background: transparent;
        }

        .form-popup::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: none;
        }

        .form-popup::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .dashboard-main::-webkit-scrollbar {
          width: 6px;
        }

        .dashboard-main::-webkit-scrollbar-track {
          background: transparent;
        }

        .dashboard-main::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: none;
        }

        .dashboard-main::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .dashboard-main {
            margin-left: 0;
            padding: 20px;
          }
          
          .dashboard-content {
            flex-direction: column;
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-main {
            margin-left: 0;
            padding: 20px 12px;
            max-width: 100vw;
          }
          
          .page-title {
            font-size: 24px;
            margin-bottom: 24px;
          }
          
          .controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-input {
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

          .form-popup {
            width: 95%;
            max-height: 95vh;
            margin: 0 auto;
          }

          .form-header,
          .form-popup form {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default CourseManagement;