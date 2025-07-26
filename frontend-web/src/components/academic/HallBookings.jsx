import React, { useEffect, useState } from 'react';
import AcademicSidebar from './AcademicSidebar';
import axios from '../../api/axiosInstance';

const HallBookings = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [bookings, setBookings] = useState([]);

useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/venue-bookings/all');
      console.log('Bookings:', res.data);
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleAction = (action, item) => {
    if (action === 'view') {
      setSelectedItem(item);
      setShowPreview(true);
    }
  };

 const renderBookingCard = (booking) => (
    <div key={booking.id} className="card">
      <div className="card-header">
        <span className="hall-name">{booking.venueName}</span>
        <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
      </div>
      <div className="card-body">
        <p><strong>Date:</strong> {booking.requestedDate}</p>
        <p><strong>Time:</strong> {booking.slotTimes.join(', ')}</p>
        <p><strong>Booked by:</strong> {booking.applicantName}</p>
      </div>
      <div className="card-actions">
        <button onClick={() => handleAction('view', booking)}>
          <i className="fas fa-eye"></i> View
        </button>
      </div>
    </div>
  );

  return (
    <div className="hall-bookings">
      <header className="header">
        <div className="logo">ReidConnect <span>AcademicAdmin</span></div>
        <div className="admin-info">
          <i className="fas fa-bell"></i>
          <i className="fas fa-user"></i>
          <span>Admin</span>
        </div>
      </header>

 <div className="body">
        <AcademicSidebar activeItem="Hall Bookings" />
        <main className="main-content">
          <h1>Hall Bookings</h1>

          <div className="controls">
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder={`Search bookings...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="cards-container">
            {activeTab === 'bookings'
              ? bookings
                  .filter((b) =>
                    b.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    b.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(renderBookingCard)
              : <p>No lecture requests available</p>}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showPreview && selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>
            <h3>Booking Preview</h3>
            <p><strong>Hall:</strong> {selectedItem.venueName}</p>
            <p><strong>Date:</strong> {selectedItem.requestedDate}</p>
            <p><strong>Time Slots:</strong> {selectedItem.slotTimes.join(', ')}</p>
            <p><strong>Booked by:</strong> {selectedItem.applicantName}</p>
            <p><strong>Contact:</strong> {selectedItem.contactNumber}</p>
            <p><strong>Reason:</strong> {selectedItem.reason}</p>
            <p><strong>Status:</strong> {selectedItem.status}</p>
          </div>
        </div>
      )}

      <style>{`
        .hall-bookings {
          background-color: #1a1a1a;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .header {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          background-color: #2a2a2a;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          z-index: 1001;
        }

        .logo {
          font-weight: bold;
          font-size: 20px;
          color: white;
        }

        .logo span {
          color: #ef4444;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 16px;
          color: white;
        }

        .admin-info i {
          font-size: 20px;
          cursor: pointer;
        }

        .admin-info span {
          font-size: 14px;
        }

        .body {
          display: flex;
          padding-top: 64px; /* height of header */
          flex: 1;
          min-height: calc(100vh - 64px);
        }

        main.main-content {
          flex: 1;
          padding: 32px;
          background-color: #1a1a1a;
          margin-left: 200px; /* width of sidebar */
          overflow-y: auto;
          min-height: calc(100vh - 64px);
        }

        main.main-content h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 24px;
          color: white;
        }

        .tabs {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tabs button {
          background: none;
          border: none;
          color: #9ca3af;
          font-weight: 600;
          font-size: 14px;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.3s, color 0.3s;
        }

        .tabs button i {
          font-size: 16px;
        }

        .tabs button.active,
        .tabs button:hover {
          background-color: #2563eb;
          color: white;
        }

        .controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .search-bar {
          background-color: #333;
          border-radius: 8px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-grow: 1;
          max-width: 400px;
          color: white;
        }

        .search-bar i {
          font-size: 16px;
        }

        .search-bar input {
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 14px;
          flex-grow: 1;
          min-width: 0;
        }

        .new-booking {
          background-color: #ef4444;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.3s;
        }

        .new-booking i {
          font-size: 16px;
        }

        .new-booking:hover {
          background-color: #dc2626;
        }

        .cards-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .card {
          background-color: #2a2a2a;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 0 8px rgba(0,0,0,0.6);
          display: flex;
          flex-direction: column;
          gap: 12px;
          border: 1px solid #444;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hall-name {
          font-weight: 700;
          font-size: 18px;
        }

        .status {
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          color: white;
        }

        .status.confirmed {
          background-color: #16a34a; /* green-600 */
        }

        .status.pending {
          background-color: #d97706; /* amber-600 */
        }

        .card-body p {
          margin: 4px 0;
          font-size: 14px;
          line-height: 1.3;
          color: #d1d5db; /* gray-300 */
        }

        .card-actions {
          display: flex;
          gap: 12px;
        }

        .card-actions button {
          background-color: #2563eb; /* blue-600 */
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background-color 0.3s;
        }

        .card-actions button:hover {
          background-color: #1d4ed8; /* blue-700 */
        }

        /* Modal */
        .modal {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .modal-content {
          background-color: #2a2a2a;
          padding: 24px;
          border-radius: 12px;
          width: 320px;
          color: white;
          position: relative;
          box-shadow: 0 0 10px rgba(0,0,0,0.8);
        }

        .modal-content h3 {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 22px;
          font-weight: 700;
        }

        .modal-content p {
          margin: 6px 0;
          font-size: 14px;
          color: #d1d5db;
        }

        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          font-size: 24px;
          color: #ef4444;
          cursor: pointer;
          font-weight: 700;
          line-height: 1;
        }

        .close-btn:hover {
          color: #dc2626;
        }
      `}</style>
    </div>
  );
};

export default HallBookings;
