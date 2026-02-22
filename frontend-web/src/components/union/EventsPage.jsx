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

  useEffect(() => {
    fetchEvents();
    fetchFeaturedEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchFeaturedEvents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/events/featured');
      const data = await response.json();
      const ids = new Set(data.map(event => event.id));
      setFeaturedEventIds(ids);
    } catch (error) {
      console.error('Error fetching featured events:', error);
    }
  };

  let processedEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  processedEvents = processedEvents.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

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
      <header className="ev-header-bar">
        <div className="ev-header-left">
          <span className="ev-title">ReidConnect</span>
          <span className="ev-title ev-highlight">UnionAdmin</span>
        </div>
      </header>

      <main className="ev-main-content">
        <h2 className="ev-page-title">Events</h2>

        <header className="ev-section-header">
          <div className="ev-section-text">
            <h3 className="ev-section-subtitle">Browse Events</h3>
            <p>Browse through recent events organized by clubs</p>
          </div>

          <div className="ev-controls">
            <div className="ev-search-bar">
              <Search className="ev-search-icon" size={18} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="ev-search-input"
              />
            </div>
            <div className="ev-sort-controls">
              <label htmlFor="sort">Sort by Date:</label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setCurrentPage(1);
                }}
                className="ev-sort-select"
              >
                <option value="asc">Earliest First</option>
                <option value="desc">Latest First</option>
              </select>
            </div>
          </div>
        </header>

        {filteredEvents.length === 0 ? (
          <div className="ev-no-results">
            <h3>No events found</h3>
            <p>Try changing your search.</p>
          </div>
        ) : (
          <div className="ev-grid">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="ev-card"
                onClick={() => setSelectedEvent(event)}
              >
                <img
                  src={`http://localhost:8080/${event.imagePath}`}
                  alt={event.name}
                  className="ev-card-image"
                  loading="lazy"
                />
                <div className="ev-card-info">
                  <h3>{event.name}</h3>
                  <p className="ev-card-date">📅 {event.date}</p>
                  <p className="ev-card-category">{event.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="ev-pagination">
            <button
              className="ev-page-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`ev-page-btn ${currentPage === page ? 'ev-page-active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="ev-page-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {selectedEvent && (
        <div className="ev-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="ev-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="ev-close-btn"
              onClick={() => setSelectedEvent(null)}
            >
              <X size={20} />
            </button>

            <img
              src={selectedEvent.imagePath}
              alt={selectedEvent.name}
              className="ev-modal-image"
            />

            <div className="ev-modal-info">
              <h2>{selectedEvent.name}</h2>

              <div className="ev-details-grid">
                <div className="ev-detail-item">
                  <span className="ev-detail-label">📅 Date</span>
                  <span className="ev-detail-value">{selectedEvent.date}</span>
                </div>
                <div className="ev-detail-item">
                  <span className="ev-detail-label">📍 Venue</span>
                  <span className="ev-detail-value">{selectedEvent.venueName}</span>
                </div>
                <div className="ev-detail-item">
                  <span className="ev-detail-label">🏢 Club</span>
                  <span className="ev-detail-value">{selectedEvent.clubName}</span>
                </div>
                <div className="ev-detail-item">
                  <span className="ev-detail-label">📂 Category</span>
                  <span className="ev-category-badge">{selectedEvent.category}</span>
                </div>
              </div>

              <div className="ev-description-section">
                <h3>Description</h3>
                <p>{selectedEvent.description}</p>
              </div>

              <button
                className={`ev-feature-btn ${featuredEventIds.has(selectedEvent.id) ? 'featured' : ''}`}
                onClick={() => handleToggleFeature(selectedEvent.id)}
              >
                {featuredEventIds.has(selectedEvent.id) ? '⭐ Unfeature This Event' : '🌟 Feature This Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ev-main-content {
          margin-left: 200px;
          padding: 40px;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
          padding-top: 70px; /* Offset for fixed header */
        }

        .ev-header-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 70px;
          backdrop-filter: blur(20px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          z-index: 1200;
          background: rgba(20, 20, 20, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .ev-header-left {
          display: flex;
          align-items: center;
          gap: 0;
        }

        .ev-title {
          font-weight: 700;
          font-size: 22px;
          color: white;
          letter-spacing: -0.02em;
        }

        .ev-highlight {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ev-page-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ev-section-header {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 28px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ev-section-subtitle {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .ev-section-text p {
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 20px;
          font-size: 14px;
        }

        .ev-controls {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .ev-search-bar {
          position: relative;
          flex: 1;
          max-width: 600px;
        }

        .ev-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.4);
          z-index: 2;
        }

        .ev-search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          font-size: 15px;
          font-weight: 400;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          outline: none;
          backdrop-filter: blur(10px);
          box-sizing: border-box;
        }

        .ev-search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .ev-search-input:focus {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .ev-sort-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ev-sort-controls label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }

        .ev-sort-select {
          padding: 12px 40px 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.03);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
          backdrop-filter: blur(10px);
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23999' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }

        .ev-sort-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        .ev-sort-select:focus {
          border-color: rgba(249, 115, 22, 0.3);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        .ev-no-results {
          text-align: center;
          padding: 80px 20px;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ev-no-results h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .ev-no-results p {
          color: rgba(255, 255, 255, 0.5);
        }

        .ev-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }

        .ev-card {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .ev-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .ev-card-image {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .ev-card-info {
          padding: 16px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .ev-card-info h3 {
          color: #ffffff;
          margin: 0 0 6px;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .ev-card-date {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          margin: 0 0 8px;
        }

        .ev-card-category {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          width: fit-content;
          text-transform: capitalize;
        }

        .ev-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 32px;
        }

        .ev-page-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.8);
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          min-width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ev-page-btn:hover:not(:disabled):not(.ev-page-active) {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(249, 115, 22, 0.3);
          color: white;
          transform: translateY(-1px);
        }

        .ev-page-active {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          border-color: #FF453A;
          color: #ffffff;
          box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);
          font-weight: 600;
        }

        .ev-page-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Modal */
        .ev-modal-overlay {
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

        .ev-modal-content {
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .ev-close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .ev-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        .ev-modal-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .ev-modal-info {
          padding: 24px;
        }

        .ev-modal-info h2 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .ev-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .ev-detail-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .ev-detail-label {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          font-weight: 500;
        }

        .ev-detail-value {
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
        }

        .ev-category-badge {
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          width: fit-content;
          text-transform: capitalize;
        }

        .ev-description-section {
          margin-bottom: 24px;
        }

        .ev-description-section h3 {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ev-description-section p {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin: 0;
          font-size: 15px;
        }

        .ev-feature-btn {
          width: 100%;
          background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
        }

        .ev-feature-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
        }

        .ev-feature-btn.featured {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25);
        }

        .ev-feature-btn.featured:hover {
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        @media (max-width: 768px) {
          .ev-main-content {
            margin-left: 0;
            padding: 20px 12px;
          }

          .ev-page-title {
            font-size: 24px;
          }

          .ev-controls {
            flex-direction: column;
            align-items: stretch;
          }

          .ev-search-bar {
            width: 100%;
            max-width: none;
          }

          .ev-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          }

          .ev-modal-content {
            width: 95%;
            max-height: 95vh;
          }

          .ev-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EventsPage;