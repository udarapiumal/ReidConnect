// src/components/EventCard.jsx
import React from 'react';
import '../../css/EventCard.css'; // Create this file for styling

const EventCard = ({ event }) => {
  const { name, description, date, imagePath, venueName } = event;
  const baseUrl = 'http://localhost:8080/';

  return (
    <div className="event-card">
      <img
        src={`${baseUrl}${imagePath}`}
        alt={name}
        className="event-card-image"
      />
      <div className="event-card-content">
        <h3 className="event-card-title">{name}</h3>
        <p className="event-card-date">📅 {date}</p>
        {venueName && <p className="event-card-venue">📍 {venueName}</p>}
        <p className="event-card-description">{description}</p>
      </div>
    </div>
  );
};

export default EventCard;
