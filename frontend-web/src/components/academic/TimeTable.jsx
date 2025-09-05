import React, { useState, useEffect } from "react";
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
import { getCurrentUserRole } from '../../utils/auth';
import { getCurrentUserId } from '../../utils/auth'; 
import StyledAlert from './components/StyledAlert'; 
import AcademicSidebar from './AcademicSidebar';

import './styles/TimeTable.css';
import './styles/PrintTimeTable.css'; // For shared styles

export default function TimeTable() {
  const [selectedYear, setSelectedYear] = useState("YEAR_1");
  const [selectedDegree, setSelectedDegree] = useState("CS");
  const [printData, setPrintData] = useState({});
  const [activeNavItem, setActiveNavItem] = useState("Time Table");
  const [isLoadingPrint, setIsLoadingPrint] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [courses, setCourses] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(false); 
  const role = getCurrentUserRole();
  const id = getCurrentUserId(); 
  const userPrivs = PRIVILEGES[role] || [];
  const canEditTimetable = userPrivs.includes("TIMETABLE_EDIT");
  const [clashAlert, setClashAlert] = useState(null);
  const [approvals, setApprovals] = useState([]); // all approvals for this timetable type
  const [approvalMessage, setApprovalMessage] = useState(""); // for input message

  const isMA = role === "ACADEMIC_MA";
  const isSAR = role === "ACADEMIC_SAR"; 
  const isHODorDeputy = role === "ACADEMIC_DEPUTY_DIRECTOR" || role === "ACADEMIC_HOD";

  // Get latest decisions by role - sort by timestamp/id to get most recent
  const getLatestDecisionByRole = (roleToFind) => {
    // Check both uppercase and lowercase versions since the display shows lowercase
    const approvalsByRole = approvals.filter(a => 
      a.reviewerRole === roleToFind || 
      a.reviewerRole === roleToFind.toLowerCase()
    );
    return approvalsByRole.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))[0];
  };

  const latestSAR = getLatestDecisionByRole("ACADEMIC_SAR");
  const latestHOD = getLatestDecisionByRole("ACADEMIC_DEPUTY_DIRECTOR") || 
                   getLatestDecisionByRole("ACADEMIC_HOD");
  const latestMA = getLatestDecisionByRole("ACADEMIC_MA");

  // Helper function to check if approval A came after approval B chronologically
  const isAfter = (approvalA, approvalB) => {
    if (!approvalA || !approvalB) return false;
    const timeA = new Date(approvalA.createdAt || approvalA.id);
    const timeB = new Date(approvalB.createdAt || approvalB.id);
    return timeA > timeB;
  };

  // Check if MA sent a new PENDING request after previous rejections
  const isPendingAfterSARRejection = latestMA && latestMA.decision === "PENDING" && 
    latestSAR && latestSAR.decision === "NOT_RECOMMENDED" && 
    isAfter(latestMA, latestSAR);

  const isPendingAfterHODRejection = latestMA && latestMA.decision === "PENDING" && 
    latestHOD && latestHOD.decision === "REJECTED" && 
    isAfter(latestMA, latestHOD);

  // Check if SAR recommended after MA's latest PENDING request
  const isSARRecommendedAfterPending = latestSAR && latestSAR.decision === "RECOMMENDED" &&
    latestMA && latestMA.decision === "PENDING" &&
    isAfter(latestSAR, latestMA);

  // MA: Can send for recommendation only if:
  // - No SAR action exists, OR
  // - SAR decision is NOT_RECOMMENDED, OR 
  // - HOD decision is REJECTED
  // BUT NOT if there's a current PENDING request or if SAR has RECOMMENDED (waiting for HOD)
  const hasPendingRequest = latestMA && latestMA.decision === "PENDING" && (
    !latestSAR || // No SAR response yet
    isPendingAfterSARRejection || // New pending after SAR rejection
    isPendingAfterHODRejection // New pending after HOD rejection
  );
  
  const sarHasRecommended = isSARRecommendedAfterPending && 
    (!latestHOD || isAfter(latestSAR, latestHOD)); // SAR recommended and HOD hasn't acted yet

  const canSendForRecommendation = isMA && !hasPendingRequest && !sarHasRecommended && (
    !latestSAR || 
    latestSAR.decision === "NOT_RECOMMENDED" || 
    (latestHOD && latestHOD.decision === "REJECTED")
  );

  // SAR: Can recommend/not recommend if:
  // - There's a PENDING request from MA AND SAR hasn't acted on this specific request, OR
  // - MA sent a new PENDING request after SAR's previous NOT_RECOMMENDED decision
  const hasPendingFromMA = latestMA && latestMA.decision === "PENDING";
  // SAR: Can recommend/not recommend only once per MA's PENDING request
