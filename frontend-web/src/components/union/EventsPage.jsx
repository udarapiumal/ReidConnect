import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
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
    <div className="app-container">
      <header style={{
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
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0px',
        }}>
          <span style={{
            fontWeight: 700,
            fontSize: '22px',
            color: 'white',
            letterSpacing: '-0.02em',
          }}>ReidConnect</span>
          <span style={{
            fontWeight: 700,
            fontSize: '22px',
            color: '#FF0033',
            background: 'linear-gradient(135deg, #FF0033 0%, #ea580c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginLeft: '0px',
          }}>UnionAdmin</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          color: 'rgba(255,255,255,0.8)',
        }}>
        </div>
      </header>
      {/* Main Content */}
      <main className="main-content" style={{ marginTop: '70px' }}>
        <header className="gallery-header">
          <div className="header-text">
            <h1>Search Events</h1>
            <p>Browse through recent events</p>
          </div>

          <div className="controls">
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </header>

        {/* Events grid */}
        {filteredEvents.length === 0 ? (
          <div className="no-results">
            <h3>No events found</h3>
            <p>Try changing your search.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="gallery-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 6px 12px rgb(239 68 68 / 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgb(0 0 0 / 0.25)';
                }}
              >
                <img
                  src={`http://localhost:8080/${event.imagePath}`}
                  alt={event.name}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-info">
                  <h3>{event.name}</h3>
                  <p className="gallery-description">{event.description}</p>
                  <p className="gallery-date">📅 {event.date}</p>
                  <p className="gallery-category">{event.category}</p>
                  <button
                    className="feature-btn"
                    onClick={() => handleFeatureEvent(event.id)}
                  >
                    🌟 Feature
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        /* Main content - Dark Theme */
        .main-content {
          margin-left: 200px;
          padding: 2rem;
          min-height: 100vh;
          background-color: #1a1c1e;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #ffffff;
        }

        /* Gallery header */
        .gallery-header {
          background: #151718;
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #333;
        }

        .header-text h1 {
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .header-text p {
          color: #a1a1a1;
          margin-bottom: 2rem;
        }

        .controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-bar {
          position: relative;
          flex: 1;
          max-width: 600px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a1a1a1;
          z-index: 2;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border: 1px solid #333;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: border-color 0.2s ease;
          background-color: #2a2a2a;
          color: #ffffff;
        }

        .search-input:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
        }

        /* No results message */
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: #151718;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #333;
        }

        .no-results h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .no-results p {
          color: #a1a1a1;
        }

        /* Gallery grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .gallery-card {
          background-color: #151718;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgb(0 0 0 / 0.25);
          cursor: pointer;
          transition: transform 0.2s ease;
          border: 1px solid #333;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgb(239 68 68 / 0.5);
        }

        .gallery-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-bottom: 1px solid #333;
          flex-shrink: 0;
        }

        .gallery-info {
          padding: 1rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .gallery-info h3 {
          color: #ffffff;
          margin: 0 0 0.25rem;
          font-size: 1.1rem;
        }

        .gallery-description {
          color: #a1a1a1;
          margin: 0.5rem 0;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .gallery-date {
          color: #888;
          font-size: 0.85rem;
          margin: 0.25rem 0;
        }

        .gallery-category {
          background-color: #ef4444;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          width: fit-content;
          text-transform: capitalize;
          margin-bottom: 0.5rem;
        }

        .feature-btn {
          background-color: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-weight: 500;
          margin-top: auto;
        }

        .feature-btn:hover {
          background-color: #5855eb;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .controls {
            flex-direction: column;
            align-items: stretch;
          }

          .search-bar,
          .search-input {
            width: 100%;
            max-width: none;
          }

          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }
        }
      `}</style>
    </div>
  );
};

export default EventsPage;
