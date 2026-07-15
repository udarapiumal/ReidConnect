import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [featuredEventIds, setFeaturedEventIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 6;

  // Fetch all events on mount
  useEffect(() => {
    fetchEvents();
    fetchFeaturedEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://35.209.196.254:8080/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchFeaturedEvents = async () => {
    try {
      const response = await fetch('http://35.209.196.254:8080/api/events/featured');
      const data = await response.json();
      const ids = new Set(data.map(event => event.id));
      setFeaturedEventIds(ids);
    } catch (error) {
      console.error('Error fetching featured events:', error);
    }
  };

  // Filter and sort events
  let processedEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort by date
  processedEvents = processedEvents.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Pagination
  const totalPages = Math.ceil(processedEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const filteredEvents = processedEvents.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleFeature = (eventId) => {
    if (featuredEventIds.has(eventId)) {
      setFeaturedEventIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    } else {
      setFeaturedEventIds(prev => new Set([...prev, eventId]));
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
      </header>

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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />
            </div>
            <div className="sort-controls">
              <label htmlFor="sort" style={{ color: '#a1a1a1', marginRight: '0.5rem' }}>
                Sort by Date:
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1);
                }}
                className="sort-select"
              >
                <option value="asc">Earliest First</option>
                <option value="desc">Latest First</option>
              </select>
            </div>
          </div>
        </header>

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
                onClick={() => setSelectedEvent(event)}
              >
                <img
                  src={`http://35.209.196.254:8080/${event.imagePath}`}
                  alt={event.name}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-info">
                  <h3>{event.name}</h3>
                  <p className="gallery-date">📅 {event.date}</p>
                  <p className="gallery-category">{event.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>

          <button
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedEvent(null)}
            >
              <X size={24} />
            </button>

            <img
              src={selectedEvent.imagePath}
              alt={selectedEvent.name}
              className="modal-image"
            />

            <div className="modal-info">
              <h2>{selectedEvent.name}</h2>
              
              <div className="event-details">
                <div className="detail-item">
                  <span className="detail-label">📅 Date:</span>
                  <span className="detail-value">{selectedEvent.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📍 Venue:</span>
                  <span className="detail-value">{selectedEvent.venueName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">🏢 Club:</span>
                  <span className="detail-value">{selectedEvent.clubName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">📂 Category:</span>
                  <span className="category-badge">{selectedEvent.category}</span>
                </div>
              </div>

              <div className="description-section">
                <h3>Description</h3>
                <p>{selectedEvent.description}</p>
              </div>

              <button
                className={`feature-btn-modal ${featuredEventIds.has(selectedEvent.id) ? 'featured' : ''}`}
                onClick={() => handleToggleFeature(selectedEvent.id)}
              >
                {featuredEventIds.has(selectedEvent.id) ? '⭐ Unfeature This Event' : '🌟 Feature This Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .main-content {
          margin-left: 200px;
          padding: 2rem;
          min-height: 100vh;
          background-color: #1a1c1e;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          color: #ffffff;
        }

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
          margin-top: 0.5rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background-color: #151718;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid #333;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: rgba(0, 0, 0, 0.5);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: background-color 0.2s ease;
        }

        .close-btn:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }

        .modal-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-bottom: 1px solid #333;
        }

        .modal-info {
          padding: 2rem;
        }

        .modal-info h2 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: #ffffff;
        }

        .event-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #333;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-label {
          color: #a1a1a1;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .detail-value {
          color: #ffffff;
          font-size: 0.95rem;
        }

        .category-badge {
          background-color: #ef4444;
          color: white;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          width: fit-content;
          text-transform: capitalize;
        }

        .description-section {
          margin-bottom: 2rem;
        }

        .description-section h3 {
          color: #ffffff;
          margin-bottom: 0.75rem;
          font-size: 1.1rem;
        }

        .description-section p {
          color: #a1a1a1;
          line-height: 1.6;
          margin: 0;
        }

        .feature-btn-modal {
          width: 100%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
        }

        .feature-btn-modal:hover {
          opacity: 0.9;
        }

        .feature-btn-modal.featured {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sort-controls label {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .sort-select {
          padding: 0.75rem 1rem;
          border: 1px solid #333;
          border-radius: 8px;
          font-size: 0.95rem;
          background-color: #2a2a2a;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23a1a1a1' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          padding-right: 2.5rem;
        }

        .sort-select option {
          background-color: #2a2a2a;
          color: #ffffff;
          padding: 0.5rem;
        }

        .sort-select option:hover {
          background-color: #3a3a3a;
        }

        .sort-select:hover {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .sort-select:focus {
          outline: none;
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
        }

        .pagination-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background-color: #151718;
          border-radius: 8px;
          margin-top: 2rem;
          border: 1px solid #333;
        }

        .pagination-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          color: #a1a1a1;
          font-weight: 600;
          font-size: 1rem;
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

          .modal-content {
            width: 95%;
            max-height: 95vh;
          }

          .event-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EventsPage;