import React, { useState, useEffect } from "react";
import axiosInstance from '../../api/axiosInstance'; 

export default function TimeTable() {
  const [selectedYear, setSelectedYear] = useState("YEAR_1");
  const [selectedDegree, setSelectedDegree] = useState("CS");
  const [timetableData, setTimetableData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define slot mapping - each slot is 30 minutes
  const slotToTime = {
    1: { start: "08:00", end: "08:30" },
    2: { start: "08:30", end: "09:00" },
    3: { start: "09:00", end: "09:30" },
    4: { start: "09:30", end: "10:00" },
    5: { start: "10:00", end: "10:30" },
    6: { start: "10:30", end: "11:00" },
    7: { start: "11:00", end: "11:30" },
    8: { start: "11:30", end: "12:00" },
    9: { start: "12:00", end: "12:30" },
    10: { start: "12:30", end: "13:00" },
    11: { start: "13:00", end: "13:30" },
    12: { start: "13:30", end: "14:00" },
    13: { start: "14:00", end: "14:30" },
    14: { start: "14:30", end: "15:00" },
    15: { start: "15:00", end: "15:30" },
    16: { start: "15:30", end: "16:00" },
    17: { start: "16:00", end: "16:30" },
    18: { start: "16:30", end: "17:00" },
    19: { start: "17:00", end: "17:30" },
    20: { start: "17:30", end: "18:00" },
    21: { start: "18:00", end: "18:30" },
    22: { start: "18:30", end: "19:00" }
  };

  // Convert slot IDs to time range
  const convertSlotsToTime = (slotIds) => {
    if (!slotIds || slotIds.length === 0) return null;
    
    const sortedSlots = [...slotIds].sort((a, b) => a - b);
    const startTime = slotToTime[sortedSlots[0]]?.start;
    const endTime = slotToTime[sortedSlots[sortedSlots.length - 1]]?.end;
    
    return { startTime, endTime };
  };

  // API call functions
  const fetchTimetableData = async () => {
    try {
      setLoading(true);
      
      // Fetch timetable data with all details included
      const timetableResponse = await axiosInstance.get(
        `/api/timetable/byYearAndDegree?degree=${selectedDegree}&year=${selectedYear}`
      );
      
      const timetableEntries = timetableResponse.data;
      
      // Process timetable data - now all data comes from the single API call
      const processedData = timetableEntries.map(entry => {
        const timeSlots = convertSlotsToTime(entry.slotIds);
        
        if (!timeSlots) {
          console.warn(`Missing slot data for entry:`, entry);
          return null;
        }

        return {
          id: entry.id,
          day: entry.day.toUpperCase(), // Ensure consistent uppercase
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
          credits: entry.credits
        };
      }).filter(Boolean); // Remove null entries
      
      console.log('Processed timetable data:', processedData); // Debug log
      setTimetableData(processedData);
      
      // Create courses data from timetable entries for the course list section
      const uniqueCourses = timetableEntries.reduce((courses, entry) => {
        if (!courses.some(course => course.courseCode === entry.courseCode)) {
          courses.push({
            id: entry.id,
            code: entry.courseCode,
            name: entry.courseName,
            credits: entry.credits,
            degree: entry.degree,
            lecturerNames: entry.lecturerNames ? entry.lecturerNames.split(', ') : []
          });
        }
        return courses;
      }, []);
      
      setCoursesData(uniqueCourses);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      setTimetableData([]);
      setCoursesData([]);
    } finally {
      setLoading(false);
    }
  };

  // Define time slots for display (1-hour blocks)
  const timeSlots = [
    { start: "08:00", end: "09:00", index: 0 },
    { start: "09:00", end: "10:00", index: 1 },
    { start: "10:00", end: "11:00", index: 2 },
    { start: "11:00", end: "12:00", index: 3 },
    { start: "12:00", end: "13:00", index: 4 },
    { start: "13:00", end: "14:00", index: 5 },
    { start: "14:00", end: "15:00", index: 6 },
    { start: "15:00", end: "16:00", index: 7 },
    { start: "16:00", end: "17:00", index: 8 },
    { start: "17:00", end: "18:00", index: 9 },
    { start: "18:00", end: "19:00", index: 10 }
  ];

  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

  useEffect(() => {
    fetchTimetableData();
  }, [selectedYear, selectedDegree]);

  // Calculate duration in hours
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    return (end - start) / (1000 * 60 * 60); // Duration in hours
  };

  // Get grid row position based on time
  const getGridRowPosition = (startTime, duration) => {
    const startSlotIndex = timeSlots.findIndex(slot => slot.start === startTime);
    if (startSlotIndex === -1) return { gridRowStart: 2, gridRowEnd: 3 };
    
    const gridRowStart = startSlotIndex + 2; // +2 because grid starts at row 2 (after header)
    const gridRowEnd = gridRowStart + duration;
    
    return { gridRowStart, gridRowEnd };
  };

  // Get grid column position based on day
  const getGridColumnPosition = (day) => {
    const dayIndex = days.indexOf(day);
    return dayIndex + 2; // +2 because first column is time column
  };

  // Fixed function to get classes for specific day and time slot
  const getClassesForTimeSlot = (day, timeSlot) => {
    const classes = timetableData.filter(item => {
      if (item.day !== day) return false;
      
      // Convert times to minutes for easier comparison
      const itemStartMinutes = timeToMinutes(item.startTime);
      const itemEndMinutes = timeToMinutes(item.endTime);
      const slotStartMinutes = timeToMinutes(timeSlot.start);
      const slotEndMinutes = timeToMinutes(timeSlot.end);
      
      // Check if the class overlaps with this time slot
      return itemStartMinutes < slotEndMinutes && itemEndMinutes > slotStartMinutes;
    });
    
    console.log(`Classes for ${day} ${timeSlot.start}-${timeSlot.end}:`, classes); // Debug log
    return classes;
  };

  // Helper function to convert time string to minutes
  const timeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'LECTURE': return '#60a5fa'; // blue
      case 'PRACTICAL': return '#34d399'; // green
      case 'TUTORIAL': return '#fbbf24'; // yellow
      default: return '#9ca3af'; // gray
    }
  };

  return (
    <div className="timetable-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="app-title">
            ReidConnect <span className="academic-text">AcademicAdmin</span>
          </h1>
        </div>
        <div className="header-right">
          <div className="header-icons">
            <i className="fas fa-bell icon"></i>
            <i className="fas fa-user icon"></i>
          </div>
          <span className="admin-text">Admin</span>
        </div>
      </header>

      <div className="content">
        <main className="main-content">
          {/* Page Header with Filters */}
          <div className="page-header">
            <h2 className="page-title">Academic Timetable</h2>
            <div className="filters">
              <div className="filter-group">
                <label className="filter-label">Year:</label>
                <select 
                  className="filter-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="YEAR_1">First Year</option>
                  <option value="YEAR_2">Second Year</option>
                  <option value="YEAR_3">Third Year</option>
                  <option value="YEAR_4">Fourth Year</option>
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label">Degree:</label>
                <select 
                  className="filter-select"
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                >
                  <option value="CS">Computer Science</option>
                  <option value="IS">Information Systems</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timetable Grid */}
          <section className="timetable-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading timetable...</p>
              </div>
            ) : (
              <div className="timetable-wrapper">
                <div className="timetable-grid">
                  {/* Header Row */}
                  <div className="grid-header time-header">Time</div>
                  {days.map(day => (
                    <div key={day} className="grid-header day-header">
                      <div className="day-name">{day}</div>
                    </div>
                  ))}

                  {/* Time Slots and Classes */}
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <React.Fragment key={timeIndex}>
                      <div className="time-cell">
                        {timeSlot.start} - {timeSlot.end}
                      </div>
                      {days.map((day, dayIndex) => {
                        const classesInSlot = getClassesForTimeSlot(day, timeSlot);
                        
                        // Only show lunch break if there are no classes in this slot
                        if (timeSlot.start === "12:00" && classesInSlot.length === 0) {
                          return (
                            <div key={`${day}-${timeIndex}`} className="lunch-break">
                              Lunch Break
                            </div>
                          );
                        }
                        
                        return (
                          <div key={`${day}-${timeIndex}`} className="schedule-cell">
                            {classesInSlot.map(item => {
                              // Check if this time slot is the start of the class
                              const itemStartMinutes = timeToMinutes(item.startTime);
                              const slotStartMinutes = timeToMinutes(timeSlot.start);
                              
                              // Only render if this is the starting time slot for the class
                              if (itemStartMinutes === slotStartMinutes) {
                                const duration = calculateDuration(item.startTime, item.endTime);
                                
                                return (
                                  <div
                                    key={`${item.id}-${item.courseCode}`}
                                    className="schedule-item"
                                    style={{
                                      backgroundColor: getTypeColor(item.courseType),
                                      height: `${duration * 100}%`,
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      zIndex: 1
                                    }}
                                  >
                                    <div className="course-code">{item.courseCode}</div>
                                    <div className="course-type">{item.courseType?.charAt(0) || 'L'}</div>
                                    <div className="course-venue">{item.venue}</div>
                                    {item.lecturerCodes && (
                                      <div className="lecturer-code">{item.lecturerCodes}</div>
                                    )}
                                    {item.group && item.group !== 'ALL' && (
                                      <div className="group-info">{item.group}</div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            })}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Course List */}
          <section className="courses-section">
            <h3 className="courses-title">Course Codes & Names</h3>
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading courses...</p>
              </div>
            ) : (
              <div className="courses-grid">
                {coursesData.map((course, index) => (
                  <div key={course.id || index} className="course-item">
                    <span className="course-code-text">{course.code}</span>
                    <span className="course-name-text">
                      {course.name} ({course.credits} Credits)
                      {course.lecturerNames && course.lecturerNames.length > 0 && (
                        <div className="lecturer-names">
                          {course.lecturerNames.join(', ')}
                        </div>
                      )}
                    </span>
                  </div>
                ))}
                {coursesData.length === 0 && (
                  <div className="no-data">
                    <p>No courses found for the selected filters.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
 

      <style>{`
        .timetable-container {
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          letter-spacing: -0.01em;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: white;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background-color: #2a2a2a;
          border-bottom: 1px solid #333;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          z-index: 1001;
        }

        .header-left {
          flex: 1;
        }

        .app-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          color: white;
        }

        .academic-text {
          color: #ef4444;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
          color: white;
        }

        .header-icons {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon {
          font-size: 20px;
          color: white;
          cursor: pointer;
        }

        .admin-text {
          font-size: 16px;
        }

        /* Content */
        .content {
          margin-top: 64px;
        }

        .main-content {
          padding: 32px;
          background-color: #1a1a1a;
          min-height: calc(100vh - 64px);
          overflow-y: auto;
          margin-left: 186px;
        }

        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .page-title {
          font-size: 32px;
          font-weight: bold;
          margin: 0;
        }

        .filters {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-label {
          font-size: 14px;
          font-weight: 500;
          color: #ccc;
        }

        .filter-select {
          background-color: #2a2a2a;
          border: 1px solid #333;
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
        }

        .filter-select:focus {
          outline: none;
          border-color: #ef4444;
        }

        /* Timetable Section */
        .timetable-section {
          background-color: #2a2a2a;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 32px;
          border: 1px solid #333;
          overflow-x: auto;
        }

        .timetable-wrapper {
          min-width: 800px;
        }

        .timetable-grid {
          display: grid;
          grid-template-columns: 120px repeat(5, 1fr);
          gap: 1px;
          background-color: #333;
          border: 1px solid #333;
        }

        .grid-header {
          background-color: #404040;
          padding: 12px 8px;
          font-weight: 600;
          text-align: center;
          color: #fff;
          font-size: 14px;
        }

        .time-header {
          background-color: #333;
        }

        .day-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .day-name {
          font-size: 14px;
          font-weight: bold;
        }

        .time-cell {
          background-color: #2a2a2a;
          padding: 12px 8px;
          font-size: 12px;
          font-weight: 500;
          color: #ccc;
          text-align: center;
          border-right: 1px solid #333;
        }

        .schedule-cell {
          background-color: #1a1a1a;
          padding: 0;
          min-height: 60px;
          position: relative;
          border: 1px solid #333;
        }

        .lunch-break {
          background-color: #444;
          padding: 12px;
          text-align: center;
          font-weight: 500;
          color: #ccc;
          grid-column: span 1;
        }

        .schedule-item {
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 10px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .course-code {
          font-weight: bold;
          font-size: 10px;
          margin-bottom: 2px;
        }

        .course-type {
          font-size: 8px;
          opacity: 0.9;
          margin-bottom: 2px;
        }

        .course-venue {
          font-size: 8px;
          opacity: 0.8;
          margin-bottom: 2px;
        }

        .lecturer-code {
          font-size: 8px;
          opacity: 0.7;
          margin-bottom: 2px;
        }

        .group-info {
          font-size: 8px;
          opacity: 0.8;
          font-weight: 500;
        }

        /* Courses Section */
        .courses-section {
          background-color: #2a2a2a;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #333;
        }

        .courses-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: white;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 12px;
        }

        .course-item {
          display: flex;
          flex-direction: column;
          padding: 12px;
          background-color: #333;
          border-radius: 8px;
          border: 1px solid #444;
        }

        .course-code-text {
          font-weight: bold;
          color: #60a5fa;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .course-name-text {
          color: #ccc;
          font-size: 12px;
          line-height: 1.4;
        }

        .lecturer-names {
          font-size: 11px;
          color: #888;
          margin-top: 4px;
          font-style: italic;
        }

        /* Loading Styles */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #ccc;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #333;
          border-top: 4px solid #ef4444;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .no-data {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: #888;
        }

        .no-data p {
          margin: 0;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .filters {
            width: 100%;
            justify-content: flex-start;
          }

          .timetable-grid {
            font-size: 12px;
          }

          .schedule-item {
            font-size: 8px;
            min-height: 40px;
            padding: 2px 4px;
          }

          .courses-grid {
            grid-template-columns: 1fr;
          }

          .main-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}