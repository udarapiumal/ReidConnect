import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";
import AcademicSidebar from "./AcademicSidebar";
import Header from "./components/Header";
import UserProfile from './UserProfile';
import { PRIVILEGES } from '../../api/rolePrivileges';
import { getCurrentUserRole } from '../../utils/auth';

const API_URL = "/api/academic-calendar";

export default function AcademicCalendar() {
  const [periods, setPeriods] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editPeriod, setEditPeriod] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePeriodId, setDeletePeriodId] = useState(null);
  const [deletePeriodTitle, setDeletePeriodTitle] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const role = getCurrentUserRole();
  const userPrivs = PRIVILEGES[role] || [];
  const isSAR = userPrivs.includes("TIMETABLE_DELETE");

  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    academicYear: "2025/2026",
    intake: "",
    periodType: "SEMESTER",
  });

  // Fetch all periods
  const fetchPeriods = async () => {
    try {
      const res = await axios.get(API_URL);
      setPeriods(res.data);
    } catch (err) {
      console.error("Error fetching periods:", err);
    }
  };

  // Fetch current active period
  const fetchCurrentPeriod = async () => {
    try {
      const res = await axios.get(`${API_URL}/current`);
      setCurrentPeriod(res.data);
    } catch (err) {
      console.error("Error fetching current period:", err);
    }
  };

  useEffect(() => {
    fetchPeriods();
    fetchCurrentPeriod();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editPeriod) {
        await axios.put(`${API_URL}/${editPeriod.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setShowForm(false);
      setEditPeriod(null);
      setFormData({
        title: "",
        startDate: "",
        endDate: "",
        academicYear: "2025/2026",
        intake: "",
        periodType: "SEMESTER",
      });
      fetchPeriods();
      fetchCurrentPeriod();
    } catch (err) {
      console.error("Error saving period:", err);
    }
  };

  // Handle edit/delete
  const handleEdit = (period) => {
    setEditPeriod(period);
    setFormData(period);
    setShowForm(true);
  };

  const handleDelete = (period) => {
    setDeletePeriodId(period.id);
    setDeletePeriodTitle(period.title);
    setDeleteConfirmText("");
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletePeriodId) return;
    try {
      // First delete all timetable data (cascading)
      await axios.delete(`${API_URL}/${deletePeriodId}/timetable`);
      // Then delete the academic calendar period itself
      await axios.delete(`${API_URL}/${deletePeriodId}`);
      setShowDeleteConfirm(false);
      setDeleteConfirmText("");
      setDeletePeriodId(null);
      setDeletePeriodTitle("");
      fetchPeriods();
      fetchCurrentPeriod();
    } catch (err) {
      console.error("Error deleting period:", err);
      alert(err.response?.data?.message || "Failed to delete period.");
    }
  };
  // Calendar logic
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

  const monthList = (() => {
    if (periods.length === 0) return [];
    const start = new Date(Math.min(...periods.map(p => new Date(p.startDate).getTime())));
    const end = new Date(Math.max(...periods.map(p => new Date(p.endDate).getTime())));
    const months = [];
    const temp = new Date(start);
    temp.setDate(1);
    while (temp <= end) {
      months.push(new Date(temp));
      temp.setMonth(temp.getMonth() + 1);
    }
    return months;
  })();

  const getColor = (date) => {
    for (const p of periods) {
      const s = new Date(p.startDate);
      const e = new Date(p.endDate);
      if (date >= s && date <= e) {
        if (p.periodType === "EXAMINATION") return "#ef4444";
        if (p.periodType === "VACATION") return "#22c55e";
        if (p.periodType === "SEMESTER") return "#3b82f6";
        if (p.periodType === "STUDY_LEAVE") return "#f59e0b";
        if (p.periodType === "ORIENTATION") return "#8b5cf6";
      }
    }
    return "transparent";
  };

  const calendarDates = (() => {
    if (monthList.length === 0) return [];
    const monthDate = monthList[currentMonthIndex];
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  })();


  return (
    <div className="dashboard-container">
      <Header onProfileClick={() => setShowProfile(true)} />
      <div className="dashboard-content">
        <AcademicSidebar activeItem="Academic Calendar" isDarkMode={true} />

        <main className="dashboard-main">
          <h2 className="page-title">Academic Timetable - 2025/2026</h2>

          {currentPeriod && (
            <div className="current-period-banner">
              <p>
                <strong>Current Period:</strong> {currentPeriod.title} (
                {currentPeriod.periodType})
              </p>
            </div>
          )}

          <div className="actions-bar">
            <button
              className="add-btn"
              onClick={() => {
                setEditPeriod(null);
                setShowForm(true);
              }}
            >
              + Add Period
            </button>
          </div>

          <div className="periods-table-container">
            <table className="periods-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Type</th>
                  <th>Intake</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>{p.startDate}</td>
                    <td>{p.endDate}</td>
                    <td>{p.periodType}</td>
                    <td>{p.intake}</td>
                    <td>{p.academicYear}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      {isSAR && (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(p)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Full Calendar View with Navigation */}
          <div className="full-calendar-section">
            <h3>Academic Calendar Overview</h3>

            {/* Color Legend */}
            <div className="calendar-legend">
              <span><span className="legend-color" style={{ background: '#3b82f6' }}></span> Semester</span>
              <span><span className="legend-color" style={{ background: '#ef4444' }}></span> Examination</span>
              <span><span className="legend-color" style={{ background: '#22c55e' }}></span> Vacation</span>
              <span><span className="legend-color" style={{ background: '#f59e0b' }}></span> Study Leave</span>
              <span><span className="legend-color" style={{ background: '#8b5cf6' }}></span> Orientation</span>
            </div>

            {/* Month Navigation */}
            <div className="calendar-nav">
              <button onClick={() => setCurrentMonthIndex((i) => Math.max(0, i - 1))}>← Previous</button>
              <h4>{monthList[currentMonthIndex]?.toLocaleString("default", { month: "long", year: "numeric" })}</h4>
              <button onClick={() => setCurrentMonthIndex((i) => Math.min(monthList.length - 1, i + 1))}>Next →</button>
            </div>

            {/* Month Grid */}
            <div className="month-calendar">
              <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="calendar-header">{d}</div>
                ))}
                {calendarDates.map((date, idx) =>
                  date ? (
                    <div
                      key={idx}
                      className="calendar-cell"
                      style={{ backgroundColor: getColor(date) }}
                      title={date.toDateString()}
                    >
                      {date.getDate()}
                    </div>
                  ) : (
                    <div key={idx} className="calendar-cell empty"></div>
                  )
                )}
              </div>
            </div>
          </div>


          {/* Modal Form */}
          {showForm && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>{editPeriod ? "Edit Period" : "Add New Period"}</h3>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                  />
                  <select
                    name="periodType"
                    value={formData.periodType}
                    onChange={handleChange}
                  >
                    <option value="SEMESTER">Semester</option>
                    <option value="STUDY_LEAVE">Study Leave</option>
                    <option value="EXAMINATION">Examination</option>
                    <option value="VACATION">Vacation</option>
                    <option value="ORIENTATION">Orientation</option>
                    <option value="CONFERENCE">Conference</option>
                    <option value="OTHER">Other</option>
                  </select>
                  <input
                    type="text"
                    name="intake"
                    placeholder="Intake (e.g. 22/23)"
                    value={formData.intake}
                    onChange={handleChange}
                  />
                  <button type="submit" className="save-btn">
                    Save
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="modal-overlay" style={{ zIndex: 3000 }}>
              <div className="modal" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                <i className="fa fa-exclamation-triangle" style={{ fontSize: '48px', textAlign: 'center', marginBottom: '12px', color: '#f87171', display: 'block' }}></i>
                <h3 style={{ color: '#f87171', textAlign: 'center' }}>Delete Entire Timetable</h3>
                <p style={{
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'center',
                  padding: '16px',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.15)',
                  borderRadius: '10px',
                  marginBottom: '20px'
                }}>
                  This action is <strong style={{ color: '#f87171' }}>irreversible</strong>. It will permanently delete
                  the period <strong style={{ color: '#f87171' }}>"{deletePeriodTitle}"</strong> along with all
                  timetable entries, occupied venue/staff records, and approval history.
                </p>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                  Type <strong style={{ color: '#f87171', letterSpacing: '0.05em' }}>DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    className="cancel-btn"
                    style={{ flex: 1 }}
                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={deleteConfirmText !== "DELETE"}
                    onClick={handleConfirmDelete}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontWeight: 600,
                      cursor: deleteConfirmText === "DELETE" ? 'pointer' : 'not-allowed',
                      border: 'none',
                      background: deleteConfirmText === "DELETE"
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : 'rgba(107,114,128,0.3)',
                      color: deleteConfirmText === "DELETE" ? 'white' : 'rgba(255,255,255,0.3)',
                      transition: '0.3s'
                    }}
                  >
                    Delete Timetable
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* STYLES */}
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

        .title {
          font-weight: 700;
          font-size: 22px;
          letter-spacing: -0.02em;
          transition: color 0.3s ease;
          color: white;
        }

        .title .highlight {
          color: #FF453A;
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .header-left {
          display: flex;
          align-items: center;
        }
        .app-title {
          font-weight: 700;
          color: white;
          margin: 0;
        }
        .academic-text {
          color: #FF453A;
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .header-icons {
          display: flex;
          gap: 12px;
        }
        .header-icons .icon {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .header-icons .icon:hover {
          color: white;
        }
        .admin-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
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
          max-width: calc(100vw - 240px);
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
        .current-period-banner {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-weight: 500;
        }
        .actions-bar {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
        }
        .add-btn {
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }
        .add-btn:hover {
          background: linear-gradient(135deg, #2563eb, #3b82f6);
        }
        .periods-table-container {
          overflow-x: auto;
        }
        table.periods-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          overflow: hidden;
        }
        .periods-table th, .periods-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .periods-table th {
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.6px;
          opacity: 0.7;
        }
        .periods-table td {
          font-size: 14px;
        }
        .edit-btn, .delete-btn {
          background: transparent;
          border: none;
          color: #60a5fa;
          font-weight: 600;
          margin-right: 8px;
          cursor: pointer;
          transition: 0.3s;
        }
        .edit-btn:hover {
          color: #93c5fd;
        }
        .delete-btn {
          color: #f87171;
        }
        .delete-btn:hover {
          color: #ef4444;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        .modal {
          background: #1f1f1f;
          padding: 24px;
          border-radius: 12px;
          width: 400px;
          max-width: 90%;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .modal h3 {
          margin-bottom: 16px;
          font-size: 20px;
          font-weight: 700;
        }
        .modal form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .modal input, .modal select {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px 12px;
          border-radius: 6px;
          color: white;
          outline: none;
        }
        .modal button {
          padding: 10px 14px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }
        .save-btn {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border: none;
          color: white;
        }
        .save-btn:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
        }
        .cancel-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
        }
        .cancel-btn:hover {
          background: rgba(255,255,255,0.1);
        }
          /* Full Calendar View */
.full-calendar-section {
  margin-top: 40px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 24px;
}

.full-calendar-section h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #fff;
}

/* Legend */
.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #ddd;
}
.legend-color {
  width: 14px;
  height: 14px;
  display: inline-block;
  border-radius: 3px;
  margin-right: 6px;
}

/* Navigation */
.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.calendar-nav h4 {
  margin: 0;
  font-weight: 600;
  color: white;
}
.calendar-nav button {
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}
.calendar-nav button:hover {
  background: rgba(255,255,255,0.2);
}

/* Grid */
.month-calendar {
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 16px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.calendar-header {
  text-align: center;
  font-size: 13px;
  opacity: 0.7;
  font-weight: 500;
}

.calendar-cell {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  border-radius: 6px;
  background: rgba(255,255,255,0.05);
  color: white;
  transition: transform 0.2s ease;
}
.calendar-cell:hover {
  transform: scale(1.05);
  cursor: pointer;
}
.calendar-cell.empty {
  background: transparent;
}

      `}</style>

      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}
