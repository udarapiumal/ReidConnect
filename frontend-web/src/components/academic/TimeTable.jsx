import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from '../../api/axiosInstance';
import Header from './components/Header';
import TimeTableFilters from './components/TimeTableFilters';
import TimeTableGrid from './components/TimeTableGrid';
import EditableTimeTableGrid from './components/EditableTimeTableGrid';
import CoursesList from './components/CoursesList';
import PrintLayout from './components/PrintLayout';
import { useTimeTableData } from './hooks/useTimeTableData';
import { timeSlotConfig } from './utils/timeSlotConfig';
import { PRIVILEGES } from '../../api/rolePrivileges';
import { getCurrentUserRole, getCurrentUserId } from '../../utils/auth';
import StyledAlert from './components/StyledAlert';
import AcademicSidebar from './AcademicSidebar';

import './styles/TimeTable.css';
import './styles/PrintTimeTable.css';

// ── Status Display Config ──────────────────────────────────────────
const STATUS_CONFIG = {
  DRAFT: { label: "Draft", color: "#6b7280", icon: "📝" },
  PENDING_RECOMMENDATION: { label: "Pending SAR Review", color: "#f59e0b", icon: "⏳" },
  RECOMMENDED: { label: "Recommended – Awaiting DD", color: "#3b82f6", icon: "👍" },
  NOT_RECOMMENDED: { label: "Not Recommended by SAR", color: "#ef4444", icon: "↩️" },
  APPROVED: { label: "Approved", color: "#10b981", icon: "✅" },
  REJECTED: { label: "Rejected by Deputy Director", color: "#ef4444", icon: "↩️" },
};

// ── Visibility Rules ───────────────────────────────────────────────
// Which roles can VIEW the timetable in each status?
const VISIBILITY_MAP = {
  DRAFT: ["ACADEMIC_MA"],
  PENDING_RECOMMENDATION: ["ACADEMIC_MA", "ACADEMIC_SAR"],
  RECOMMENDED: ["ACADEMIC_MA", "ACADEMIC_SAR", "ACADEMIC_DEPUTY_DIRECTOR"],
  NOT_RECOMMENDED: ["ACADEMIC_MA", "ACADEMIC_SAR"],
  APPROVED: null, // everyone
  REJECTED: ["ACADEMIC_MA", "ACADEMIC_DEPUTY_DIRECTOR"],
};

// ── Editable Statuses (only MA can ever edit) ──────────────────────
const EDITABLE_STATUSES = new Set(["DRAFT", "NOT_RECOMMENDED", "REJECTED"]);

