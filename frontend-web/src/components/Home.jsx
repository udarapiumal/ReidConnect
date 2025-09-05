import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, User, BookOpen, Monitor, CalendarMinus,Cpu, MemoryStick  } from 'lucide-react';
import reidConnectLogo from "../images/ucsc-logo.png";
import '../css/Home1.css';

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

export default function LectureDashboard() {
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

  // Get current 2-hour period
  // Get current 2-hour period
const getCurrentHourPeriod = () => {
  const now = new Date();
  const hour = now.getHours();

  // Current hour start and end
  const pad = (num) => num.toString().padStart(2, "0");
  const blockStart = `${pad(hour)}:00`;
  const blockEnd = `${pad((hour + 1) % 24)}:00`;

  // Find slots within this 1-hour block
  let startSlot = null;
  let endSlot = null;

  for (let slotId = 1; slotId <= 22; slotId++) {
    const slot = timeSlotConfig.slotToTime[slotId];
    if (slot.start >= blockStart && slot.end <= blockEnd) {
      if (!startSlot) startSlot = slotId;
      endSlot = slotId;
    }
  }

  if (!startSlot || !endSlot) return null;

  return { startSlot, endSlot, blockStart, blockEnd };
};


  const period = getCurrentHourPeriod();

if (!period) {
  return (
    <div className="dashboard-container1">
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

      <div className="period-header">
        <div className="session-count">
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-container">       
          <div className="no-classes">         
            <div className="no-classes-content">           
              <div className="no-classes-icon">             
                <Clock size={32} />           
              </div>           
                <h3>Day Over</h3>           
                <p>Will be refreshed at 08.00am</p>         
              </div>       
            </div>     
          </div>
        </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-stats">
          <div className="stat-item">
            <div className="stat-number">
             
            </div>
            <div className="stat-label">LECTURES</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              
            </div>
            <div className="stat-label">PRACTICALS</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
             
            </div>
            <div className="stat-label">TUTORIALS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const { startSlot, endSlot } = period;

  // Filter lectures for current 2-hour period
  const currentPeriodLectures = lectures.filter(lecture => {
  return lecture.slotIds.some(slotId => slotId >= startSlot && slotId <= endSlot);
});


  const isCurrentlyActive = (slotIds) => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().substring(0, 5);
    
    for (const slotId of slotIds) {
      const slot = timeSlotConfig.slotToTime[slotId];
      if (slot && currentTimeStr >= slot.start && currentTimeStr <= slot.end) {
        return true;
      }
    }
    return false;
  };

  const getTypeIcon = (courseType) => {
    return courseType === 'LECTURE' ? BookOpen : Monitor;
  };

  const formatTimeRange = (slotIds) => {
    const timeRange = timeSlotConfig.convertSlotsToTime(slotIds);
    if (!timeRange) return '';
    return `${timeRange.startTime} - ${timeRange.endTime}`;
  };

  // Organize lectures by degree and year
  const organizeLectures = (degree) => {
    const degreeLectures = currentPeriodLectures.filter(lecture => lecture.degree === degree);
    const yearSlots = { 1: null, 2: null, 3: null, 4: null };
    
    degreeLectures.forEach(lecture => {
      const yearNum = parseInt(lecture.year.replace('YEAR_', ''));
      if (!yearSlots[yearNum]) {
        yearSlots[yearNum] = lecture;
      }
    });
    
    return yearSlots;
  };

  const periodStartTime = timeSlotConfig.slotToTime[startSlot]?.start;
  const periodEndTime = timeSlotConfig.slotToTime[endSlot]?.end;

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

  const renderLectureCard = (lecture, year, degree) => {
    if (!lecture) {
      return (
        <div key={`${degree}-year-${year}`} className="lecture-card empty" tabIndex="0">
            
          <span className="empty-text"><CalendarMinus className="calendar-icon" />No session - Year {year}</span>
        </div>
      );
    }

    const TypeIcon = getTypeIcon(lecture.courseType);
    const isActive = isCurrentlyActive(lecture.slotIds);
    const status = getLectureStatus(lecture.slotIds);

    return (
      <div
        key={lecture.id}
        className={`lecture-card ${degree.toLowerCase()} ${isActive ? 'active' : ''}`}
        tabIndex="0"
        role="button"
        aria-label={`${lecture.courseName} lecture for Year ${year} ${degree}`}
      >


        {/* Status Indicator */}
        <div className={`status-indicator ${status}`} title={`Status: ${status}`}></div>

        <div>
          <div className="card-header">
            <div className={`course-type-badge ${lecture.courseType.toLowerCase()}`}>
              <TypeIcon size={12} />
              {lecture.courseType}
            </div>
            <div className="year-badge">
              Year {lecture.year.replace('YEAR_', '')}
            </div>
          </div>

          <div className="course-info">
            <h3 className={`course-code ${degree.toLowerCase()}`}>
              {lecture.courseCode}
            </h3>
            <p className="course-name" title={lecture.courseName}>
              {lecture.courseName}
            </p>
          </div>

          <div className="info-item">
            <Clock className="info-icon" />
            <span className="info-text">
              {formatTimeRange(lecture.slotIds)}
            </span>
          </div>
        </div>

        <div>
          <div className="info-item">
            <User className="info-icon" />
            <span className="info-text" title={lecture.lecturerNames}>
              {lecture.lecturerNames}
            </span>
          </div>

          <div className="info-item">
            <MapPin className="info-icon" />
            <span className="info-text">
              {lecture.venue}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const isLectures = organizeLectures('IS');
  const csLectures = organizeLectures('CS');

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
  <div className="header-content">
    {/* Left: Logo */}
    <div className="logo-section">
      <div className="logo-icon">
        <img src={reidConnectLogo} alt="ReidConnect" className='logoImage'/>
      </div>
      <div className="logo-text">
        <h1>ReidConnect</h1>
      </div>
    </div>

    {/* Right: Time + Login */}
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

      {/* Main Content */}
      <div className="main-content">
          <div className="degree-sections">
            

            {/* CS Section */}
            <div className="degree-section">
              <div className="degree-header">
                <h2 className="degree-title is"><Cpu  /> Computer Science</h2>
                <p className="degree-subtitle">CS Degree Programme</p>
              </div>
              <div className="year-grid">
                {[1, 2, 3, 4].map(year => 
                  renderLectureCard(csLectures[year], year, 'CS')
                )}
              </div>
            </div>

            {/* IS Section */}
            <div className="degree-section">
              <div className="degree-header">
                <h2 className="degree-title cs"><MemoryStick  /> Information Systems</h2>
                <p className="degree-subtitle"> IS Degree Programme</p>
              </div>
              <div className="year-grid">
                {[1, 2, 3, 4].map(year => 
                  renderLectureCard(isLectures[year], year, 'IS')
                )}
              </div>
            </div>

          </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <div className="footer-stats">
          <div className="stat-item">
            <div className="stat-number">
              {currentPeriodLectures.filter(l => l.courseType === 'LECTURE').length}
            </div>
            <div className="stat-label">LECTURES</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {currentPeriodLectures.filter(l => l.courseType === 'PRACTICAL').length}
            </div>
            <div className="stat-label">PRACTICALS</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {currentPeriodLectures.filter(l => l.courseType === 'TUTORIAL').length}
            </div>
            <div className="stat-label">TUTORIALS</div>
          </div>
        </div>
      </div>
    </div>
  );
}