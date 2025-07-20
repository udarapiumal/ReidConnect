import React from 'react';
import '../../css/EventCard.css';

const EventCard = ({ event }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      fullDate: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  const formatTargetInfo = (targetYears, targetFaculties) => {
    const years = targetYears?.map(ty => ty.year) || [];
    const faculties = targetFaculties?.map(tf => tf.faculty) || [];
    
    const targets = [];
    if (years.length > 0) targets.push(`Years: ${years.join(', ')}`);
    if (faculties.length > 0) targets.push(`Faculties: ${faculties.join(', ')}`);
    
    return targets.length > 0 ? targets.join(' | ') : 'Open to all';
  };

  const dateInfo = formatDate(event.date);
  const isUpcoming = new Date(event.date) > new Date();

  return (
  <div className={`event-card ${isUpcoming ? 'upcoming' : 'past'}`}>
    <div className="event-image-container">
      <img
        src={event.imagePath || "/default-event.png"}
        alt={event.name}
        className="event-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-event.png";
        }}
      />

      <div className="event-date-badge">
        <span className="event-day">{dateInfo.day}</span>
        <span className="event-month">{dateInfo.month}</span>
      </div>

      <div className={`event-status-badge ${isUpcoming ? 'upcoming' : 'past'}`}>
        {isUpcoming ? 'Upcoming' : 'Past'}
      </div>
    </div>
  </div>
);
}
export default EventCard;