const canRecommend = isSAR && hasPendingFromMA && (
  (!latestSAR || isAfter(latestMA, latestSAR)) // SAR never acted on THIS pending
);


  // HOD: Can approve/reject if:
  // - SAR recommended and there's no HOD decision yet, OR
  // - SAR recommended after the latest HOD decision
  const canApprove = isHODorDeputy && latestSAR && latestSAR.decision === "RECOMMENDED" && (
    !latestHOD || // No HOD decision yet
    isAfter(latestSAR, latestHOD) // SAR recommended after last HOD decision
  );

  // Visibility logic:
  // MA: Can always see (to edit and send for recommendation)
  // SAR: Can see if there's a PENDING request from MA that they can act on
  // HOD: Can see if they can approve, or if they previously acted
  const isVisible = 
    latestHOD?.decision === "APPROVED" ||
    isMA || // MA can always see
    (isSAR && canRecommend) || // SAR sees when they can act on pending request
    (isHODorDeputy && (
      canApprove || // HOD can see when they can approve
      (latestHOD && (latestHOD.decision === "APPROVED" || latestHOD.decision === "REJECTED")) // HOD can see their past decisions
    ));

  const {
    timetableData,
    coursesData,
    loading,
    fetchTimetableData,
  } = useTimeTableData(selectedYear, selectedDegree, refreshToggle);

  useEffect(() => {
    fetchTimetableData();
    fetchCourses();
  }, [selectedYear, selectedDegree, refreshToggle]);

  // Fetch courses for dropdowns in edit mode
  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };
  
  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
  };

  const triggerRefresh = () => {
    setRefreshToggle(prev => !prev);
  };

  const handleEntryDelete = async (entryId) => {
    try {
      await axiosInstance.delete(`/api/timetable/${entryId}`);
      triggerRefresh();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const handleEntryCreate = async (createData) => {
    try {
      await axiosInstance.post('/api/timetable', createData);
      triggerRefresh();
    } catch (error) {
      console.error('Error creating entry:', error);
      if (error.response && error.response.data && error.response.data.message) {
        const msg = error.response.data.message;
        if (msg.includes('Venue clash detected') || msg.includes('Staff clash detected')) {
          setClashAlert(msg);
        } else {
          alert(msg);
        }
      } else {
        alert('Failed to create entry. Please try again.');
      }
    }
  };

  const fetchApprovalStatus = async () => {
    try {
      const response = await axiosInstance.get(`/api/timetable-approvals/ACADEMIC_TIME_TABLE`);
      setApprovals(response.data);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    }
  };

  useEffect(() => {
    fetchApprovalStatus();
  }, [selectedYear, selectedDegree, refreshToggle]);

  const handleApprovalAction = async (decisionType) => {
    try {
      const reviewerId = id;
      console.log(`Sending approval action: ${decisionType} by ${reviewerId}`);

      await axiosInstance.post("/api/timetable-approvals", {
        type: `ACADEMIC_TIME_TABLE`,
        reviewerId: reviewerId,
        decision: decisionType,
        message: approvalMessage
      });

      setApprovalMessage("");
      fetchApprovalStatus();
      triggerRefresh();
    } catch (error) {
      console.error("Error sending approval:", error);
      alert('Error processing approval action. Please try again.');
    }
  };

  const handleEntryUpdate = async (entryId, updateData) => {
    try {
      await axiosInstance.put(`/api/timetable/${entryId}`, updateData);
      triggerRefresh();
    } catch (error) {
      console.error('Error updating entry:', error);
      if (error.response && error.response.data && error.response.data.message) {
        const msg = error.response.data.message;
        if (msg.includes('Venue clash detected') || msg.includes('Staff clash detected')) {
          setClashAlert(msg);
        } else {
          alert(msg);
        }
      } else {
        alert('Failed to update entry. Please try again.');
      }
    }
  };

  const handlePrint = async () => {
    try {
      console.log('Starting print process...');
      const printDataResult = await fetchAllTimetableData();
      console.log('Print data fetched:', printDataResult);
      
      setTimeout(() => {
        console.log('Opening print dialog...');
        window.print();
      }, 1500);
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
            console.log(`Fetching data for ${year} ${degree}`);
            const response = await axiosInstance.get(
              `/api/timetable/byYearAndDegree?degree=${degree}&year=${year}`
            );
            
            const timetableEntries = response.data || [];
            console.log(`Received ${timetableEntries.length} entries for ${year} ${degree}`);
            
            const processedData = timetableEntries.map(entry => {
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
                practicalCredits: entry.practicalCredits
              };
            }).filter(Boolean);

            allData[year][degree] = processedData;

            const uniqueCourses = timetableEntries.reduce((courses, entry) => {
              if (!courses.some(course => course.courseCode === entry.courseCode)) {
                courses.push({
                  id: entry.id,
                  code: entry.courseCode,
                  name: entry.courseName,
                  lectureCredits: entry.lectureCredits,
                  practicalCredits: entry.practicalCredits,
                  degree: entry.degree,
                  lecturerNames: entry.lecturerNames ? entry.lecturerNames.split(', ') : [],
                  lecturerCodes: entry.lecturerCodes ? entry.lecturerCodes.split(', ') : []
                });
              }
              return courses;
            }, []);
            
            allData[year].courses[degree] = uniqueCourses;
            
          } catch (degreeError) {
            console.error(`Error fetching ${year} ${degree}:`, degreeError);
            allData[year][degree] = [];
            allData[year].courses[degree] = [];
          }
        }
      }
      
      console.log('Final print data:', allData);
      setPrintData(allData);
      return allData;
      
    } catch (error) {
      console.error('Error fetching print data:', error);
      return {};
    } finally {
      setIsLoadingPrint(false);
    }
  };

  // Helper function to get current workflow status for display
  const getCurrentStatus = () => {
    if (!latestMA) return "Draft";
    
    if (latestMA.decision === "PENDING") {
      // Check if anyone has acted on this pending request
      if (!latestSAR || isPendingAfterSARRejection || isPendingAfterHODRejection) {
        return "Pending SAR Review";
      }
      if (isSARRecommendedAfterPending && (!latestHOD || isAfter(latestSAR, latestHOD))) {
        return "Pending HOD Approval";
      }
    }
    
    if (latestSAR?.decision === "NOT_RECOMMENDED" && !isPendingAfterSARRejection) {
      return "Not Recommended by SAR";
    }
    if (latestHOD?.decision === "APPROVED") return "Approved";
    if (latestHOD?.decision === "REJECTED" && !isPendingAfterHODRejection) {
      return "Rejected by HOD";
    }
    
    return "In Progress";
  };

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
                onYearChange={setSelectedYear}
                onDegreeChange={setSelectedDegree}
                onPrint={handlePrint}
                isLoadingPrint={isLoadingPrint}
              />

              {canEditTimetable && isMA && (
                <button
                  className={`edit-button ${isEditMode ? "edit-active" : ""}`}
                  onClick={handleEditToggle}
                >
                  {isEditMode ? "Exit Edit" : "Edit"}
                </button>
              )}
            </div>
          </div>

          {/* Current Status Display */}
          <div className="status-banner">
            <strong>Status: </strong>{getCurrentStatus()}
          </div>

          {/* Timetable Grid - conditional visibility */}
          {isVisible ? (
            isEditMode ? (
              <EditableTimeTableGrid
                timetableData={timetableData}
                courses={courses}
                loading={loading}
                selectedYear={selectedYear}
                selectedDegree={selectedDegree}
                onEntryDelete={handleEntryDelete}
                onEntryUpdate={handleEntryUpdate}
                onEntryCreate={handleEntryCreate}
              />
            ) : (
              <TimeTableGrid timetableData={timetableData} loading={loading} />
            )
          ) : (
            <div className="no-access-message">
              <p>Timetable is not accessible at this time. Please wait for the appropriate approval workflow stage.</p>
            </div>
          )}

          {/* Courses List - only show if timetable is visible */}
          {isVisible && (
            <CoursesList coursesData={coursesData} loading={loading} />
          )}

          {/* Approval Section */}
          <div className="approval-section">
            <h3>Approval History</h3>
            
              {/* Display approval history with timestamps */}
              <div className="approval-history">
                {approvals.length === 0 ? (
                  <p>No approval actions yet.</p>
                ) : (
                  <ul>
                    {approvals
                      .sort((a, b) => new Date(a.createdAt || a.id) - new Date(b.createdAt || b.id)) // Sort chronologically (oldest first)
                      .map((approval) => (
                      <li key={approval.id}>
                        <strong>{approval.reviewerRole}</strong> : {approval.decision}
                        {approval.message && ` - "${approval.message}"`}
                        {approval.createdAt && ` (${new Date(approval.createdAt).toLocaleString()})`}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            {/* Action buttons based on role and current status */}
            <div className="approval-actions">
              {/* MA: Send for Recommendation */}
              {canSendForRecommendation && (
                <div className="action-group">
                  <h4>Send for SAR Recommendation:</h4>
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

              {/* SAR: Recommend or Not Recommend */}
              {canRecommend && (
                <div className="action-group">
                  <h4>SAR Decision:</h4>
                  <textarea
                    value={approvalMessage}
                    onChange={(e) => setApprovalMessage(e.target.value)}
                    placeholder="Message for HOD (optional)"
                    rows={3}
                  />
                  <div className="button-group">
                    <button 
                      onClick={() => handleApprovalAction("RECOMMENDED")}
                      className="action-button success"
                    >
                      Recommend to HOD
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

              {/* HOD/Deputy: Approve or Reject */}
              {canApprove && (
                <div className="action-group">
                  <h4>HOD Final Decision:</h4>
                  <textarea
                    value={approvalMessage}
                    onChange={(e) => setApprovalMessage(e.target.value)}
                    placeholder="Final approval message (optional)"
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

              {/* No actions available message */}
              {!canSendForRecommendation && !canRecommend && !canApprove && (
                <div className="no-actions">
                  <p>No approval actions available at this time.</p>
                </div>
              )}
            </div>
          </div>
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