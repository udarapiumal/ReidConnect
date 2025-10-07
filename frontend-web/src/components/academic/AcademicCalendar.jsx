import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";
import AcademicSidebar from "./AcademicSidebar";
import Header from "./components/Header";

const API_URL = "http://localhost:8080/api/academic-calendar";

export default function AcademicCalendar() {
  const [periods, setPeriods] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editPeriod, setEditPeriod] = useState(null);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this period?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchPeriods();
    }
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <AcademicSidebar activeItem="Timetable" isDarkMode={true} />

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
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        </main>
      </div>

      {/* STYLES */}
      <style>{`
        .dashboard-container {
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: white;
        }
        .dashboard-content {
          display: flex;
          padding-top: 70px;
          flex: 1;
        }
        main.dashboard-main {
          flex: 1;
          padding: 40px;
          margin-left: 200px;
          overflow-y: auto;
        }
        .page-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 24px;
          background: linear-gradient(135deg, #ffffff, #e5e5e5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
      `}</style>
    </div>
  );
}
