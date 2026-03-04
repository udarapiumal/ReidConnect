import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { Clock, MapPin, User, BookOpen, Monitor, CalendarMinus, Cpu, MemoryStick } from 'lucide-react';
import reidConnectLogo from "../images/ucsc-logo.png";
import styles from '../css/Home1.module.css';

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
  const [currentPeriod, setCurrentPeriod] = useState(null);

  useEffect(() => {
    const fetchCurrentPeriod = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/academic-calendar/current`);
        if (!res.ok) throw new Error('Failed to fetch period');
        const period = await res.json();
        setCurrentPeriod(period);
        return period;
      } catch (err) {
        console.error(err);
        return null;
      }
    };

    const fetchLectures = async (periodId) => {
      if (!periodId) return;
      try {
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        const response = await fetch(`${API_BASE_URL}/api/timetable/byDay?day=${today}&academicCalendarId=${periodId}`);
        if (!response.ok) throw new Error('Failed to fetch lectures');
        const data = await response.json();
        setLectures(data);
      } catch (err) {
        console.error(err);
      }
    };

    const init = async () => {
      const period = await fetchCurrentPeriod();
      if (period && period.periodType === 'SEMESTER') {
        // Only show timetable on public page if APPROVED
        try {
          const statusRes = await fetch(`${API_BASE_URL}/api/timetable-approvals/status/${period.id}`);
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            if (statusData.status === 'APPROVED') {
              fetchLectures(period.id);
              return;
            }
          }
        } catch (err) {
          console.error('Error checking approval status:', err);
        }
        setLectures([]);
      }
    };

    init();
  }, []);

  const getCurrentHourPeriod = () => {
    const now = new Date();
    const hour = now.getHours();
    const pad = (num) => num.toString().padStart(2, "0");
    const blockStart = `${pad(hour)}:00`;
    const blockEnd = `${pad((hour + 1) % 24)}:00`;
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
      <div className={styles["dashboard-container1"]}>
        <div className={styles.header}>
          <div className={styles["header-content"]}>
            <div className={styles["logo-section"]}>
              <div className={styles["logo-icon"]}>
                <img src={reidConnectLogo} alt="ReidConnect" className={styles.logoImage} />
              </div>
              <div className={styles["logo-text"]}><h1>ReidConnect</h1></div>
            </div>

            <div className={styles["right-section"]}>
              <div className={styles["time-section"]}>
                <div className={styles["current-time"]}>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className={styles["current-date"]}>
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <Link to="/login">
                <button className={styles["login-btn"]}>Login</button>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles["main-content"]}>
          <div className={styles["dashboard-container"]}>
            <div className={styles["no-classes"]}>
              <div className={styles["no-classes-content"]}>
                <div className={styles["no-classes-icon"]}>
                  <Clock size={32} />
                </div>
                <h3>Day Over</h3>
                <p>Will be refreshed at 08.00am</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { startSlot, endSlot } = period;
  const currentPeriodLectures = lectures.filter(lecture =>
    lecture.slotIds.some(slotId => slotId >= startSlot && slotId <= endSlot)
  );

  const isCurrentlyActive = (slotIds) => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().substring(0, 5);
    return slotIds.some(slotId => {
      const slot = timeSlotConfig.slotToTime[slotId];
      return slot && currentTimeStr >= slot.start && currentTimeStr <= slot.end;
    });
  };

  const getTypeIcon = (courseType) => courseType === 'LECTURE' ? BookOpen : Monitor;

  const formatTimeRange = (slotIds) => {
    const timeRange = timeSlotConfig.convertSlotsToTime(slotIds);
    if (!timeRange) return '';
    return `${timeRange.startTime} - ${timeRange.endTime}`;
  };

  const organizeLectures = (degree) => {
    const degreeLectures = currentPeriodLectures.filter(l => l.degree === degree);
    const yearSlots = { 1: null, 2: null, 3: null, 4: null };
    degreeLectures.forEach(lecture => {
      const yearNum = parseInt(lecture.year.replace('YEAR_', ''));
      if (!yearSlots[yearNum]) yearSlots[yearNum] = lecture;
    });
    return yearSlots;
  };

  const getLectureStatus = (slotIds) => {
    const now = new Date();
    const currentTimeStr = now.toTimeString().substring(0, 5);
    const timeRange = timeSlotConfig.convertSlotsToTime(slotIds);
    if (!timeRange) return 'upcoming';
    if (currentTimeStr >= timeRange.startTime && currentTimeStr <= timeRange.endTime) return 'active';
    return currentTimeStr > timeRange.endTime ? 'completed' : 'upcoming';
  };

  const renderLectureCard = (lecture, year, degree) => {
    if (!lecture) {
      return (
        <div key={`${degree}-year-${year}`} className={`${styles["lecture-card"]} ${styles.empty}`} tabIndex="0">
          <span className={styles["empty-text"]}>
            <CalendarMinus className={styles["calendar-icon"]} /> No session - Year {year}
          </span>
        </div>
      );
    }

    const TypeIcon = getTypeIcon(lecture.courseType);
    const isActive = isCurrentlyActive(lecture.slotIds);
    const status = getLectureStatus(lecture.slotIds);

    return (
      <div
        key={lecture.id}
        className={`${styles["lecture-card"]} ${styles[degree.toLowerCase()]} ${isActive ? styles.active : ''}`}
        tabIndex="0"
        role="button"
        aria-label={`${lecture.courseName} lecture for Year ${year} ${degree}`}
      >
        <div className={`${styles["status-indicator"]} ${styles[status]}`} title={`Status: ${status}`}></div>

        <div>
          <div className={styles["card-header"]}>
            <div className={`${styles["course-type-badge"]} ${styles[lecture.courseType.toLowerCase()]}`}>
              <TypeIcon size={12} />
              {lecture.courseType}
            </div>
            <div className={styles["year-badge"]}>
              Year {lecture.year.replace('YEAR_', '')}
            </div>
          </div>

          <div className={styles["course-info"]}>
            <h3 className={`${styles["course-code"]} ${styles[degree.toLowerCase()]}`}>
              {lecture.courseCode}
            </h3>
            <p className={styles["course-name"]} title={lecture.courseName}>
              {lecture.courseName}
            </p>
          </div>

          <div className={styles["info-item"]}>
            <Clock className={styles["info-icon"]} />
            <span className={styles["info-text"]}>{formatTimeRange(lecture.slotIds)}</span>
          </div>
        </div>

        <div>
          <div className={styles["info-item"]}>
            <User className={styles["info-icon"]} />
            <span className={styles["info-text"]} title={lecture.lecturerNames}>
              {lecture.lecturerNames}
            </span>
          </div>

          <div className={styles["info-item"]}>
            <MapPin className={styles["info-icon"]} />
            <span className={styles["info-text"]}>{lecture.venue}</span>
          </div>
        </div>
      </div>
    );
  };

  const isLectures = organizeLectures('IS');
  const csLectures = organizeLectures('CS');

  if (currentPeriod && currentPeriod.periodType !== "SEMESTER") {
    return (
      <div className={styles["dashboard-container1"]}>
        <div className={styles.header}>
          <div className={styles["header-content"]}>
            <div className={styles["logo-section"]}>
              <div className={styles["logo-icon"]}>
                <img src={reidConnectLogo} alt="ReidConnect" className={styles.logoImage} />
              </div>
              <div className={styles["logo-text"]}><h1>ReidConnect</h1></div>
            </div>
            <div className={styles["right-section"]}>
              <div className={styles["time-section"]}>
                <div className={styles["current-time"]}>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className={styles["current-date"]}>
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <Link to="/login">
                <button className={styles["login-btn"]}>Login</button>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles["period-message-card"]}>
          <h2>{currentPeriod.title}</h2>
          <p>{currentPeriod.periodType.replace("_", " ")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles.header}>
        <div className={styles["header-content"]}>
          <div className={styles["logo-section"]}>
            <div className={styles["logo-icon"]}>
              <img src={reidConnectLogo} alt="ReidConnect" className={styles.logoImage} />
            </div>
            <div className={styles["logo-text"]}><h1>ReidConnect</h1></div>
          </div>

          <div className={styles["right-section"]}>
            <div className={styles["time-section"]}>
              <div className={styles["current-time"]}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={styles["current-date"]}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
            <Link to="/login">
              <button className={styles["login-btn"]}>Login</button>
            </Link>
          </div>
        </div>
      </div>

      <div className={styles["main-content"]}>
        <div className={styles["degree-sections"]}>
          <div className={styles["degree-section"]}>
            <div className={styles["degree-header"]}>
              <h2 className={`${styles["degree-title"]} ${styles.is}`}><Cpu /> Computer Science</h2>
              <p className={styles["degree-subtitle"]}>CS Degree Programme</p>
            </div>
            <div className={styles["year-grid"]}>
              {[1, 2, 3, 4].map(year => renderLectureCard(csLectures[year], year, 'CS'))}
            </div>
          </div>

          <div className={styles["degree-section"]}>
            <div className={styles["degree-header"]}>
              <h2 className={`${styles["degree-title"]} ${styles.cs}`}><MemoryStick /> Information Systems</h2>
              <p className={styles["degree-subtitle"]}>IS Degree Programme</p>
            </div>
            <div className={styles["year-grid"]}>
              {[1, 2, 3, 4].map(year => renderLectureCard(isLectures[year], year, 'IS'))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles["footer-stats"]}>
          <div className={styles["stat-item"]}>
            <div className={styles["stat-number"]}>
              {currentPeriodLectures.filter(l => l.courseType === 'LECTURE').length}
            </div>
            <div className={styles["stat-label"]}>LECTURES</div>
          </div>
          <div className={styles["stat-item"]}>
            <div className={styles["stat-number"]}>
              {currentPeriodLectures.filter(l => l.courseType === 'PRACTICAL').length}
            </div>
            <div className={styles["stat-label"]}>PRACTICALS</div>
          </div>
          <div className={styles["stat-item"]}>
            <div className={styles["stat-number"]}>
              {currentPeriodLectures.filter(l => l.courseType === 'TUTORIAL').length}
            </div>
            <div className={styles["stat-label"]}>TUTORIALS</div>
          </div>
        </div>
      </div>
    </div>
  );
}
