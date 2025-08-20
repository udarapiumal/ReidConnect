import React, { useEffect, useState } from 'react';
import AcademicSidebar from './AcademicSidebar';
import axios from '../../api/axiosInstance';
import { PRIVILEGES } from '../../api/rolePrivileges';
import { getCurrentUserRole } from '../../utils/auth';

const HallBookings = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookings, setBookings] = useState([]);

  const role = getCurrentUserRole();
  const userPrivs = PRIVILEGES[role] || [];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/bookings');
      // Sort by descending ID by default
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setBookings(sorted);
      console.log('Bookings fetched:', sorted);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Filtered bookings with search
  const filteredBookings = bookings.filter((b) =>
    b.venueId.toString().includes(searchQuery) ||
    b.clubName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (action, item) => {
    if (action === 'view') {
      // For approved documents, call signing API based on user role
      const signingStatus = getSigningStatus(item);
      if (signingStatus.isApproved) {
        if (role === 'ACADEMIC_SAR') {
          sendSigningRequest('sar', item);
        } else if (role === 'ACADEMIC_DEPUTY_DIRECTOR') {
          sendSigningRequest('deputy', item);
        } else if (role === 'UNION') {
          sendSigningRequest('union', item);
        } else if (role === 'ACADEMIC_MA') {
          sendSigningRequest('club', item);
        } else {
          // Fallback to modal for other roles
          setSelectedItem(item);
          setShowPreview(true);
        }
      } else {
        // For non-approved documents, show modal
        setSelectedItem(item);
        setShowPreview(true);
      }
    }
  };

  const sendSigningRequest = async (roleType, item) => {
    try {
      let url = 'http://localhost:8080';
      switch (roleType) {
        case 'club':
          url = `/bookings/${item.id}/sign/club?name=${item.clubName}&email=${item.contactNumber}`;
          break;
        case 'sar':
          url = `/bookings/${item.id}/sign/sar?name=EADS%20Udayanga&email=sam@ucsc.cmb.ac.lk`;
          break;
        case 'union':
          url = `/bookings/${item.id}/sign/union?name=Shashika&email=Shashika@gmail.com`;
          break;
        case 'deputy':
          url = `/bookings/${item.id}/sign/deputy?name=W.V%20Welgama&email=wvw@ucsc.cmb.ac.lk`;
          break;
        default:
          return;
      }
      const res = await axios.get(url);
      window.open(res.data, '_blank');
      
      // Refresh bookings after signing
      setTimeout(() => {
        fetchBookings();
      }, 1000);
    } catch (err) {
      console.error(`Error sending signing request for ${roleType}:`, err);
    }
  };

  const getSigningStatus = (booking) => {
    // Assuming status values like: 'PENDING', 'SAR_SIGNED', 'UNION_SIGNED', 'DEPUTY_SIGNED', 'APPROVED'
    // You may need to adjust these based on your actual status values
    const status = booking.status.toLowerCase();
    
    return {
      isPending: status === 'pending',
      isSarSigned: status === 'sar_signed' || status === 'union_signed' || status === 'deputy_signed' || status === 'approved',
      isUnionSigned: status === 'union_signed' || status === 'deputy_signed' || status === 'approved',
      isDeputySigned: status === 'deputy_signed' || status === 'approved',
      isApproved: status === 'approved'
    };
  };

  const renderSigningButtons = (item) => {
    const signingStatus = getSigningStatus(item);
    const buttons = [];

    // SAR can sign when status is PENDING, view document after signed
    if (userPrivs.includes('BOOKING_SIGN') && role === 'ACADEMIC_SAR') {
      if (signingStatus.isPending) {
        buttons.push(
          <button 
            key="sar-sign"
            onClick={() => sendSigningRequest('sar', item)}
            className="sign-btn sar-btn"
          >
            SAR Sign
          </button>
        );
      } else if (signingStatus.isSarSigned) {
        buttons.push(
          <button 
            key="sar-view"
            onClick={() => sendSigningRequest('sar', item)}
            className="view-btn"
          >
            View
          </button>
        );
      }
    }

    // Deputy Director can sign after Union has signed
    if (userPrivs.includes('BOOKING_SIGN') && role === 'ACADEMIC_DEPUTY_DIRECTOR') {
      if (signingStatus.isPending) {
        buttons.push(
          <span key="pending-sar" className="pending-indicator">
            Pending SAR Signature
          </span>
        );
      } else if (signingStatus.isSarSigned && !signingStatus.isUnionSigned) {
        buttons.push(
          <span key="pending-union" className="pending-indicator">
            Pending Union Signature
          </span>
        );
      } else if (signingStatus.isUnionSigned && !signingStatus.isDeputySigned) {
        buttons.push(
          <button 
            key="deputy-sign"
            onClick={() => sendSigningRequest('deputy', item)}
            className="sign-btn deputy-btn"
          >
            Deputy Sign
          </button>
        );
      } else if (signingStatus.isDeputySigned) {
        buttons.push(
          <button 
            key="deputy-view"
            onClick={() => sendSigningRequest('deputy', item)}
            className="view-btn"
          >
            View
          </button>
        );
      }
    }

    // Union signing - after SAR has signed
    if (userPrivs.includes('BOOKING_SIGN') && role === 'UNION') {
      if (signingStatus.isPending) {
        buttons.push(
          <span key="pending-sar-union" className="pending-indicator">
            Pending SAR Signature
          </span>
        );
      } else if (signingStatus.isSarSigned && !signingStatus.isUnionSigned) {
        buttons.push(
          <button 
            key="union-sign"
            onClick={() => sendSigningRequest('union', item)}
            className="sign-btn union-btn"
          >
            Union Sign
          </button>
        );
      } else if (signingStatus.isUnionSigned) {
        buttons.push(
          <button 
            key="union-view"
            onClick={() => sendSigningRequest('union', item)}
            className="view-btn"
          >
            View
          </button>
        );
      }
    }

    // MA can only view documents, no signing
    if (role === 'ACADEMIC_MA') {
      buttons.push(
        <span key="ma-view" className="view-only-indicator">
          View Only
        </span>
      );
    }

    return buttons;
  };

  const renderBookingCard = (booking) => (
    <div key={booking.id} className="card">
      <div className="card-header">
        <span className="hall-name">Booking #{booking.id}</span>
        <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
      </div>
      <div className="card-body">
        <p><strong>Hall:</strong> {booking.venueId}</p>
        <p><strong>Date:</strong> {booking.date}</p>
        <p><strong>Slots:</strong> {booking.slotIds.join(', ')}</p>
        <p><strong>Booked by:</strong> {booking.clubName}</p>
        <p><strong>Contact:</strong> {booking.contactNumber}</p>
        <p><strong>Reason:</strong> {booking.reason}</p>
        {booking.envelopeId && (
          <p><strong>Envelope ID:</strong> {booking.envelopeId}</p>
        )}
      </div>
      <div className="card-actions">
        <button onClick={() => handleAction('view', booking)} className="view-btn">
          View Details
        </button>
        {renderSigningButtons(booking)}
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
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="cards-container">
            {filteredBookings.map(renderBookingCard)}
          </div>
        </main>
      </div>

      {showPreview && selectedItem && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowPreview(false)}>×</button>
            <h3>Booking Details</h3>
            <div className="modal-body">
              <p><strong>Booking ID:</strong> #{selectedItem.id}</p>
              <p><strong>Hall:</strong> {selectedItem.venueId}</p>
              <p><strong>Date:</strong> {selectedItem.date}</p>
              <p><strong>Time Slots:</strong> {selectedItem.slotIds.join(', ')}</p>
              <p><strong>Booked by:</strong> {selectedItem.clubName}</p>
              <p><strong>Contact:</strong> {selectedItem.contactNumber}</p>
              <p><strong>Reason:</strong> {selectedItem.reason}</p>
              <p><strong>Status:</strong> <span className={`status ${selectedItem.status.toLowerCase()}`}>{selectedItem.status}</span></p>
              {selectedItem.envelopeId && (
                <p><strong>Envelope ID:</strong> {selectedItem.envelopeId}</p>
              )}
            </div>
            <div className="modal-actions">
              {renderSigningButtons(selectedItem)}
            </div>
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
          padding-top: 64px;
          flex: 1;
          min-height: calc(100vh - 64px);
        }

        main.main-content {
          flex: 1;
          padding: 32px;
          background-color: #1a1a1a;
          margin-left: 200px;
          overflow-y: auto;
          min-height: calc(100vh - 64px);
        }

        main.main-content h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 24px;
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
          background-color: #16a34a;
        }

        .status.pending {
          background-color: #d97706;
        }

        .status.sar_signed {
          background-color: #0ea5e9;
        }

        .status.union_signed {
          background-color: #f59e0b;
        }

        .status.deputy_signed {
          background-color: #8b5cf6;
        }

        .status.approved {
          background-color: #16a34a;
        }

        .card-body p {
          margin: 4px 0;
          font-size: 14px;
          line-height: 1.3;
          color: #d1d5db;
        }

        .card-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }

        .view-btn {
          background-color: #2563eb;
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .view-btn:hover {
          background-color: #1d4ed8;
        }

        .sign-btn {
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .sar-btn {
          background-color: #16a34a;
        }

        .sar-btn:hover {
          background-color: #15803d;
        }

        .deputy-btn {
          background-color: #8b5cf6;
        }

        .deputy-btn:hover {
          background-color: #7c3aed;
        }

        .union-btn {
          background-color: #f59e0b;
        }

        .union-btn:hover {
          background-color: #d97706;
        }

        .signed-indicator {
          background-color: #166534;
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .pending-indicator {
          background-color: #7f1d1d;
          color: #fca5a5;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .view-only-indicator {
          background-color: #374151;
          color: #9ca3af;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

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
          width: 400px;
          max-width: 90vw;
          color: white;
          position: relative;
          box-shadow: 0 0 10px rgba(0,0,0,0.8);
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-content h3 {
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 22px;
          font-weight: 700;
        }

        .modal-body p {
          margin: 8px 0;
          font-size: 14px;
          color: #d1d5db;
        }

        .modal-actions {
          margin-top: 20px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
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