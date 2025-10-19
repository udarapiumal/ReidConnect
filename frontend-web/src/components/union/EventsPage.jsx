import React, { useEffect, useState } from 'react';
import axios from 'axios';


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
      const token = localStorage.getItem('token');
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
      {/* Header Bar copied from Dashboard.jsx */}
      <header style={styles.headerBar}>
        <div style={styles.headerLeft}>
          <span style={styles.reidConnect}>ReidConnect</span>
          <span style={styles.highlight}>UnionAdmin</span>
        </div>
        <div style={styles.adminInfo}>
        </div>
      </header>

      <div style={{ paddingTop: '90px' }}>
        <h2 style={styles.heading}>Events</h2>

        <input
          type="text"
          placeholder="Search by event name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBar}
          onFocus={(e) => e.target.style.borderColor = '#6366f1'}
          onBlur={(e) => e.target.style.borderColor = '#333'}
        />

        <div style={styles.cardContainer}>
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
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
                  style={styles.featureButton}
                  onClick={() => handleFeatureEvent(event.id)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#5855eb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
                >
                  🌟 Feature
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#1a1c1e',
    minHeight: '100vh',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    marginLeft: '200px',
  },
  headerBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '70px',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 24px',
    zIndex: 1200,
    background: 'rgba(20, 20, 20, 0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
  },
  reidConnect: {
    fontWeight: 700,
    fontSize: '22px',
    color: 'white',
    letterSpacing: '-0.02em',
  },
  highlight: {
    fontWeight: 700,
    fontSize: '22px',
    color: '#FF0033',
    background: 'linear-gradient(135deg, #FF0033 0%, #ea580c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginLeft: '0px',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    color: 'rgba(255,255,255,0.8)',
  },
  headerIcon: {
    fontSize: '18px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'color 0.3s',
    color: '#fff',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '2.5rem',
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: '1px',
  },
  searchBar: {
    padding: '0.75rem 1rem',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto 2rem auto',
    display: 'block',
    borderRadius: '12px',
    border: '1px solid #333',
    fontSize: '1rem',
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '16px',
    border: '1px solid #333',
    overflow: 'hidden',
    width: '300px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  content: {
    padding: '1.5rem',
  },
  title: {
    margin: '0 0 0.75rem 0',
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  description: {
    fontSize: '0.9rem',
    color: '#b3b3b3',
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  date: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '0.5rem',
  },
  category: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: '1rem',
  },
  featureButton: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: '500',
  },
};

export default EventsPage;