import React, { useState } from 'react';
import AcademicSidebar from './AcademicSidebar';
import { useNavigate } from 'react-router-dom';

const EventSchedule = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All events");
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(6); // July = 6 (0-indexed)

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = `${months[currentMonthIndex]} ${currentYear}`;

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = 6;

  const events = {
    1: [{ title: "Action Pl...", type: "action" }],
    4: [
      { title: "Bi-weekl...", type: "biweekly" },
      { title: "Interim R...", type: "interim" }
    ],
    6: [{ title: "UI Challe...", type: "ui" }],
    7: [
      { title: "Assignm...", type: "assignment" },
      { title: "Uploadin...", type: "upload" }
    ],
    17: [{ title: "UI Challe...", type: "ui" }]
  };

  const navigatePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonthIndex(prev => prev - 1);
    }
  };

  const navigateNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonthIndex(prev => prev + 1);
    }
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days = Array(adjustedFirstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="event-schedule-container">
      <header className="header">
        <h1 className="app-title">
          ReidConnect <span className="highlight">AcademicAdmin</span>
        </h1>
        <div className="header-icons">
          <i className="fas fa-bell icon" />
          <i className="fas fa-user icon" />
          <span className="admin-text">Admin</span>
        </div>
      </header>

      <div className="content-wrapper">
        <AcademicSidebar activeItem="Event Schedule" />
        <main className="main-content">
          <h2 className="page-title">Calendar</h2>

          <div className="calendar-container">
            <div className="calendar-header">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="filter-select"
              >
                <option>All events</option>
                <option>Upcoming events</option>
              </select>

              <div className="month-navigation">
                <button onClick={navigatePrevMonth} className="nav-button">
                  ◀ {months[(currentMonthIndex + 11) % 12]}
                </button>
                <span className="current-month">{currentMonth}</span>
                <button onClick={navigateNextMonth} className="nav-button">
                  {months[(currentMonthIndex + 1) % 12]} ▶
                </button>
              </div>

              <button className="new-event-button">
                <i className="fas fa-plus" />
                <span>New event</span>
              </button>
            </div>

            <div>
              <div className="weekdays-grid">
                {daysOfWeek.map(day => <div key={day} className="weekday">{day}</div>)}
              </div>

              <div className="calendar-grid">
                {calendarDays.map((day, index) => (
                  <div key={index} className={`calendar-day${day === today ? " today" : ""}`}>
                    {day && (
                      <>
                        <div className="day-number">{day}</div>
                        {day === today && <div className="today-indicator" />}
                        {events[day] && (
                          <div className="events-list">
                            {events[day].map((event, idx) => (
                              <div key={idx} className="event-item">
                                <span className="event-dot" />
                                <span className="event-title">{event.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="import-export">
              <button className="import-export-button">Import or export calendars</button>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .event-schedule-container {
          background-color: #1a1a1a;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          background-color: #2a2a2a;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          z-index: 1001;
        }

        .app-title {
          font-size: 20px;
          font-weight: bold;
          color: white;
        }

        .highlight {
          color: #ef4444;
        }

        .header-icons {
          display: flex;
          align-items: center;
          gap: 16px;
          color: white;
        }

        .icon {
          font-size: 20px;
          cursor: pointer;
        }

        .admin-text {
          font-size: 14px;
        }

        .content-wrapper {
          display: flex;
          padding-top: 64px; /* header height */
          flex: 1;
          min-height: calc(100vh - 64px);
        }

        main.main-content {
          flex: 1;
          padding: 32px;
          background-color: #1a1a1a;
          margin-left: 200px; /* sidebar width */
          overflow-y: auto;
          min-height: calc(100vh - 64px);
        }

        .page-title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 24px;
          color: white;
        }

        .calendar-container {
          background-color: #2a2a2a;
          padding: 24px;
          border-radius: 12px;
          min-height: 600px;
          display: flex;
          flex-direction: column;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .filter-select {
          background-color: #333;
          border: 1px solid #555;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 14px;
          min-width: 150px;
          cursor: pointer;
        }

        .month-navigation {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          color: white;
        }

        .nav-button {
          background: none;
          border: none;
          color: #3b82f6; /* blue-400 */
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 6px;
          transition: background-color 0.3s;
        }

        .nav-button:hover {
          background-color: #2563eb; /* blue-600 */
        }

        .current-month {
          font-size: 18px;
        }

        .new-event-button {
          background-color: #ef4444;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.3s;
        }

        .new-event-button:hover {
          background-color: #dc2626;
        }

        .weekdays-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          color: #9ca3af; /* gray-400 */
          font-weight: 600;
          text-align: center;
          margin-bottom: 12px;
          user-select: none;
        }

        .weekday {
          padding: 6px 0;
          font-size: 14px;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .calendar-day {
          border: 1px solid #333;
          min-height: 80px;
          padding: 8px;
          position: relative;
          font-size: 14px;
          color: white;
          background-color: #1f1f1f;
          border-radius: 8px;
          overflow: hidden;
        }

        .calendar-day.today {
          font-weight: bold;
          background-color: #2563eb; /* blue-600 */
          color: white;
        }

        .day-number {
          margin-bottom: 8px;
        }

        .today-indicator {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #3b82f6; /* blue-400 */
          opacity: 0.6;
          pointer-events: none;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          max-height: 50px;
          overflow: hidden;
        }

        .event-item {
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .event-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #f97316; /* orange-500 */
          flex-shrink: 0;
        }

        .event-title {
          font-size: 12px;
          color: white;
        }

        .import-export {
          margin-top: 16px;
        }

        .import-export-button {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          padding: 0;
        }

        .import-export-button:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default EventSchedule;