export default function TimeTable() {
  // ── State ──────────────────────────────────────────────────────
  const [selectedYear, setSelectedYear] = useState("YEAR_1");
  const [selectedDegree, setSelectedDegree] = useState("CS");
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [timetableStatus, setTimetableStatus] = useState(null); // FSM status string
  const [printData, setPrintData] = useState({});
  const [activeNavItem, setActiveNavItem] = useState("Time Table");
  const [isLoadingPrint, setIsLoadingPrint] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [courses, setCourses] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [clashAlert, setClashAlert] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [approvalMessage, setApprovalMessage] = useState("");

  const role = getCurrentUserRole();
  const userId = getCurrentUserId();
  const userPrivs = PRIVILEGES[role] || [];
  const canEditTimetable = userPrivs.includes("TIMETABLE_EDIT");

  const isMA = role === "ACADEMIC_MA";
  const isSAR = role === "ACADEMIC_SAR";
  const isDD = role === "ACADEMIC_DEPUTY_DIRECTOR" || role === "ACADEMIC_HOD";

  // ── Derived permissions from FSM status ────────────────────────
  const canView = (() => {
    if (!timetableStatus || !selectedCalendarId) return false;
    const allowed = VISIBILITY_MAP[timetableStatus];
    if (allowed === null) return true; // APPROVED — everyone
    return allowed.includes(role);
  })();

  const canEdit = isMA && canEditTimetable && EDITABLE_STATUSES.has(timetableStatus);

  // What action buttons should show?
  const canSendForRecommendation = isMA && EDITABLE_STATUSES.has(timetableStatus);
  const canRecommend = isSAR && timetableStatus === "PENDING_RECOMMENDATION";
  const canApprove = isDD && timetableStatus === "RECOMMENDED";

  // ── Data hooks ─────────────────────────────────────────────────
  const {
    timetableData,
    coursesData,
    loading,
    fetchTimetableData,
  } = useTimeTableData(selectedYear, selectedDegree, refreshToggle, selectedCalendarId);

  // ── Fetch current academic period on mount ─────────────────────
  useEffect(() => {
    const fetchCurrentPeriod = async () => {
      try {
        const response = await axiosInstance.get('/api/academic-calendar/current');
        if (response.data && response.data.periodType === 'SEMESTER') {
          setSelectedCalendarId(response.data.id);
        }
      } catch (error) {
        console.error("Error fetching current period:", error);
      }
    };
    fetchCurrentPeriod();
  }, []);

  // ── Fetch FSM status ───────────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    if (!selectedCalendarId) {
      setTimetableStatus(null);
      return;
    }
    try {
      const res = await axiosInstance.get(`/api/timetable-approvals/status/${selectedCalendarId}`);
      setTimetableStatus(res.data.status);
    } catch (error) {
      console.error("Error fetching timetable status:", error);
      setTimetableStatus(null);
    }
  }, [selectedCalendarId]);

  // ── Fetch approval history (audit log) ─────────────────────────
  const fetchApprovalHistory = useCallback(async () => {
    if (!selectedCalendarId) {
      setApprovals([]);
      return;
    }
    try {
      const res = await axiosInstance.get(`/api/timetable-approvals/${selectedCalendarId}`);
      setApprovals(res.data);
    } catch (error) {
      console.error("Error fetching approval history:", error);
      setApprovals([]);
    }
  }, [selectedCalendarId]);

  // ── Fetch courses ──────────────────────────────────────────────
  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  // ── Re-fetch when calendar or refresh changes ──────────────────
  useEffect(() => {
    if (selectedCalendarId) {
      fetchStatus();
      fetchApprovalHistory();
      fetchCourses();
    }
  }, [selectedCalendarId, refreshToggle, fetchStatus, fetchApprovalHistory]);

  // Exit edit mode when status changes to non-editable
  useEffect(() => {
    if (isEditMode && !EDITABLE_STATUSES.has(timetableStatus)) {
      setIsEditMode(false);
    }
  }, [timetableStatus, isEditMode]);

  // ── Handlers ───────────────────────────────────────────────────
  const triggerRefresh = () => setRefreshToggle(prev => !prev);

  const handleEditToggle = () => {
    if (!selectedCalendarId) {
      alert("Please select an academic calendar first.");
      return;
    }
    if (!canEdit) {
      alert("Editing is not allowed in the current workflow state.");
      return;
    }
    setIsEditMode(!isEditMode);
  };

  const handleNavigation = (itemId) => setActiveNavItem(itemId);

  const handleEntryDelete = async (entryId) => {
    try {
      await axiosInstance.delete(`/api/timetable/${entryId}`);
      triggerRefresh();
    } catch (error) {
      console.error('Error deleting entry:', error);
      const msg = error.response?.data?.message || 'Failed to delete entry.';
      alert(msg);
    }
  };

  const handleEntryCreate = async (createData) => {
    if (!selectedCalendarId) return;
    try {
      await axiosInstance.post('/api/timetable', { ...createData, academicCalendarId: selectedCalendarId });
      triggerRefresh();
    } catch (error) {
      console.error('Error creating entry:', error);
      const msg = error.response?.data?.message;
      if (msg && (msg.includes('Venue clash') || msg.includes('Staff clash'))) {
        setClashAlert(msg);
      } else {
        alert(msg || 'Failed to create entry. Please try again.');
      }
    }
  };

  const handleEntryUpdate = async (entryId, updateData) => {
    if (!selectedCalendarId) return;
    try {
      await axiosInstance.put(`/api/timetable/${entryId}`, { ...updateData, academicCalendarId: selectedCalendarId });
      triggerRefresh();
    } catch (error) {
      console.error('Error updating entry:', error);
      const msg = error.response?.data?.message;
      if (msg && (msg.includes('Venue clash') || msg.includes('Staff clash'))) {
        setClashAlert(msg);
      } else {
        alert(msg || 'Failed to update entry. Please try again.');
      }
    }
  };

  const handleApprovalAction = async (decisionType) => {
    if (!selectedCalendarId) return;
    try {
      await axiosInstance.post("/api/timetable-approvals", {
        academicCalendarId: selectedCalendarId,
        reviewerId: userId,
        decision: decisionType,
        message: approvalMessage
      });
      setApprovalMessage("");
      triggerRefresh(); // triggers re-fetch of status + history + data
    } catch (error) {
      console.error("Error sending approval:", error);
      const msg = error.response?.data?.message || 'Error processing approval action.';
      alert(msg);
    }
  };

  const handlePrint = async () => {
    if (!selectedCalendarId) {
      alert("Select a calendar first");
      return;
    }
    try {
      await fetchAllTimetableData();
      setTimeout(() => window.print(), 1500);
    } catch (error) {
      console.error('Error preparing print data:', error);
      alert('Error preparing print data. Please try again.');
    }
  };

  const fetchAllTimetableData = async () => {
    setIsLoadingPrint(true);
    const years = ["YEAR_1", "YEAR_2", "YEAR_3", "YEAR_4"];
    const degrees = ["CS", "IS"];
    const allData = {};

    try {
      for (const year of years) {
        allData[year] = { CS: [], IS: [], courses: { CS: [], IS: [] } };
        for (const degree of degrees) {
          try {
            const response = await axiosInstance.get(
              `/api/timetable/byYearAndDegree?degree=${degree}&year=${year}&academicCalendarId=${selectedCalendarId}`
            );
            const entries = response.data || [];
            allData[year][degree] = entries.map(entry => {
              const timeSlots = timeSlotConfig.convertSlotsToTime(entry.slotIds);
              if (!timeSlots) return null;
              return {
                id: entry.id,
                day: entry.day.toUpperCase(),
                courseCode: entry.courseCode,
                courseName: entry.courseName,
                courseType: entry.courseType,
                group: entry.group,
                startTime: timeSlots.startTime,
                endTime: timeSlots.endTime,
                venue: entry.venue || 'TBA',
                lecturerCodes: entry.lecturerCodes || '',
                lecturerNames: entry.lecturerNames || '',
                degree: entry.degree,
                lectureCredits: entry.lectureCredits,
                practicalCredits: entry.practicalCredits,
              };
            }).filter(Boolean);

            allData[year].courses[degree] = entries.reduce((acc, entry) => {
              if (!acc.some(c => c.courseCode === entry.courseCode)) {
                acc.push({
                  id: entry.id,
                  code: entry.courseCode,
                  name: entry.courseName,
                  lectureCredits: entry.lectureCredits,
                  practicalCredits: entry.practicalCredits,
                  degree: entry.degree,
                  lecturerNames: entry.lecturerNames ? entry.lecturerNames.split(', ') : [],
                  lecturerCodes: entry.lecturerCodes ? entry.lecturerCodes.split(', ') : [],
                });
              }
              return acc;
            }, []);
          } catch (degreeError) {
            console.error(`Error fetching ${year} ${degree}:`, degreeError);
            allData[year][degree] = [];
            allData[year].courses[degree] = [];
          }
        }
      }
      setPrintData(allData);
      return allData;
    } finally {
      setIsLoadingPrint(false);
    }
  };

  // ── Status badge helper ────────────────────────────────────────
  const statusCfg = STATUS_CONFIG[timetableStatus] || { label: "Unknown", color: "#6b7280", icon: "❓" };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="timetable-container">
      <Header />

      <div className="dashboard-content">
        <AcademicSidebar
          activeItem={activeNavItem}
          onNavigate={handleNavigation}
          isDarkMode={true}
        />

        <main className="dashboard-main">
          <div className="page-header">
            <h2 className="page-title">Academic Timetable</h2>
            <div className="header-controls">
              <TimeTableFilters
                selectedYear={selectedYear}
                selectedDegree={selectedDegree}
                selectedCalendarId={selectedCalendarId}
                onYearChange={setSelectedYear}
                onDegreeChange={setSelectedDegree}
                onCalendarChange={setSelectedCalendarId}
                onPrint={handlePrint}
                isLoadingPrint={isLoadingPrint}
              />

              {canEdit && selectedCalendarId && (
                <button
                  className={`edit-button ${isEditMode ? "edit-active" : ""}`}
                  onClick={handleEditToggle}
                >
                  {isEditMode ? "Exit Edit" : "Edit Timetable"}
                </button>
              )}
            </div>
          </div>

          {/* ── Status Banner ──────────────────────────────── */}
          {selectedCalendarId && timetableStatus && (
            <div
              className="status-banner"
              style={{
                backgroundColor: statusCfg.color + "18",
                borderLeft: `4px solid ${statusCfg.color}`,
                padding: "12px 16px",
                borderRadius: "6px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "1.2em" }}>{statusCfg.icon}</span>
              <strong style={{ color: statusCfg.color }}>
                {statusCfg.label}
              </strong>
            </div>
          )}

          {/* ── Timetable Grid ─────────────────────────────── */}
          {selectedCalendarId ? (
            canView ? (
              isEditMode && canEdit ? (
                <EditableTimeTableGrid
                  timetableData={timetableData}
                  courses={courses}
                  loading={loading}
                  selectedYear={selectedYear}
                  selectedDegree={selectedDegree}
                  academicCalendarId={selectedCalendarId}
                  onEntryDelete={handleEntryDelete}
                  onEntryUpdate={handleEntryUpdate}
                  onEntryCreate={handleEntryCreate}
                />
              ) : (
                <TimeTableGrid timetableData={timetableData} loading={loading} />
              )
            ) : (
              <div className="no-access-message">
                <p>This timetable is not accessible to your role in its current workflow state.</p>
              </div>
            )
          ) : (
            <div className="no-access-message">
              <p>Please select an Academic Calendar to view the timetable.</p>
            </div>
          )}

          {/* ── Courses List ───────────────────────────────── */}
          {canView && selectedCalendarId && (
            <CoursesList coursesData={coursesData} loading={loading} />
          )}

          {/* ── Approval Workflow Section ──────────────────── */}
          {selectedCalendarId && canView && (
            <div className="approval-section">
              <h3>Approval Workflow</h3>

              {/* Action Buttons */}
              <div className="approval-actions">

                {/* MA: Send for Recommendation */}
                {canSendForRecommendation && (
                  <div className="action-group">
                    <h4>
                      {timetableStatus === "NOT_RECOMMENDED"
                        ? "Re-send for SAR Recommendation:"
                        : timetableStatus === "REJECTED"
                          ? "Re-send for Recommendation (after rejection):"
                          : "Send for SAR Recommendation:"}
                    </h4>
                    <textarea
                      value={approvalMessage}
                      onChange={(e) => setApprovalMessage(e.target.value)}
                      placeholder="Message for SAR (optional)"
                      rows={3}
                    />
                    <button
                      onClick={() => handleApprovalAction("PENDING")}
                      className="action-button primary"
                    >
                      Send for Recommendation
                    </button>
                  </div>
                )}

                {/* SAR: Recommend / Not Recommend */}
                {canRecommend && (
                  <div className="action-group">
                    <h4>SAR Decision:</h4>
                    <textarea
                      value={approvalMessage}
                      onChange={(e) => setApprovalMessage(e.target.value)}
                      placeholder="Message (optional)"
                      rows={3}
                    />
                    <div className="button-group">
                      <button
                        onClick={() => handleApprovalAction("RECOMMENDED")}
                        className="action-button success"
                      >
                        Recommend to Deputy Director
                      </button>
                      <button
                        onClick={() => handleApprovalAction("NOT_RECOMMENDED")}
                        className="action-button danger"
                      >
                        Not Recommend
                      </button>
                    </div>
                  </div>
                )}

                {/* Deputy Director: Approve / Reject */}
                {canApprove && (
                  <div className="action-group">
                    <h4>Deputy Director Decision:</h4>
                    <textarea
                      value={approvalMessage}
                      onChange={(e) => setApprovalMessage(e.target.value)}
                      placeholder="Final decision message (optional)"
                      rows={3}
                    />
                    <div className="button-group">
                      <button
                        onClick={() => handleApprovalAction("APPROVED")}
                        className="action-button success"
                      >
                        Approve Timetable
                      </button>
                      <button
                        onClick={() => handleApprovalAction("REJECTED")}
                        className="action-button danger"
                      >
                        Reject Timetable
                      </button>
                    </div>
                  </div>
                )}

                {/* No actions message */}
                {!canSendForRecommendation && !canRecommend && !canApprove && (
                  <div className="no-actions">
                    <p>
                      {timetableStatus === "PENDING_RECOMMENDATION" && isMA
                        ? "Waiting for SAR review…"
                        : timetableStatus === "RECOMMENDED" && isSAR
                          ? "Waiting for Deputy Director decision…"
                          : timetableStatus === "APPROVED"
                            ? "This timetable has been finalized."
                            : "No approval actions available for your role at this time."}
                    </p>
                  </div>
                )}
              </div>

              {/* Approval History (audit log) */}
              <div className="approval-history" style={{ marginTop: "20px" }}>
                <h4>History</h4>
                {approvals.length === 0 ? (
                  <p>No approval actions yet.</p>
                ) : (
                  <ul>
                    {approvals
                      .sort((a, b) => new Date(a.reviewedAt || a.id) - new Date(b.reviewedAt || b.id))
                      .map((approval) => (
                        <li key={approval.id}>
                          <strong>{approval.reviewerRole}</strong>: {approval.decision}
                          {approval.message && ` – "${approval.message}"`}
                          {approval.reviewedAt && (
                            <span style={{ color: "#888", marginLeft: "8px" }}>
                              ({new Date(approval.reviewedAt).toLocaleString()})
                            </span>
                          )}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Print Layout */}
      <PrintLayout printData={printData} />

      {/* Clash Alert */}
      {clashAlert && (
        <StyledAlert message={clashAlert} onClose={() => setClashAlert(null)} />
      )}
    </div>
  );
}