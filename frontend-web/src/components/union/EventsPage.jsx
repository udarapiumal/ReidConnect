import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Filter events by search term (by name or description)
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFeatureEvent = async (eventId) => {
  try {
    const token = localStorage.getItem('token'); // or sessionStorage, or from context
    const response = await axios.put(
      `http://localhost:8080/api/events/${eventId}/feature`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert('✅ Event featured successfully!');
    fetchEvents();
  } catch (error) {
    console.error('❌ Error featuring event:', error);
    alert('❌ Failed to feature event.');
  }
};



  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Events</h2>

      <input
        type="text"
        placeholder="Search by event name or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBar}
      />

      <div style={styles.cardContainer}>
       {filteredEvents.map((event) => (
  <div key={event.id} style={styles.card}>
    <img
      src={`http://localhost:8080/${event.imagePath}`}
      alt={event.name}
      style={styles.image}
    />
    <div style={styles.content}>
      <h3 style={styles.title}>{event.name}</h3>
      <p style={styles.description}>{event.description}</p>
      <p style={styles.date}>📅 {event.date}</p>
      <p style={styles.category}>📂 {event.category}</p>
      
      <button 
  className="feature-button" 
  onClick={() => handleFeatureEvent(event.id)}
>
  🌟 Feature
</button>
    </div>
  </div>
))}

      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  searchBar: {
    padding: '0.5rem',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto 2rem auto',
    display: 'block',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    width: '300px',
    transition: 'transform 0.2s ease',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem',
  },
  title: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  description: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '0.5rem',
  },
  date: {
    fontSize: '0.85rem',
    color: '#333',
  },
  category: {
    fontSize: '0.85rem',
    color: '#333',
  },
};

export default EventsPage;
