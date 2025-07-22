import React, { useState } from 'react';
import AcademicSidebar from './AcademicSidebar';
import { useNavigate } from 'react-router-dom';

const EventSchedule = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All events");
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(6); // July = 6 (0-indexed)
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showEventViewModal, setShowEventViewModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    location: ''
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = `${months[currentMonthIndex]} ${currentYear}`;

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = 6;

  const events = {
    1: [{ title: "Action Planning Workshop", type: "action", time: "10:00 AM", description: "Strategic planning workshop for the upcoming semester." }],
    4: [
      { title: "Bi-weekly Staff Meeting", type: "biweekly", time: "2:00 PM", description: "Regular staff coordination meeting." },
      { title: "Interim Review Session", type: "interim", time: "4:00 PM", description: "Review of student progress and assessments." }
    ],
    6: [{ title: "UI Challenge Presentation", type: "ui", time: "11:00 AM", description: "Student presentations for UI design challenge." }],
    7: [
      { title: "Assignment Submission", type: "assignment", time: "11:59 PM", description: "Final submission deadline for CS101 assignment." },
      { title: "Uploading Grades", type: "upload", time: "9:00 AM", description: "Faculty deadline for grade submissions." }
    ],
    17: [{ title: "UI Challenge Final", type: "ui", time: "3:00 PM", description: "Final evaluation of UI design projects." }]
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

  const handleNewEventClick = () => {
    setShowNewEventModal(true);
  };

  const handleCloseModal = () => {
    setShowNewEventModal(false);
    setNewEvent({
      title: '',
      date: '',
      time: '',
      description: '',
      location: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('New event:', newEvent);
    // For now, just close the modal
    handleCloseModal();
    // You could also add the event to the local state to see it immediately
  };

  const handleDateClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    setShowEventViewModal(true);
  };

  const handleCloseEventViewModal = () => {
    setShowEventViewModal(false);
    setSelectedDate(null);
  };

  const getEventsForDate = (day) => {
    return events[day] || [];
  };

  const getEventTypeColor = (type) => {
    const colors = {
      action: '#10b981',
      biweekly: '#3b82f6',
      interim: '#f59e0b',
      ui: '#8b5cf6',
      assignment: '#ef4444',
      upload: '#06b6d4',
      academic: '#f97316',
      meeting: '#6366f1',
      conference: '#84cc16',
      workshop: '#ec4899',
      other: '#6b7280'
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="course-management">
      <header className="header">
        <div className="title">ReidConnect <span className="highlight">AcademicAdmin</span></div>
        <div className="admin-info">
          <i className="fa fa-bell" />
          <i className="fa fa-user" />
          <span>Admin</span>
        </div>
      </header>

      <div className="layout">
        <AcademicSidebar activeItem="Event Schedule" />
        <main className="main-content">
          <h1>Calendar</h1>

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

              <button className="new-event-button" onClick={handleNewEventClick}>
                <i className="fa fa-plus" />
                <span>New event</span>
              </button>
            </div>

            <div>
              <div className="weekdays-grid">
                {daysOfWeek.map(day => <div key={day} className="weekday">{day}</div>)}
              </div>

              <div className="calendar-grid">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`calendar-day${day === today ? " today" : ""}`}
                    onClick={() => handleDateClick(day)}
                    style={{ cursor: day ? 'pointer' : 'default' }}
                  >
                    {day && (
                      <>
                        <div className="day-number">{day}</div>
                        {day === today && <div className="today-indicator" />}
                        {events[day] && (
                          <div className="events-list">
                            {events[day].map((event, idx) => (
                              <div key={idx} className="event-item">
                                <span 
                                  className="event-dot" 
                                  style={{ backgroundColor: getEventTypeColor(event.type) }}
                                />
                                <span className="event-title">{event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}</span>
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

      {/* New Event Modal */}
      {showNewEventModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Event</h3>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="event-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Event Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    placeholder="Enter event title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={newEvent.time}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    placeholder="Enter event location"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  rows="4"
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event View Modal */}
      {showEventViewModal && (
        <div className="modal-overlay" onClick={handleCloseEventViewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Events for {months[currentMonthIndex]} {selectedDate}, {currentYear}</h3>
              <button className="close-button" onClick={handleCloseEventViewModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            
            <div className="event-view-content">
              {getEventsForDate(selectedDate).length > 0 ? (
                <div className="events-list-view">
                  {getEventsForDate(selectedDate).map((event, index) => (
                    <div key={index} className="event-card">
                      <div className="event-card-header">
                        <div className="event-card-title">
                          <span 
                            className="event-type-indicator" 
                            style={{ backgroundColor: getEventTypeColor(event.type) }}
                          ></span>
                          <h4>{event.title}</h4>
                        </div>
                      </div>
                      
                      <div className="event-details">
                        {event.time && (
                          <div className="event-time">
                            <i className="fa fa-clock"></i>
                            <span>{event.time}</span>
                          </div>
                        )}
                        
                        {event.description && (
                          <div className="event-description">
                            <i className="fa fa-align-left"></i>
                            <p>{event.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-events-message">
                  <div className="no-events-icon">
                    <i className="fa fa-calendar-alt"></i>
                  </div>
                  <h4>No Events Scheduled</h4>
                  <p>There are no events scheduled for {months[currentMonthIndex]} {selectedDate}, {currentYear}.</p>
                  <button 
                    className="add-event-suggestion" 
                    onClick={() => {
                      handleCloseEventViewModal();
                      handleNewEventClick();
                    }}
                  >
                    <i className="fa fa-plus"></i>
                    Add an Event
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .course-management {
          background-color: #1a1a1a;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 70px;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 1001;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .title {
          font-weight: 700;
          font-size: 22px;
          color: white;
          letter-spacing: -0.02em;
        }

        .title .highlight {
          color: #FF453A;
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .admin-info i {
          font-size: 18px;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 8px;
          border-radius: 8px;
        }

        .admin-info i:hover {
          color: #FF453A;
          background: rgba(249, 115, 22, 0.1);
        }

        .admin-info span {
          font-size: 15px;
          font-weight: 500;
        }

        .layout {
          display: flex;
          padding-top: 70px;
          flex: 1;
          min-height: calc(100vh - 70px);
        }

        main.main-content {
          flex: 1;
          padding: 40px;
          background: transparent;
          margin-left: 200px;
          overflow-y: auto;
          min-height: calc(100vh - 70px);
        }

        main.main-content h1 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          color: white;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
          transition: all 0.2s ease;
        }

        .calendar-day:hover {
          background-color: #2a2a2a;
          border-color: #555;
          transform: translateY(-1px);
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

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          padding: 20px;
        }

        .modal-content {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 32px 32px 0 32px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 28px;
        }

        .modal-header h3 {
          font-size: 26px;
          font-weight: 700;
          color: white;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          font-size: 18px;
          cursor: pointer;
          padding: 10px;
          border-radius: 12px;
          transition: all 0.3s ease;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          transform: translateY(-1px);
        }

        .event-form {
          padding: 0 32px 32px 32px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 16px 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: white;
          font-size: 15px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          font-weight: 400;
          backdrop-filter: blur(10px);
          font-family: inherit;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
        }

        .form-group select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
          padding-right: 48px;
          cursor: pointer;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
          font-weight: 400;
        }

        .form-group select option {
          background: #1a1a1a;
          color: white;
          padding: 12px 16px;
          border: none;
        }

        .form-group select option:checked {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
        }

        .form-group select option:hover {
          background: rgba(249, 115, 22, 0.1);
          color: white;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .cancel-button {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.8);
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
        }

        .cancel-button:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
          transform: translateY(-1px);
        }

        .submit-button {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: none;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Event View Modal Styles */
        .event-view-content {
          padding: 0 32px 32px 32px;
        }

        .events-list-view {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .event-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .event-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-1px);
        }

        .event-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .event-card-title {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .event-type-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .event-card-title h4 {
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin: 0;
          line-height: 1.3;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .event-time {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          background: rgba(255, 255, 255, 0.03);
          padding: 8px 12px;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .event-time i {
          font-size: 14px;
          color: #3b82f6;
        }

        .event-description {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          padding: 12px;
          border-radius: 8px;
          border-left: 3px solid #10b981;
        }

        .event-description i {
          font-size: 14px;
          color: #10b981;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .event-description p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }

        .event-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .event-type-badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .no-events-message {
          text-align: center;
          padding: 40px 20px;
          color: rgba(255, 255, 255, 0.8);
        }

        .no-events-icon {
          margin-bottom: 20px;
        }

        .no-events-icon i {
          font-size: 48px;
          color: rgba(255, 255, 255, 0.3);
        }

        .no-events-message h4 {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin: 0 0 12px 0;
        }

        .no-events-message p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .add-event-suggestion {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 auto;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .add-event-suggestion:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .add-event-suggestion i {
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .modal-content {
            margin: 10px;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};

export default EventSchedule;
