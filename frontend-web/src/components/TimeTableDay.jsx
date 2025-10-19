import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, User, BookOpen, Monitor } from 'lucide-react';
import reidConnectLogo from "../images/ucsc-logo.png";

// Time slot configuration
const timeSlotConfig = {
  slotToTime: {
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
  },

  convertSlotsToTime(slotIds) {
    if (!slotIds || slotIds.length === 0) return null;
    
    const sortedSlots = [...slotIds].sort((a, b) => a - b);
    const startTime = this.slotToTime[sortedSlots[0]]?.start;
    const endTime = this.slotToTime[sortedSlots[sortedSlots.length - 1]]?.end;
    
    return { startTime, endTime };
  }
};

export default function TimetableView() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch lectures from API
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        const response = await fetch(`http://localhost:8080/api/timetable/byDay?day=${today}`);
        if (!response.ok) throw new Error('Failed to fetch lectures');
        const data = await response.json();
        setLectures(data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchLectures();
  }, []);
  
  useEffect(() => {
  const topScrollbar = document.querySelector(".top-scrollbar");
  const bottomScrollbar = document.querySelector(".time-table-day-main-content");
  const tableWrapper = document.querySelector(".time-table-day-timetable-wrapper");
  const scrollbarContent = document.querySelector(".scrollbar-content");

  if (topScrollbar && bottomScrollbar && tableWrapper && scrollbarContent) {
    // Match width
    scrollbarContent.style.width = tableWrapper.scrollWidth + "px";

    // Show top scrollbar only if horizontal scroll exists
    if (tableWrapper.scrollWidth > bottomScrollbar.clientWidth) {
      topScrollbar.style.display = "block";
    } else {
      topScrollbar.style.display = "none";
    }

    // Sync scrolls
    const syncScroll = (source, target) => {
      source.addEventListener("scroll", () => {
        target.scrollLeft = source.scrollLeft;
      });
    };
    syncScroll(topScrollbar, bottomScrollbar);
    syncScroll(bottomScrollbar, topScrollbar);
  }
}, []);


  // Generate time slots from 8:00 AM to 7:00 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 1; i <= 22; i++) {
      const slot = timeSlotConfig.slotToTime[i];
      if (slot) {
        slots.push({
          slotId: i,
          time: slot.start,
          endTime: slot.end
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get lecture status
  const getLectureStatus = (slotIds) => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().substring(0, 5);
    
    const timeRange = timeSlotConfig.convertSlotsToTime(slotIds);
    if (!timeRange) return 'upcoming';
    
    if (currentTimeStr >= timeRange.startTime && currentTimeStr <= timeRange.endTime) {
      return 'active';
    } else if (currentTimeStr > timeRange.endTime) {
      return 'completed';
    } else {
      return 'upcoming';
    }
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().substring(0, 5);
    
    for (let i = 1; i <= 22; i++) {
      const slot = timeSlotConfig.slotToTime[i];
      if (slot && currentTimeStr >= slot.start && currentTimeStr < slot.end) {
        return i;
      }
    }
    return null;
  };

  const currentSlot = getCurrentTimeSlot();

  // Get lectures for a specific time slot, year, and degree
  const getLecturesForCell = (slotId, year, degree) => {
    return lectures.filter(lecture => 
      lecture.slotIds.includes(slotId) && 
      lecture.year === year && 
      lecture.degree === degree
    );
  };

  // Check if a time slot spans multiple slots
  const getSlotSpan = (lecture, currentSlotId) => {
    const sortedSlots = [...lecture.slotIds].sort((a, b) => a - b);
    const startSlot = sortedSlots[0];
    const endSlot = sortedSlots[sortedSlots.length - 1];
    
    if (currentSlotId === startSlot) {
      return endSlot - startSlot + 1;
    }
    return 0; // Don't render for subsequent slots
  };

  const getTypeIcon = (courseType) => {
    return courseType === 'LECTURE' ? BookOpen : Monitor;
  };

  const formatTimeRange = (slotIds) => {
    const timeRange = timeSlotConfig.convertSlotsToTime(slotIds);
    if (!timeRange) return '';
    return `${timeRange.startTime} - ${timeRange.endTime}`;
  };

  const renderLectureCell = (lecture, slotSpan) => {
    const TypeIcon = getTypeIcon(lecture.courseType);
    const status = getLectureStatus(lecture.slotIds);

    return (
      <div
        key={lecture.id}
        className={`time-table-day-lecture-cell time-table-day-${status}`}
        style={{ gridRow: `span ${slotSpan}` }}
      >
        <div className="time-table-day-lecture-header">
          <div className="time-table-day-course-code">
            {lecture.courseCode}
          </div>
          <div className={`time-table-day-course-type-badge time-table-day-${lecture.courseType.toLowerCase()}`}>
            <TypeIcon size={10} />
            {lecture.courseType.substring(0, 3)}
          </div>
        </div>
        
        <div className="time-table-day-course-name">
          {lecture.courseName}
        </div>
        
        <div className="time-table-day-lecture-details">
          <div className="time-table-day-detail-item">
            <Clock size={10} />
            <span>{formatTimeRange(lecture.slotIds)}</span>
          </div>
          <div className="time-table-day-detail-item">
            <User size={10} />
            <span>{lecture.lecturerNames}</span>
          </div>
          <div className="time-table-day-detail-item">
            <MapPin size={10} />
            <span>{lecture.venue}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="time-table-day-timetable-container">
      {/* Embedded CSS */}
      <style>{`
        /* Timetable View CSS - Dashboard Integration */
        
        .time-table-day-timetable-container * {
          box-sizing: border-box;
        }

        /* Main container - adjusted for dashboard integration */
        .time-table-day-timetable-container {
          width: 100%;
          min-height: auto;
          height: auto;
          background: transparent;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
          position: relative;
          overflow: visible;
        }

        /* Remove the overlay background when integrated */
        .time-table-day-timetable-container::before {
          display: none;
        }

        /* Timetable Header - adjusted for dashboard */
        .time-table-day-timetable-header {
          padding: 20px 0;
          background: transparent;
          backdrop-filter: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 5;
          height: auto;
          flex-shrink: 0;
        }

        .time-table-day-timetable-header::before {
          display: none;
        }

        .time-table-day-timetable-title {
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Wrapper */
        .time-table-day-scroll-wrapper {
          position: relative;
          width: 100%;
        }

        /* Top scrollbar (hidden by default, shown only when overflow exists) */
        .time-table-day-scrollbar {
          height: 12px;
          overflow-x: auto;
          overflow-y: hidden;
          background: #1a1a1a;
          border-bottom: 1px solid #333;
          display: none; /* ✅ hidden until needed */
        }

        /* Fake scrollbar track */
        .scrollbar-content {
          height: 1px;
        }

        /* Style scrollbars (both top + bottom) */
        .time-table-day-scrollbar::-webkit-scrollbar,
        .time-table-day-main-content::-webkit-scrollbar {
          height: 10px;
        }
        .time-table-day-scrollbar::-webkit-scrollbar-thumb,
        .time-table-day-main-content::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9));
          border-radius: 8px;
        }
        .time-table-day-scrollbar::-webkit-scrollbar-track,
        .time-table-day-main-content::-webkit-scrollbar-track {
          background: #222;
        }
        ckground: #222;
        }

        .time-table-day-session-count {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 600;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Main Content - adjusted for dashboard */
        .time-table-day-main-content {
          flex: 1;
          padding: 0;
          overflow-x: auto;   /* ✅ allow horizontal scrolling */
          overflow-y: hidden; /* keep it clean */
          position: relative;
          z-index: 1;
          min-height: 0;
          width: 100%;
                }

                .time-table-day-timetable-wrapper {
                  width: max-content; /* ✅ expand to fit entire table */
          min-width: 100%;
          margin: 0;
          background: linear-gradient(145deg, rgba(42, 42, 42, 0.8), rgba(37, 37, 37, 0.9));
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 1px 0 rgba(255, 255, 255, 0.05) inset;
          overflow: visible;
          backdrop-filter: blur(8px);
                }

                /* Table Styles */
                .time-table-day-timetable {
                  width: max-content;   /* ✅ ensures all <th>/<td> widths are respected */
          min-width: 100%;
          border-collapse: collapse;
          background: transparent;
          table-layout: auto;
                }

        /* Table Headers */
        .time-table-day-time-header {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(51, 65, 85, 0.9));
          color: #ffffff;
          padding: 16px 8px;
          text-align: center;
          font-weight: 700;
          font-size: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 100px;
          min-width: 100px;
          vertical-align: middle;
        }

        .time-table-day-year-header {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
          color: #ffffff;
          padding: 16px 12px;
          text-align: center;
          font-weight: 700;
          font-size: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 300px;
          min-width: 300px;
        }

        .time-table-day-degree-header {
          padding: 12px 8px;
          text-align: center;
          font-weight: 700;
          font-size: 12px;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 150px;
          min-width: 150px;
        }

        .time-table-day-degree-header.time-table-day-cs {
          background: linear-gradient(135deg, #FF0033 0%, #FF4466 50%, #FF0033 100%);
        }

        .time-table-day-degree-header.time-table-day-is {
          background: linear-gradient(135deg, #003366 0%, #1a4b8c 50%, #003366 100%);
        }

        /* Table Body */
        .time-table-day-time-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          height: 80px;
        }

        .time-table-day-time-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        /* Time Slots */
        .time-table-day-time-slothome2 {
          background: linear-gradient(135deg, rgba(51, 65, 85, 0.9), rgba(71, 85, 105, 0.8));
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 20px;
          text-align: center;
          width: 100px;
          min-width: 100px;
          position: relative;
          vertical-align: middle;
          height: 80px;
        }

        .time-table-day-time-display {
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 2px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .time-table-day-time-end {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.8);
          opacity: 1;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
        }

        .time-table-day-time-slothome2.time-table-day-current {
          background: linear-gradient(135deg, rgba(255, 0, 51, 0.2), rgba(255, 51, 102, 0.1));
          border-color: rgba(255, 0, 51, 0.4);
          box-shadow: 
            0 0 0 2px rgba(255, 0, 51, 0.2),
            0 4px 12px rgba(255, 0, 51, 0.1);
        }

        /* Lecture Slots */
        .time-table-day-lecture-slot {
          background: linear-gradient(135deg, rgba(35, 35, 35, 0.6), rgba(45, 45, 45, 0.4));
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 4px;
          vertical-align: top;
          width: 150px;
          min-width: 150px;
          position: relative;
          height: 80px;
        }

        .time-table-day-lecture-slot:hover {
          background: linear-gradient(135deg, rgba(40, 40, 40, 0.8), rgba(50, 50, 50, 0.6));
        }

        /* Lecture Cells */
        .time-table-day-lecture-cell {
          width: 100%;
          height: 100%;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: linear-gradient(145deg, rgba(45, 45, 45, 0.9), rgba(55, 55, 55, 0.8));
          border: 2px solid transparent;
          position: relative;
          box-sizing: border-box;
        }

        .time-table-day-lecture-cell.time-table-day-active {
          background: linear-gradient(145deg, rgba(16, 185, 129, 0.2), rgba(34, 197, 94, 0.15));
          border-color: rgba(16, 185, 129, 0.6);
          box-shadow: 
            0 0 0 1px rgba(16, 185, 129, 0.3),
            0 4px 16px rgba(16, 185, 129, 0.2);
          animation: time-table-day-pulse 2s infinite;
        }

        .time-table-day-lecture-cell.time-table-day-upcoming {
          background: linear-gradient(145deg, rgba(245, 158, 11, 0.2), rgba(251, 191, 36, 0.15));
          border-color: rgba(245, 158, 11, 0.5);
        }

        .time-table-day-lecture-cell.time-table-day-completed {
          background: linear-gradient(145deg, rgba(100, 116, 139, 0.15), rgba(148, 163, 184, 0.1));
          border-color: rgba(100, 116, 139, 0.3);
          opacity: 0.7;
        }

        .time-table-day-lecture-cell:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        /* Lecture Cell Content */
        .time-table-day-lecture-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
          gap: 4px;
        }

        .time-table-day-course-code {
          font-size: 12px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.2px;
          line-height: 1.2;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .time-table-day-course-type-badge {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 8px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 2px;
          text-transform: uppercase;
          letter-spacing: 0.2px;
          flex-shrink: 0;
        }

        .time-table-day-course-type-badge.time-table-day-lecture {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .time-table-day-course-type-badge.time-table-day-practical {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        .time-table-day-course-type-badge.time-table-day-tutorial {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .time-table-day-course-name {
          color: rgba(255, 255, 255, 0.8);
          font-size: 10px;
          font-weight: 500;
          line-height: 1.2;
          margin-bottom: 6px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          flex: 1;
        }

        .time-table-day-lecture-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: auto;
        }

        .time-table-day-detail-item {
          display: flex;
          align-items: center;
          gap: 3px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 8px;
          font-weight: 500;
        }

        .time-table-day-detail-item svg {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          opacity: 0.8;
          color: rgba(255, 255, 255, 0.8);
        }

        .time-table-day-detail-item span {
          line-height: 1.1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(255, 255, 255, 0.7);
        }

        /* Animations */
        @keyframes time-table-day-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.02);
          }
        }

        /* Focus States for Accessibility */
        .time-table-day-lecture-cell:focus {
          outline: 2px solid rgba(255, 69, 58, 0.6);
          outline-offset: 2px;
        }
      `}</style>

      {/* Timetable Header */}
      <div className="time-table-day-timetable-header">
        <h2 className="time-table-day-timetable-title">
          Daily Timetable - {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </h2>
        <div className="time-table-day-session-count">
          {lectures.length} total sessions
        </div>
      </div>

      <div className="time-table-day-scroll-wrapper">
        {/* Top scrollbar */}
        <div className="time-table-day-scrollbar top-scrollbar">
          <div className="scrollbar-content"></div>
        </div>

        {/* Main Timetable */}
        <div className="time-table-day-main-content">
          <div className="time-table-day-timetable-wrapper">
            <table className="time-table-day-timetable">
              {/* Table Headers */}
              <thead>
                <tr>
                  <th className="time-table-day-time-header" rowSpan={2}>Time</th>
                  <th className="time-table-day-year-header" colSpan={2}>Year 1</th>
                  <th className="time-table-day-year-header" colSpan={2}>Year 2</th>
                  <th className="time-table-day-year-header" colSpan={2}>Year 3</th>
                  <th className="time-table-day-year-header" colSpan={2}>Year 4</th>
                </tr>
                <tr>
                  <th className="time-table-day-degree-header time-table-day-cs">CS</th>
                  <th className="time-table-day-degree-header time-table-day-is">IS</th>
                  <th className="time-table-day-degree-header time-table-day-cs">CS</th>
                  <th className="time-table-day-degree-header time-table-day-is">IS</th>
                  <th className="time-table-day-degree-header time-table-day-cs">CS</th>
                  <th className="time-table-day-degree-header time-table-day-is">IS</th>
                  <th className="time-table-day-degree-header time-table-day-cs">CS</th>
                  <th className="time-table-day-degree-header time-table-day-is">IS</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot.slotId} className="time-table-day-time-row">
                    {/* Time column */}
                    <td className={`time-table-day-time-slothome2 ${currentSlot === slot.slotId ? 'time-table-day-current' : ''}`}>
                      <div className="time-table-day-time-display">{slot.time}</div>
                      <div className="time-table-day-time-end">{slot.endTime}</div>
                    </td>

                    {/* Year 1 CS */}
                    <td className="time-table-day-lecture-slot">
                      {getLecturesForCell(slot.slotId, 'YEAR_1', 'CS').map(lecture => {
                        const span = getSlotSpan(lecture, slot.slotId);
                        return span > 0 ? renderLectureCell(lecture, span) : null;
                      })}
                    </td>

                    {/* Year 1 IS */}
                    <td className="time-table-day-lecture-slot">
                      {getLecturesForCell(slot.slotId, 'YEAR_1', 'IS').map(lecture => {
                        const span = getSlotSpan(lecture, slot.slotId);
                        return span > 0 ? renderLectureCell(lecture, span) : null;
                      })}
                    </td>

                    {/* Year 2 CS */}
                    <td className="time-table-day-lecture-slot">
                      {getLecturesForCell(slot.slotId, 'YEAR_2', 'CS').map(lecture => {
                        const span = getSlotSpan(lecture, slot.slotId);
                        return span > 0 ? renderLectureCell(lecture, span) : null;
                      })}
                    </td>

                    {/* Year 2 IS */}
                    <td className="time-table-day-lecture-slot">
                      {getLecturesForCell(slot.slotId, 'YEAR_2', 'IS').map(lecture => {
                        const span = getSlotSpan(lecture, slot.slotId);
                        return span > 0 ? renderLectureCell(lecture, span) : null;
                      })}
                    </td>

                    {/* Year 3 CS */}
                    <td className="time-table-day-lecture-slot">
                      {getLecturesForCell(slot.slotId, 'YEAR_3', 'CS').map(lecture => {
                        const span = getSlotSpan(lecture, slot.slotId);
                        return span > 0 ? renderLectureCell(lecture, span) : null;
                      })}
                    </td>

                    {/* Year 3 IS */}
                    <td className="time-table-day-lecture-slot">
                      {getLecturesForCell(slot.slotId, 'YEAR_3', 'IS').map(lecture => {
                        const span = getSlotSpan(lecture, slot.slotId);
                        return span > 0 ? renderLectureCell(lecture, span) : null;
                      })}
                    </td>

                    {/* Year 4 CS */}
                    <td className="time-table-day-lecture-slot">
                      {getLecturesForCell(slot.slotId, 'YEAR_4', 'CS').map(lecture => {
                        const span = getSlotSpan(lecture, slot.slotId);
                        return span > 0 ? renderLectureCell(lecture, span) : null;
                      })}
                    </td>

                    {/* Year 4 IS */}
                    <td className="time-table-day-lecture-slot">
                      {getLecturesForCell(slot.slotId, 'YEAR_4', 'IS').map(lecture => {
                        const span = getSlotSpan(lecture, slot.slotId);
                        return span > 0 ? renderLectureCell(lecture, span) : null;
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}