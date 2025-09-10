import React, { useState, useEffect } from 'react';
import AcademicSidebar from './AcademicSidebar';
import Header from './components/Header';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance'; 
import { getCurrentUserRole, getCurrentUserId } from '../../utils/auth';
import './styles/EventSchedule.css';

const EventSchedule = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All events");
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(6); // July = 6 (0-indexed)
  const [showEventViewModal, setShowEventViewModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [activeNavItem, setActiveNavItem] = useState("Events");
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = `${months[currentMonthIndex]} ${currentYear}`;
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDate();

  const user_id = getCurrentUserId();
  
  // Time slots mapping
  const TIME_SLOTS = [
    { id: 1, time: '08:00', label: '8:00 AM' },
    { id: 2, time: '08:30', label: '8:30 AM' },
    { id: 3, time: '09:00', label: '9:00 AM' },
    { id: 4, time: '09:30', label: '9:30 AM' },
    { id: 5, time: '10:00', label: '10:00 AM' },
    { id: 6, time: '10:30', label: '10:30 AM' },
    { id: 7, time: '11:00', label: '11:00 AM' },
    { id: 8, time: '11:30', label: '11:30 AM' },
    { id: 9, time: '12:00', label: '12:00 PM' },
    { id: 10, time: '12:30', label: '12:30 PM' },
    { id: 11, time: '13:00', label: '1:00 PM' },
    { id: 12, time: '13:30', label: '1:30 PM' },
    { id: 13, time: '14:00', label: '2:00 PM' },
    { id: 14, time: '14:30', label: '2:30 PM' },
    { id: 15, time: '15:00', label: '3:00 PM' },
    { id: 16, time: '15:30', label: '3:30 PM' },
    { id: 17, time: '16:00', label: '4:00 PM' },
    { id: 18, time: '16:30', label: '4:30 PM' },
    { id: 19, time: '17:00', label: '5:00 PM' },
    { id: 20, time: '17:30', label: '5:30 PM' },
  ];

  const showNotification = (message, type = 'info') => {
    // Create a simple notification system
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#059669' : '#2563eb'};
      color: white;
      border-radius: 8px;
      z-index: 10000;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 4000);
  };

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
  };

  // Data fetching
  useEffect(() => {
    fetchEvents();
  }, [currentYear, currentMonthIndex]);

  const fetchEvents = async () => {
    try {   
      const response = await axiosInstance.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showNotification('Failed to load events', 'error');
    } finally {
    }
  };

  // Calendar navigation
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

  const handleDateClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
    setShowEventViewModal(true);
  };

  const handleCloseEventViewModal = () => {
    setShowEventViewModal(false);
    setSelectedDate(null);
  };

  // Utility functions for calendar display
  const getEventsForSelectedDate = (day) => {
    const targetDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === targetDate);
  };

  const getEventTypeColor = (category) => {
    const colors = {
      SPORTS: '#10b981',
      MUSIC: '#8b5cf6',
      WELLNESS: '#f59e0b',
      COMPETITION: '#ef4444',
      OTHER: '#6b7280'
    };
    return colors[category] || colors.OTHER;
  };

  return (
    <div className="event-schedule-container">
      <Header />

      <div className="event-schedule-content">
        <AcademicSidebar 
          activeItem={activeNavItem} 
          onNavigate={handleNavigation}
        />

        <main className="event-schedule-main">
          <h2 className="page-title">Event Calendar</h2>

          <div className="calendar-container">
            <div className="calendar-controls">
              <div className="calendar-filters">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option>All events</option>
                  <option>Upcoming events</option>
                  <option>My events</option>
                </select>
              </div>

              <div className="month-navigation">
                <button onClick={navigatePrevMonth} className="nav-button" type="button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </button>
                <div className="current-month-display">
                  <h2>{currentMonth}</h2>
                </div>
                <button onClick={navigateNextMonth} className="nav-button" type="button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="calendar-main">
              <div className="weekdays-grid">
                {daysOfWeek.map(day => (
                  <div key={day} className="weekday">{day}</div>
                ))}
              </div>

              <div className="calendar-grid">
                {calendarDays.map((day, index) => {
                  const eventsForDay = day ? getEventsForSelectedDate(day) : [];
                  const isToday = day === today && 
                    currentMonthIndex === new Date().getMonth() && 
                    currentYear === new Date().getFullYear();
                  
                  return (
                    <div 
                      key={index} 
                      className={`calendar-day ${day ? "has-day" : "empty"} ${isToday ? "today" : ""} ${eventsForDay.length > 0 ? "has-events" : ""}`}
                      onClick={() => handleDateClick(day)}
                      style={{ cursor: day ? 'pointer' : 'default' }}
                    >
                      {day && (
                        <>
                          <div className="day-header">
                            <span className="day-number">{day}</span>
                            {isToday && <span className="today-badge">Today</span>}
                          </div>
                          
                          {eventsForDay.length > 0 && (
                            <div className="day-events">
                              {eventsForDay.slice(0, 3).map((event, idx) => (
                                <div 
                                  key={idx} 
                                  className="event-preview"
                                  style={{ borderLeftColor: getEventTypeColor(event.category) }}
                                >
                                  <div className="event-time">
                                    {event.slotIds?.length > 0 && 
                                      TIME_SLOTS.find(slot => slot.id === event.slotIds[0])?.label?.split(' ')[0]
                                    }
                                  </div>
                                  <div className="event-title-preview">
                                    {event.name.length > 20 ? event.name.substring(0, 20) + '...' : event.name}
                                  </div>
                                </div>
                              ))}
                              {eventsForDay.length > 3 && (
                                <div className="more-events-indicator">
                                  +{eventsForDay.length - 3} more
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="calendar-footer">
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                  <span>Sports</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
                  <span>Music</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                  <span>Wellness</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                  <span>Competition</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#6b7280' }}></div>
                  <span>Other</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* View-Only Event Modal */}
      {showEventViewModal && (
        <div className="modal-overlay" onClick={handleCloseEventViewModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <h3>Events for {months[currentMonthIndex]} {selectedDate}, {currentYear}</h3>
              </div>
              <button className="close-button" onClick={handleCloseEventViewModal} type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                </svg>
              </button>
            </div>
            
            <div className="event-view-content">
              {getEventsForSelectedDate(selectedDate).length > 0 ? (
                <div className="events-list-view">
                  {getEventsForSelectedDate(selectedDate).map((event, index) => (
                    <div key={index} className="event-card">
                      <div className="event-card-header">
                        <div className="event-card-title">
                          <div 
                            className="event-type-indicator" 
                            style={{ backgroundColor: getEventTypeColor(event.category) }}
                          ></div>
                          <div className="event-title-content">
                            <h4>{event.name}</h4>
                            <span className="event-category-label">{event.category}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="event-details">
                        <div className="event-info-grid">
                          <div className="event-info-row">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <div className="info-content">
                              <span className="info-label">Organized by</span>
                              <span className="info-value">{event.club?.name || 'Unknown Club'}</span>
                            </div>
                          </div>
                          
                          <div className="event-info-row">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                            <div className="info-content">
                              <span className="info-label">Venue</span>
                              <span className="info-value">{event.venueName || event.venue || 'Venue TBD'}</span>
                            </div>
                          </div>
                          
                          <div className="event-info-row">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
                            </svg>
                            <div className="info-content">
                              <span className="info-label">Time</span>
                              <span className="info-value">
                                {event.slotIds?.map(slotId => {
                                  const slot = TIME_SLOTS.find(s => s.id === slotId);
                                  return slot?.label;
                                }).filter(Boolean).join(', ') || 'Time TBD'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="event-info-row">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <div className="info-content">
                              <span className="info-label">Target Audience</span>
                              <span className="info-value">
                                {event.targetFaculties?.join(', ') || 'All Faculties'} • {event.targetYears?.map(year => year.replace('_', ' ')).join(', ') || 'All Years'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {event.description && (
                          <div className="event-description">
                            <h5>Description</h5>
                            <p>{event.description}</p>
                          </div>
                        )}

                        {event.imageUrl && (
                          <div className="event-image">
                            <h5>Event Image</h5>
                            <img 
                              src={`http://localhost:8080/${event.imageUrl}`} 
                              alt={event.name}
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-events-message">
                  <div className="no-events-illustration">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                  </div>
                  <div className="no-events-content">
                    <h4>No Events Scheduled</h4>
                    <p>There are no events scheduled for {months[currentMonthIndex]} {selectedDate}, {currentYear}.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSchedule;