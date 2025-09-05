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
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showEventViewModal, setShowEventViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState('');
  const [targetYears, setTargetYears] = useState([]);
  const [targetFaculties, setTargetFaculties] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [activeNavItem, setActiveNavItem] = useState("Events");
  
  // New state for enhanced date/time selection and clash detection
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [conflictEvents, setConflictEvents] = useState([]);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [currentConflict, setCurrentConflict] = useState(null);
  const [selectedSlotForConflict, setSelectedSlotForConflict] = useState(null);
  const [calendarView, setCalendarView] = useState('month'); // 'month' or 'day'
  const [tempSelectedDate, setTempSelectedDate] = useState(null);
  const [tempSelectedTimeSlots, setTempSelectedTimeSlots] = useState([]);
  
  // Form state for new/edit event
  const [eventForm, setEventForm] = useState({
    clubId: clubId,
    name: '',
    description: '',
    venueId: '',
    venueName: '',
    date: '',
    slotIds: [],
    targetYears: [],
    targetFaculties: [],
    category: '',
    image: null
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = `${months[currentMonthIndex]} ${currentYear}`;
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDate();

  // Enums from backend
  const FACULTIES = ["UCSC", "FOS", "FOT"];
  const YEARS = ["YEAR_1", "YEAR_2", "YEAR_3", "YEAR_4"];
  const CATEGORIES = ['SPORTS', 'MUSIC', 'WELLNESS', 'COMPETITION', 'OTHER'];
  const user_id = getCurrentUserId();
  
  // Time slots mapping (from mobile code reference)
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

  const SLOT_ID_TO_TIME_MAPPING = {
    1: '08:00', 2: '08:30', 3: '09:00', 4: '09:30', 5: '10:00',
    6: '10:30', 7: '11:00', 8: '11:30', 9: '12:00', 10: '12:30',
    11: '13:00', 12: '13:30', 13: '14:00', 14: '14:30', 15: '15:00',
    16: '15:30', 17: '16:00', 18: '16:30', 19: '17:00', 20: '17:30',
  };

  // Enhanced date formatting function
  const formatDateForComparison = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fetch conflict events based on target audience
  const fetchConflictEvents = async (targetYears, targetFaculties) => {
    if (!targetYears.length || !targetFaculties.length) {
      setConflictEvents([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/events/conflicts', {
        params: {
          faculties: targetFaculties,
          years: targetYears,
        },
        paramsSerializer: params => {
          const result = new URLSearchParams();
          if (params.faculties) {
            params.faculties.forEach(f => result.append('faculties', f));
          }
          if (params.years) {
            params.years.forEach(y => result.append('years', y));
          }
          return result.toString();
        }
      });
      setConflictEvents(response.data);
    } catch (error) {
      console.error('Error fetching conflict events:', error);
      setConflictEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Get conflict events for a specific date (for conflict detection)
  const getConflictEventsForDate = (date) => {
    const dateStr = formatDateForComparison(date);
    return conflictEvents.filter(event => event.date === dateStr);
  };

  // Get conflict events for a specific time slot
  const getConflictEventsForTimeSlot = (date, timeSlot) => {
    const dateStr = formatDateForComparison(date);
    
    return conflictEvents.filter(event => {
      if (event.date !== dateStr) return false;
      
      if (!event.slotIds || !Array.isArray(event.slotIds)) return false;

      const eventTimeSlots = event.slotIds
        .map(slotId => SLOT_ID_TO_TIME_MAPPING[slotId])
        .filter(Boolean);
      
      return eventTimeSlots.includes(timeSlot);
    });
  };

  // Handle time slot selection with conflict detection
  const handleTimeSlotPress = (timeSlot) => {
    if (!tempSelectedDate) return;

    const conflictingEvents = getConflictEventsForTimeSlot(tempSelectedDate, timeSlot);
    
    if (conflictingEvents.length > 0) {
      setCurrentConflict({
        timeSlot,
        events: conflictingEvents
      });
      setSelectedSlotForConflict(timeSlot);
      setShowConflictModal(true);
    } else {
      toggleTimeSlot(timeSlot);
    }
  };

  // Toggle time slot selection
  const toggleTimeSlot = (timeSlot) => {
    setTempSelectedTimeSlots(prev => {
      if (prev.includes(timeSlot)) {
        return prev.filter(slot => slot !== timeSlot);
      } else {
        return [...prev, timeSlot];
      }
    });
  };
  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
  };

  // Handle conflict override
  const handleConflictOverride = () => {
    if (selectedSlotForConflict) {
      toggleTimeSlot(selectedSlotForConflict);
    }
    setShowConflictModal(false);
    setSelectedSlotForConflict(null);
  };

  // Convert time slots to slot IDs
  const getSlotIdsFromTimes = (timeSlots) => {
    const timeToId = Object.entries(SLOT_ID_TO_TIME_MAPPING).reduce((acc, [id, time]) => {
      acc[time] = parseInt(id);
      return acc;
    }, {});
    return timeSlots.map(time => timeToId[time]).filter(Boolean);
  };

  // Fetch initial data
  useEffect(() => {
    fetchEvents();
    fetchVenues();
    fetchClubId();
  }, [currentYear, currentMonthIndex]);

  // Fetch conflict events when target audience changes
  useEffect(() => {
    if (eventForm.targetYears.length && eventForm.targetFaculties.length) {
      fetchConflictEvents(eventForm.targetYears, eventForm.targetFaculties);
    }
  }, [eventForm.targetYears, eventForm.targetFaculties]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubId = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/club/by-user/${user_id}`);
      setClubId(response.data.id);
    } catch (error) {
      console.error('Error fetching clubId:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await axiosInstance.get('/api/venues');
      setVenues(response.data);
    } catch (error) {
      console.error('Error fetching venues:', error);
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

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const days = Array(adjustedFirstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Modal handlers
  const handleNewEventClick = () => {
    resetForm();
    setShowNewEventModal(true);
  };

  const handleDateTimeSelect = () => {
    if (!eventForm.targetYears.length || !eventForm.targetFaculties.length) {
      alert('Please select target years and faculties first');
      return;
    }
    setTempSelectedDate(null);
    setTempSelectedTimeSlots([]);
    setCalendarView('month');
    setShowDateTimeModal(true);
  };

  const handleConfirmDateTime = () => {
    if (!tempSelectedDate || !tempSelectedTimeSlots.length) {
      alert('Please select a date and at least one time slot');
      return;
    }
    
    setEventForm(prev => ({
      ...prev,
      date: formatDateForComparison(tempSelectedDate),
      slotIds: getSlotIdsFromTimes(tempSelectedTimeSlots)
    }));
    
    setShowDateTimeModal(false);
    setTempSelectedDate(null);
    setTempSelectedTimeSlots([]);
  };

  const resetForm = () => {
    setEventForm({
      clubId: clubId,
      name: '',
      description: '',
      venueId: '',
      venueName: '',
      date: '',
      slotIds: [],
      targetYears: [],
      targetFaculties: [],
      category: '',
      image: null
    });
    setTempSelectedDate(null);
    setTempSelectedTimeSlots([]);
  };

  const handleCloseModal = () => {
    setShowNewEventModal(false);
    setShowEditModal(false);
    setShowDateTimeModal(false);
    setShowConflictModal(false);
    resetForm();
    setSelectedEvent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setEventForm(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleArrayChange = (name, value) => {
    setEventForm(prev => ({
      ...prev,
      [name]: prev[name].includes(value) 
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  // Rest of your existing functions (handleSubmit, handleUpdate, etc.)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventForm.name || !eventForm.date || !eventForm.slotIds.length || 
        !eventForm.targetYears.length || !eventForm.targetFaculties.length ||
        !eventForm.category ) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('clubId', clubId);
      formData.append('name', eventForm.name);
      formData.append('description', eventForm.description);
      formData.append('date', eventForm.date);
      formData.append('category', eventForm.category);

      if (eventForm.venueId) {
        formData.append('venueId', eventForm.venueId);
      }
      if (eventForm.venueName) {
        formData.append('venueName', eventForm.venueName);
      }

      formData.append('slotIds', JSON.stringify(eventForm.slotIds));
      formData.append('targetYears', JSON.stringify(eventForm.targetYears));
      formData.append('targetFaculties', JSON.stringify(eventForm.targetFaculties));

      if (eventForm.image) {
        formData.append('image', eventForm.image);
      }

      const response = await axiosInstance.post('/api/events/web', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Event created successfully:', response.data);
      fetchEvents();
      handleCloseModal();
      alert('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedEvent) return;

    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', eventForm.name);
      formData.append('description', eventForm.description);
      formData.append('date', eventForm.date);
      formData.append('category', eventForm.category);
      
      if (eventForm.venueId) {
        formData.append('venueId', eventForm.venueId);
      }
      if (eventForm.venueName) {
        formData.append('venueName', eventForm.venueName);
      }
      
      formData.append('slotIds', JSON.stringify(eventForm.slotIds));
      formData.append('targetYears', JSON.stringify(eventForm.targetYears));
      formData.append('targetFaculties', JSON.stringify(eventForm.targetFaculties));
      
      if (eventForm.image) {
        formData.append('image', eventForm.image);
      }

      const response = await axiosInstance.put(`/api/events/web/${selectedEvent.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Event updated successfully:', response.data);
      fetchEvents();
      handleCloseModal();
      alert('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axiosInstance.delete(`/api/events/${eventId}`);
      fetchEvents();
      setShowEventViewModal(false);
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event: ' + (error.response?.data || error.message));
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEventForm({
      clubId: clubId,
      name: event.name || '',
      description: event.description || '',
      venueId: event.venueId || '',
      venueName: event.venueName || event.venue || '',
      date: event.date || '',
      slotIds: event.slotIds || [],
      targetYears: event.targetYears || [],
      targetFaculties: event.targetFaculties || [],
      category: event.category || '',
      image: null
    });
    setShowEditModal(true);
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

  // Get events for a specific date (for calendar display)
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

  // Render enhanced calendar for date/time selection
  const renderEnhancedCalendar = () => {
    if (calendarView === 'day') {
      return renderDayView();
    }

    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const today = new Date();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonthIndex, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = tempSelectedDate && date.toDateString() === tempSelectedDate.toDateString();
      const isPast = date < today;
      
      const eventsForDay = getConflictEventsForDate(date);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day enhanced ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${isPast ? "past" : ""} ${eventsForDay.length > 0 ? "has-events" : ""}`}
          onClick={() => {
            if (!isPast) {
              setTempSelectedDate(date);
              setCalendarView('day');
            }
          }}
          style={{ cursor: isPast ? 'not-allowed' : 'pointer' }}
        >
          <div className="day-number">{day}</div>
          {eventsForDay.length > 0 && (
            <div className="day-events">
              {eventsForDay.slice(0, 2).map((event, index) => (
                <div key={index} className="day-event" style={{ backgroundColor: getEventTypeColor(event.category) }}>
                  <span className="event-name">{event.name.substring(0, 15)}{event.name.length > 15 ? '...' : ''}</span>
                </div>
              ))}
              {eventsForDay.length > 2 && (
                <div className="more-events">+{eventsForDay.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="enhanced-calendar">
        <div className="calendar-header">
          <button onClick={navigatePrevMonth} className="nav-button">◀</button>
          <span className="current-month">{currentMonth}</span>
          <button onClick={navigateNextMonth} className="nav-button">▶</button>
        </div>
        <div className="weekdays-grid">
          {daysOfWeek.map(day => <div key={day} className="weekday">{day}</div>)}
        </div>
        <div className="calendar-grid enhanced">
          {days}
        </div>
      </div>
    );
  };

  // Render day view with time slots
  const renderDayView = () => {
    if (!tempSelectedDate) return null;
    
    return (
      <div className="day-view">
        <div className="day-view-header">
          <button 
            className="back-to-calendar" 
            onClick={() => setCalendarView('month')}
          >
            ← Back to Calendar
          </button>
          <h3>{tempSelectedDate.toDateString()}</h3>
        </div>
        
        <div className="time-slots-container">
          {TIME_SLOTS.map(({ id, time, label }) => {
            const eventsForSlot = getConflictEventsForTimeSlot(tempSelectedDate, time);
            const isSelected = tempSelectedTimeSlots.includes(time);
            const hasConflict = eventsForSlot.length > 0;
            
            return (
              <div 
                key={id} 
                className={`time-slot ${isSelected ? 'selected' : ''} ${hasConflict ? 'conflict' : ''}`}
                onClick={() => handleTimeSlotPress(time)}
              >
                <div className="time-label">{label}</div>
                <div className="slot-content">
                  {eventsForSlot.length > 0 ? (
                    <div className="existing-events">
                      {eventsForSlot.map((event, index) => (
                        <div key={index} className="existing-event">
                          <div className="event-name">{event.name}</div>
                          <div className="event-details">
                            {event.targetFaculties.join(', ')} • {event.targetYears.join(', ')}
                          </div>
                          <div className="event-venue">{event.venue || event.venueName}</div>
                        </div>
                      ))}
                      {hasConflict && <div className="conflict-warning">⚠ Conflict Detected</div>}
                    </div>
                  ) : (
                    <div className="free-slot">Free</div>
                  )}
                  
                  {isSelected && (
                    <div className="new-event-indicator">Selected for new event</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEventForm = (isEdit = false) => (
    <form onSubmit={isEdit ? handleUpdate : handleSubmit} className="event-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={eventForm.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Event Title *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={eventForm.name}
            onChange={handleInputChange}
            placeholder="Enter event title"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={eventForm.description}
          onChange={handleInputChange}
          placeholder="Enter event description"
          rows="4"
        ></textarea>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="venueId">Select Venue</label>
          <select
            id="venueId"
            name="venueId"
            value={eventForm.venueId}
            onChange={handleInputChange}
          >
            <option value="">Select from existing venues</option>
            {venues.map(venue => (
              <option key={venue.id} value={venue.id}>
                {venue.name} ({venue.faculty}) - Cap: {venue.capacity}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="venueName">Or Enter Custom Venue</label>
          <input
            type="text"
            id="venueName"
            name="venueName"
            value={eventForm.venueName}
            onChange={handleInputChange}
            placeholder="Enter custom venue name"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Target Faculties *</label>
          <div className="checkbox-group">
            {FACULTIES.map(faculty => (
              <label key={faculty} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={eventForm.targetFaculties.includes(faculty)}
                  onChange={() => handleArrayChange('targetFaculties', faculty)}
                />
                <span>{faculty}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Target Years *</label>
          <div className="checkbox-group">
            {YEARS.map(year => (
              <label key={year} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={eventForm.targetYears.includes(year)}
                  onChange={() => handleArrayChange('targetYears', year)}
                />
                <span>{year.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Date & Time *</label>
        <button 
          type="button" 
          className="date-time-selector"
          onClick={handleDateTimeSelect}
        >
          {eventForm.date && eventForm.slotIds.length ? (
            <span>
              {new Date(eventForm.date).toDateString()} - 
              {eventForm.slotIds.map(slotId => {
                const slot = TIME_SLOTS.find(s => s.id === slotId);
                return slot?.label;
              }).filter(Boolean).join(', ')}
            </span>
          ) : (
            <span>Select Date & Time</span>
          )}
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="image">Event Image {!isEdit && '*'}</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          required={!isEdit}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={handleCloseModal}>
          Cancel
        </button>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Processing...' : (isEdit ? 'Update Event' : 'Create Event')}
        </button>
      </div>
    </form>
  );

  return (
    <div className="course-management">
      <Header />

      <div className="layout">
        <AcademicSidebar 
          activeItem={activeNavItem} 
          onNavigate={handleNavigation}
        />
        <main className="main-content">
          <h1>Calendar</h1>

          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <span>Loading...</span>
            </div>
          )}

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
                {calendarDays.map((day, index) => {
                  const eventsForDay = day ? getEventsForSelectedDate(day) : [];
                  return (
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
                          {eventsForDay.length > 0 && (
                            <div className="events-list">
                              {eventsForDay.map((event, idx) => (
                                <div key={idx} className="event-item">
                                  <span 
                                    className="event-dot" 
                                    style={{ backgroundColor: getEventTypeColor(event.category) }}
                                  />
                                  <span className="event-title">
                                    {event.name.length > 15 ? event.name.substring(0, 15) + '...' : event.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
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
            {renderEventForm(false)}
          </div>
        </div>
      )}

      {/* Enhanced Date & Time Selection Modal */}
      {showDateTimeModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Date & Time</h3>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="date-time-modal-content">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <span>Loading conflict events...</span>
                </div>
              ) : (
                renderEnhancedCalendar()
              )}
              
              {tempSelectedDate && tempSelectedTimeSlots.length > 0 && (
                <div className="selected-summary">
                  <h4>Selected:</h4>
                  <p><strong>Date:</strong> {tempSelectedDate.toDateString()}</p>
                  <p><strong>Time Slots:</strong> {
                    tempSelectedTimeSlots.map(time => 
                      TIME_SLOTS.find(slot => slot.time === time)?.label
                    ).join(', ')
                  }</p>
                </div>
              )}
              
              <div className="date-time-actions">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="confirm-button" 
                  onClick={handleConfirmDateTime}
                  disabled={!tempSelectedDate || !tempSelectedTimeSlots.length}
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Detection Modal */}
      {showConflictModal && currentConflict && (
        <div className="modal-overlay" onClick={() => setShowConflictModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header conflict">
              <div className="conflict-icon">⚠</div>
              <h3>Schedule Conflict Detected</h3>
              <button className="close-button" onClick={() => setShowConflictModal(false)}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            
            <div className="conflict-details">
              <p>The selected time slot <strong>
                {TIME_SLOTS.find(t => t.time === currentConflict.timeSlot)?.label}
              </strong> conflicts with the following events:</p>
              
              <div className="conflicting-events">
                {currentConflict.events.map((event, index) => (
                  <div key={index} className="conflict-event">
                    <h4>{event.name}</h4>
                    <div className="conflict-event-details">
                      <div><strong>Faculties:</strong> {event.targetFaculties.join(", ")}</div>
                      <div><strong>Years:</strong> {event.targetYears.join(", ")}</div>
                      <div><strong>Venue:</strong> {event.venue || event.venueName}</div>
                      <div><strong>Club:</strong> {event.club?.name || 'Unknown'}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="conflict-warning">
                <strong>Warning:</strong> Scheduling at this time may cause conflicts for students 
                who are in the target audience of both events.
              </div>
            </div>
            
            <div className="conflict-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => setShowConflictModal(false)}
              >
                Choose Different Time
              </button>
              <button 
                type="button" 
                className="override-button" 
                onClick={handleConflictOverride}
              >
                Schedule Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Event</h3>
              <button className="close-button" onClick={handleCloseModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            {renderEventForm(true)}
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
              {getEventsForSelectedDate(selectedDate).length > 0 ? (
                <div className="events-list-view">
                  {getEventsForSelectedDate(selectedDate).map((event, index) => (
                    <div key={index} className="event-card">
                      <div className="event-card-header">
                        <div className="event-card-title">
                          <span 
                            className="event-type-indicator" 
                            style={{ backgroundColor: getEventTypeColor(event.category) }}
                          ></span>
                          <h4>{event.name}</h4>
                        </div>
                        <div className="event-actions">
                          <button 
                            className="edit-button"
                            onClick={() => {
                              handleCloseEventViewModal();
                              handleEditEvent(event);
                            }}
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      
                      <div className="event-details">
                        <div className="event-info-row">
                          <i className="fa fa-building"></i>
                          <span>{event.club?.name || 'Unknown Club'}</span>
                        </div>
                        
                        <div className="event-info-row">
                          <i className="fa fa-map-marker-alt"></i>
                          <span>{event.venueName || event.venue || 'Venue TBD'}</span>
                        </div>
                        
                        <div className="event-info-row">
                          <i className="fa fa-clock"></i>
                          <span>
                            {event.slotIds?.map(slotId => {
                              const slot = TIME_SLOTS.find(s => s.id === slotId);
                              return slot?.label;
                            }).filter(Boolean).join(', ') || 'Time TBD'}
                          </span>
                        </div>
                        
                        <div className="event-info-row">
                          <i className="fa fa-users"></i>
                          <span>
                            {event.targetFaculties?.join(', ') || 'All Faculties'} • {event.targetYears?.map(year => year.replace('_', ' ')).join(', ') || 'All Years'}
                          </span>
                        </div>
                        
                        <div className="event-info-row">
                          <i className="fa fa-tag"></i>
                          <span>{event.category || 'Other'}</span>
                        </div>
                        
                        {event.description && (
                          <div className="event-description">
                            <i className="fa fa-align-left"></i>
                            <p>{event.description}</p>
                          </div>
                        )}

                        {event.imageUrl && (
                          <div className="event-image">
                            <img src={`http://localhost:8080/${event.imageUrl}`} alt={event.name} />
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
    </div>
  );
};

export default EventSchedule;