import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, User, BookOpen, Monitor } from 'lucide-react';
import reidConnectLogo from "../images/ucsc-logo.png";
import '../css/Home2.css';

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
        className={`lecture-cell ${status}`}
        style={{ gridRow: `span ${slotSpan}` }}
      >
        <div className="lecture-header">
          <div className="course-code">
            {lecture.courseCode}
          </div>
          <div className={`course-type-badge ${lecture.courseType.toLowerCase()}`}>
            <TypeIcon size={10} />
            {lecture.courseType.substring(0, 3)}
          </div>
        </div>
        
        <div className="course-name">
          {lecture.courseName}
        </div>
        
        <div className="lecture-details">
          <div className="detail-item">
            <Clock size={10} />
            <span>{formatTimeRange(lecture.slotIds)}</span>
          </div>
          <div className="detail-item">
            <User size={10} />
            <span>{lecture.lecturerNames}</span>
          </div>
          <div className="detail-item">
            <MapPin size={10} />
            <span>{lecture.venue}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="timetable-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <img src={reidConnectLogo} alt="ReidConnect" className='logoImage'/>
            </div>
            <div className="logo-text">
              <h1>ReidConnect</h1>
            </div>
          </div>

          <div className="right-section">
            <div className="time-section">
              <div className="current-time">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="current-date">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>

            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Timetable Header */}
      <div className="timetable-header">
        <h2 className="timetable-title">
          Daily Timetable - {currentTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </h2>
        <div className="session-count">
          {lectures.length} total sessions
        </div>
      </div>

      {/* Main Timetable */}
      <div className="main-content">
        <div className="timetable-wrapper">
          <table className="timetable">
            {/* Table Headers */}
            <thead>
              <tr>
                <th className="time-header" rowSpan={2}>Time</th>
                <th className="year-header" colSpan={2}>Year 1</th>
                <th className="year-header" colSpan={2}>Year 2</th>
                <th className="year-header" colSpan={2}>Year 3</th>
                <th className="year-header" colSpan={2}>Year 4</th>
              </tr>
              <tr>
                <th className="degree-header cs">CS</th>
                <th className="degree-header is">IS</th>
                <th className="degree-header cs">CS</th>
                <th className="degree-header is">IS</th>
                <th className="degree-header cs">CS</th>
                <th className="degree-header is">IS</th>
                <th className="degree-header cs">CS</th>
                <th className="degree-header is">IS</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot.slotId} className="time-row">
                  {/* Time column */}
                  <td className={`time-slot ${currentSlot === slot.slotId ? 'current' : ''}`}>
                    <div className="time-display">{slot.time}</div>
                    <div className="time-end">{slot.endTime}</div>
                  </td>

                  {/* Year 1 CS */}
                  <td className="lecture-slot">
                    {getLecturesForCell(slot.slotId, 'YEAR_1', 'CS').map(lecture => {
                      const span = getSlotSpan(lecture, slot.slotId);
                      return span > 0 ? renderLectureCell(lecture, span) : null;
                    })}
                  </td>

                  {/* Year 1 IS */}
                  <td className="lecture-slot">
                    {getLecturesForCell(slot.slotId, 'YEAR_1', 'IS').map(lecture => {
                      const span = getSlotSpan(lecture, slot.slotId);
                      return span > 0 ? renderLectureCell(lecture, span) : null;
                    })}
                  </td>

                  {/* Year 2 CS */}
                  <td className="lecture-slot">
                    {getLecturesForCell(slot.slotId, 'YEAR_2', 'CS').map(lecture => {
                      const span = getSlotSpan(lecture, slot.slotId);
                      return span > 0 ? renderLectureCell(lecture, span) : null;
                    })}
                  </td>

                  {/* Year 2 IS */}
                  <td className="lecture-slot">
                    {getLecturesForCell(slot.slotId, 'YEAR_2', 'IS').map(lecture => {
                      const span = getSlotSpan(lecture, slot.slotId);
                      return span > 0 ? renderLectureCell(lecture, span) : null;
                    })}
                  </td>

                  {/* Year 3 CS */}
                  <td className="lecture-slot">
                    {getLecturesForCell(slot.slotId, 'YEAR_3', 'CS').map(lecture => {
                      const span = getSlotSpan(lecture, slot.slotId);
                      return span > 0 ? renderLectureCell(lecture, span) : null;
                    })}
                  </td>

                  {/* Year 3 IS */}
                  <td className="lecture-slot">
                    {getLecturesForCell(slot.slotId, 'YEAR_3', 'IS').map(lecture => {
                      const span = getSlotSpan(lecture, slot.slotId);
                      return span > 0 ? renderLectureCell(lecture, span) : null;
                    })}
                  </td>

                  {/* Year 4 CS */}
                  <td className="lecture-slot">
                    {getLecturesForCell(slot.slotId, 'YEAR_4', 'CS').map(lecture => {
                      const span = getSlotSpan(lecture, slot.slotId);
                      return span > 0 ? renderLectureCell(lecture, span) : null;
                    })}
                  </td>

                  {/* Year 4 IS */}
                  <td className="lecture-slot">
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

      {/* Footer */}
      <div className="footer">
        <div className="footer-stats">
          <div className="stat-item">
            <div className="stat-number">
              {lectures.filter(l => l.courseType === 'LECTURE').length}
            </div>
            <div className="stat-label">LECTURES</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">
              {lectures.filter(l => l.courseType === 'PRACTICAL').length}
            </div>
            <div className="stat-label">PRACTICALS</div>
          </div>
          
          <div className="stat-item">
            <div className="stat-number">
              {lectures.filter(l => l.courseType === 'TUTORIAL').length}
            </div>
            <div className="stat-label">TUTORIALS</div>
          </div>
        </div>
      </div>
    </div>
  );
}