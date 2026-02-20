import React, { useEffect, useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import AcademicSidebar from './AcademicSidebar';
import Header from './components/Header';
import UserProfile from './UserProfile';
import axios from '../../api/axiosInstance';
import { PRIVILEGES } from '../../api/rolePrivileges';
import { getCurrentUserRole, getCurrentUserId } from '../../utils/auth';

const HallBookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Hall Bookings");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  //pagination states
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 5; // can be tuned for performance

  const [statusFilter, setStatusFilter] = useState('ALL');



  const sigCanvas = useRef(null);
  const printRef = useRef();

  const role = getCurrentUserRole();
  const userPrivs = PRIVILEGES[role] || [];
  const userId = getCurrentUserId();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    setPage(0);
    fetchBookings(0, false);
  }, [statusFilter]);



  const fetchBookings = async (pageNum = 0, append = false) => {
    try {
      let url = `/api/bookings/paged?page=${pageNum}&size=${pageSize}`;
      if (statusFilter !== 'ALL') {
        url = `/api/bookings/paged/filter?status=${statusFilter}&page=${pageNum}&size=${pageSize}`;
      }

      const res = await axios.get(url);
      const { content, last } = res.data;

      if (append) {
        setBookings((prev) => [...prev, ...content]);
      } else {
        setBookings(content);
      }

      setHasMore(!last);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };



  const handleApproveSar = async () => {
    if (!sigCanvas.current) return;
    if (sigCanvas.current.isEmpty()) {
      alert('Please provide a signature before approving.');
      return;
    }

    const sarSignatureImg = sigCanvas.current
      .toDataURL()
      .replace(/^data:image\/png;base64,/, '');

    try {
      await axios.post(
        `/api/bookings/approve/${userId}/${selectedItem.bookingId}`,
        sarSignatureImg,
        { headers: { 'Content-Type': 'text/plain' } }
      );

      fetchBookings();
      setIsSigning(false);
      setShowPreview(false);
    } catch (err) {
      console.error('Error approving booking:', err);
    }
  };

  const handleApproveFinal = async () => {
    if (!sigCanvas.current) return;
    if (sigCanvas.current.isEmpty()) {
      alert('Please provide a signature before approving.');
      return;
    }

    const finalSignatureImg = sigCanvas.current
      .toDataURL()
      .replace(/^data:image\/png;base64,/, '');

    try {
      await axios.post(
        `/api/bookings/final-approve/${userId}/${selectedItem.bookingId}`,
        finalSignatureImg,
        { headers: { 'Content-Type': 'text/plain' } }
      );

      fetchBookings();
      setIsSigning(false);
      setShowPreview(false);
    } catch (err) {
      console.error('Error approving booking:', err);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=900,height=700');

    printWindow.document.write(`
      <html>
        <head>
          <title>Hall Booking Request Form - #${selectedItem.bookingId}</title>
          <style>
            @page {
              size: A4;
              margin: 25mm 20mm;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.2;
              color: #000;
              background: white;
              margin: 0;
              padding: 0;
              font-size: 12px;
            }
            
            .form-container {
              border: 2px solid #000;
              padding: 15px;
              margin: 0;
            }
            
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 1px solid #000;
              padding-bottom: 10px;
            }
            
            .university-name {
              font-size: 14px;
              font-weight: bold;
              margin: 0;
              text-transform: uppercase;
            }
            
            .department {
              font-size: 12px;
              margin: 5px 0;
            }
            
            .form-title {
              font-size: 13px;
              font-weight: bold;
              margin: 15px 0 5px 0;
              text-transform: uppercase;
            }
            
            .hall-list {
              font-size: 10px;
              margin: 5px 0 15px 0;
              font-style: italic;
            }
            
            .booking-table {
              width: 100%;
              border-collapse: collapse;
              margin: 15px 0;
              font-size: 11px;
            }
            
            .booking-table th,
            .booking-table td {
              border: 1px solid #000;
              padding: 8px 4px;
              text-align: center;
              vertical-align: middle;
            }
            
            .booking-table th {
              background-color: #f0f0f0;
              font-weight: bold;
              font-size: 10px;
            }
            
            .booking-table .header-cell {
              font-size: 9px;
              line-height: 1.1;
            }
            
            .declaration {
              margin: 20px 0;
              font-size: 11px;
              line-height: 1.4;
              text-align: justify;
            }
            
            .declaration-title {
              font-weight: bold;
              text-decoration: underline;
            }
            
            .applicant-section {
              display: flex;
              justify-content: space-between;
              margin: 20px 0;
              font-size: 11px;
            }
            
            .applicant-left,
            .applicant-right {
              width: 48%;
            }
            
            .signature-line {
              border-bottom: 1px dotted #000;
              display: inline-block;
              min-width: 200px;
              margin-left: 10px;
              position: relative;
            }
            
            .signature-inline {
              position: absolute;
              top: -30px;
              left: 0;
              max-width: 150px;
              max-height: 40px;
              object-fit: contain;
            }
            
            .approval-section {
              margin-top: 30px;
              border-top: 1px solid #000;
              padding-top: 15px;
            }
            
            .office-use {
              font-weight: bold;
              text-align: center;
              margin-bottom: 15px;
              text-decoration: underline;
            }
            
            .approval-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }
            
            .approval-table td {
              border: none;
              padding: 8px;
              vertical-align: top;
            }
            
            .approval-left {
              width: 50%;
              border-right: 1px solid #000;
            }
            
            .approval-right {
              width: 50%;
              text-align: center;
            }
            
            .signature-box {
              border: 1px solid #000;
              height: 60px;
              margin: 10px 0;
              position: relative;
              background: white;
            }
            
            .signature-image {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            
            .recommendation {
              margin: 15px 0;
            }
            
            .assignment {
              margin: 15px 0;
            }
            
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              
              .form-container {
                border: 2px solid #000 !important;
              }
              
              .booking-table th,
              .booking-table td {
                border: 1px solid #000 !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="form-container">
            <div class="header">
              <div class="university-name">UNIVERSITY OF COLOMBO SCHOOL OF COMPUTING (UCSC)</div>
              <div class="department">Academic and Publications Branch</div>
            </div>
            
            <div class="form-title">REQUEST FORM FOR HALL BOOKING</div>
            <div class="hall-list">
              W001/W002/S104/S203/E401/4th Floor/E205(Mini Auditorium)/E202(IRqUE Hall)
              <br>
              <em>Separate forms should be submitted for different halls (out irrelavant parts above leaving required hall)</em>
            </div>
            
            <table class="booking-table">
            <thead>
              <tr>
                <th class="header-cell">Requested Hall</th>
                <th class="header-cell">Date</th>
                <th class="header-cell">Time</th>
                <th class="header-cell">Reason and approval<br>given if any</th>
                <th class="header-cell" colspan="2">Availability YES/NO<br>(Certified by booking Clerk<br>at APW)</th>
              </tr>
              <tr>
                <th class="header-cell2" style="border-top: none;"></th>
                <th class="header-cell2" style="border-top: none;"></th>
                <th class="header-cell2" style="border-top: none;"></th>
                <th class="header-cell2" style="border-top: none;"></th>
                <th class="header-cell2">Yes/No</th>
                <th class="header-cell2">Signature</th>
              </tr>
            </thead>
            <tbody>
              <tr style="height: 60px;">
                <td>${selectedItem.venueName}</td>
                <td>${selectedItem.date}</td>
                <td>${selectedItem.slotIds && selectedItem.slotIds.length > 0
        ? `${selectedItem.slotIds[0].startTime.slice(0, 5)} - ${selectedItem.slotIds[selectedItem.slotIds.length - 1].endTime.slice(0, 5)}`
        : ''
      }</td>

                <td>${selectedItem.reason}</td>
                <td style="border-right: none; width: 25%;">YES</td>
                <td style="border-left: none; width: 25%;"></td>
              </tr>
            </tbody>
          </table>
            
            <div class="declaration">
              <span class="declaration-title">Declaration of the Applicant:</span><br>
              I undertake the responsibility of booking and will take care of all assets in the room during the booking. I will not 
              change assets in the hall (technical settings or physical locations) without permission. I agree to pay compensation 
              to UCSC due to any damages.
            </div>
            
            <div class="applicant-section">
              <div class="applicant-left">
                <div>Name of Applicant: <span class="signature-line">${selectedItem.clubName}</span></div>
                <div style="margin-top: 15px;">Registration Number: <span class="signature-line"></span></div>
                <div style="margin-top: 15px;">Contact Number (Phone): <span class="signature-line">${selectedItem.contactNumber}</span></div>
              </div>
              <div class="applicant-right">
                <div>Signature of the Applicant: 
                  <span class="signature-line">
                    ${selectedItem.clubSignatureImage ?
        `<img src="data:image/png;base64,${selectedItem.clubSignatureImage}" alt="Club Signature" class="signature-inline">` :
        ''}
                  </span>
                </div>
                <div style="margin-top: 30px;">Date: <span class="signature-line">${new Date().toLocaleDateString()}</span></div>
              </div>
            </div>
            
            <div class="approval-section">
              <div class="office-use">For office use only</div>
              
              <table class="approval-table">
                <tr>
                  <td class="approval-left">
                    <div class="recommendation">
                      <strong>1. I recommend the above request</strong>
                      <div style="margin-top: 20px;">
                        <span class="signature-line" style="width: 200px;">
                          ${selectedItem.sarSignatureImage ?
        `<img src="data:image/png;base64,${selectedItem.sarSignatureImage}" alt="SAR Signature" class="signature-inline">` :
        ''}
                        </span><br>
                        <small>AR SA / Coordinator Advisor &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date: .................</small>
                      </div>
                    </div>
                    
                    <div class="assignment" style="margin-top: 40px;">
                      <strong>3. Assignment of Lecture Hall</strong>
                      <div style="margin-top: 15px;">
                        <span class="signature-line" style="width: 200px;"></span><br>
                        <small>Date: .................</small>
                      </div>
                      <div style="margin-top: 15px;">
                        <span class="signature-line" style="width: 150px;"></span><br>
                        <small>DR. SAR AR</small><br>
                        <small>Academic and Publications</small>
                      </div>
                    </div>
                  </td>
                  
                  <td class="approval-right">
                    <div><strong>2. Approval is granted</strong></div>
                    <div style="margin-top: 15px;">
                      <span class="signature-line" style="width: 200px;">
                        ${selectedItem.finalSignatureImage ?
        `<img src="data:image/png;base64,${selectedItem.finalSignatureImage}" alt="Final Signature" class="signature-inline">` :
        ''}
                      </span><br>
                      <small>Director/Deputy Director/Head &nbsp;&nbsp; Date: .................</small>
                    </div>
                    
                    <div style="margin-top: 40px;">
                      <strong>Assigning caretaker</strong>
                      <div style="margin-top: 15px;">
                        <span class="signature-line" style="width: 200px;"></span><br>
                        <small>Date: .................</small>
                      </div>
                      <div style="margin-top: 15px;">
                        <span class="signature-line" style="width: 150px;"></span><br>
                        <small>DR. SAR AR</small><br>
                        <small>General Administration</small>
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClose = () => {
    setShowNotifications(false);
  };

  const handleProfileToggle = () => {
    setShowProfile(!showProfile);
  };

  const handleProfileClose = () => {
    setShowProfile(false);
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.venueId?.toString().includes(searchQuery) ||
      b.clubName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBookingCard = (booking) => (
    <div key={booking.id} className="card">
      <div className="card-header">
        <span className="hall-name">Booking #{booking.bookingId}</span>
        <span className={`status ${booking.status?.toLowerCase()}`}>{booking.status}</span>
      </div>
      <div className="card-body">
        <p><strong>Hall: </strong> {booking.venueName}</p>
        <p><strong>Date: </strong> {booking.date}</p>
        <p><strong>Time: </strong>
          {booking.slotIds && booking.slotIds.length > 0 &&
            `${booking.slotIds[0].startTime.slice(0, 5)} - ${booking.slotIds[booking.slotIds.length - 1].endTime.slice(0, 5)}`
          }
        </p>

        <p><strong>Booked by:</strong> {booking.clubName}</p>
        <p><strong>Contact:</strong> {booking.contactNumber}</p>
        <p><strong>Reason:</strong> {booking.reason}</p>
      </div>
      <div className="card-actions">
        <button
          onClick={() => { setSelectedItem(booking); setShowPreview(true); }}
          className="view-btn"
        >
          View Details
        </button>

        {role === 'ACADEMIC_SAR' && booking.status === 'PENDING' && (
          <button
            onClick={() => { setSelectedItem(booking); setShowPreview(true); setIsSigning(true); }}
            className="sign-btn sar-btn"
          >
            Sign & Approve
          </button>
        )}

        {role === 'ACADEMIC_DEPUTY_DIRECTOR' && (
          <>
            {booking.status === 'SAR_SIGNED' && (
              <button
                onClick={() => { setSelectedItem(booking); setShowPreview(true); setIsSigning(true); }}
                className="sign-btn final-btn"
              >
                Final Approve
              </button>
            )}
            {booking.status === 'PENDING' && (
              <span className="awaiting-text">Awaiting SAR approval</span>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={`dashboard-container`}>
      <Header onProfileClick={() => setShowProfile(true)} />
      <div className="dashboard-content">
        <AcademicSidebar
          activeItem={activeNavItem}
          onNavigate={handleNavigation}
          isDarkMode={true}
        />
        <main className="dashboard-main">
          <h2 className="page-title">Hall Bookings</h2>

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

            <div className="filter-dropdown">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="SAR_SIGNED">SAR Signed</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>


          <div className="cards-container">
            {filteredBookings.map(renderBookingCard)}

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
              </div>
            )}
          </div>
          <div className="pagination-controls">
            <button
              disabled={page === 0}
              onClick={() => fetchBookings(page - 1, false)}
              className={`pagination-btn ${page === 0 ? 'disabled' : ''}`}
            >
              ← Previous
            </button>

            <span className="page-indicator">Page {page + 1}</span>

            <button
              disabled={!hasMore}
              onClick={() => fetchBookings(page + 1, false)}
              className={`pagination-btn ${!hasMore ? 'disabled' : ''}`}
            >
              Next →
            </button>
          </div>




        </main>
      </div>

      {showPreview && selectedItem && (
        <div className="modal">
          <div className="modal-content" ref={printRef}>
            <button
              className="close-btn"
              onClick={() => { setShowPreview(false); setIsSigning(false); }}
            >
              ×
            </button>
            <h2>Booking Details</h2>
            <div className="modal-body">
              <div className="details">
                <p><strong>Booking ID:</strong> #{selectedItem.bookingId}</p>
                <p><strong>Hall:</strong> {selectedItem.venueId}</p>
                <p><strong>Date:</strong> {selectedItem.date}</p>
                <p><strong>Time: </strong>
                  {selectedItem.slotIds && selectedItem.slotIds.length > 0 &&
                    `${selectedItem.slotIds[0].startTime.slice(0, 5)} - ${selectedItem.slotIds[selectedItem.slotIds.length - 1].endTime.slice(0, 5)}`
                  }
                </p>
                <p><strong>Booked by:</strong> {selectedItem.clubName}</p>
                <p><strong>Contact:</strong> {selectedItem.contactNumber}</p>
                <p><strong>Reason:</strong> {selectedItem.reason}</p>
                <p><strong>Status:</strong>
                  <span className={`status ${selectedItem.status?.toLowerCase()}`}>
                    {selectedItem.status}
                  </span>
                </p>
              </div>

              <h3>Signatures</h3>
              <div className="signatures">
                <div className="signature-block">
                  <p><strong>Club</strong></p>
                  {selectedItem.clubSignatureImage && (
                    <img src={`data:image/png;base64,${selectedItem.clubSignatureImage}`} alt="Club Signature" />
                  )}
                </div>
                <div className="signature-block">
                  <p><strong>SAR</strong></p>
                  {selectedItem.sarSignatureImage && (
                    <img src={`data:image/png;base64,${selectedItem.sarSignatureImage}`} alt="SAR Signature" />
                  )}
                </div>
                <div className="signature-block">
                  <p><strong>Deputy Director</strong></p>
                  {selectedItem.finalSignatureImage && (
                    <img src={`data:image/png;base64,${selectedItem.finalSignatureImage}`} alt="Final Signature" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            {(role === 'ACADEMIC_SAR' && selectedItem.status === 'PENDING' && isSigning) && (
              <div className="signature-container">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{ width: 400, height: 150, className: 'sigCanvas' }}
                />
                <div className="signature-actions">
                  <button onClick={() => sigCanvas.current.clear()} className="clear-btn">
                    Clear
                  </button>
                  <button onClick={handleApproveSar} className="sign-btn sar-btn">
                    Approve Booking
                  </button>
                </div>
              </div>
            )}

            {(role === 'ACADEMIC_DEPUTY_DIRECTOR' && selectedItem.status === 'SAR_SIGNED' && isSigning) && (
              <div className="signature-container">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  canvasProps={{ width: 400, height: 150, className: 'sigCanvas' }}
                />
                <div className="signature-actions">
                  <button onClick={() => sigCanvas.current.clear()} className="clear-btn">
                    Clear
                  </button>
                  <button onClick={handleApproveFinal} className="sign-btn final-btn">
                    Final Approve Booking
                  </button>
                </div>
              </div>
            )}

            <button onClick={handlePrint} className="print-btn">
              Print Data
            </button>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-container {
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          letter-spacing: -0.01em;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
          color: white;
        }
        .header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 70px;
            backdrop-filter: blur(20px);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 24px;
            z-index: 1001;
            transition: all 0.3s ease;
            background: rgba(20, 20, 20, 0.95);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .dashboard-container.blur-background .dashboard-content {
          filter: blur(8px);
          pointer-events: none;
        }

        .dashboard-container.blur-background .header {
          filter: blur(8px);
        }

        .notification-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9998;
          backdrop-filter: blur(4px);
        }

        .notification-popup {
          position: fixed;
          top: 80px;
          right: 24px;
          width: 380px;
          max-height: 500px;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          z-index: 9999;
          overflow: hidden;
          backdrop-filter: blur(20px);
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .notification-header {
          padding: 20px 20px 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notification-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .close-btn {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        .notification-list {
          max-height: 320px;
          overflow-y: auto;
          padding: 8px 0;
        }

        .notification-item {
          padding: 16px 20px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .notification-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .notification-item.unread {
          background: rgba(59, 130, 246, 0.05);
          border-left: 3px solid #3b82f6;
        }

        .notification-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.2);
          flex-shrink: 0;
        }

        .notification-icon i {
          color: #60a5fa;
          font-size: 14px;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          line-height: 1.3;
        }

        .notification-content p {
          margin: 0 0 6px 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.4;
        }

        .notification-time {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
        }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 4px;
        }

        .notification-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          gap: 12px;
        }

        .notification-footer button {
          flex: 1;
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .notification-footer button.mark-all-read {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .notification-footer button.mark-all-read:hover {
          background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
          border-color: rgba(248, 113, 113, 0.5);
        }

        .notification-footer button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .dashboard-content {
          display: flex;
          padding-top: 70px;
          flex: 1;
          min-height: calc(100vh - 70px);
        }

        main.dashboard-main {
          flex: 1;
          padding: 40px;
          background: transparent;
          margin-left: 200px;
          overflow-y: auto;
          min-height: calc(100vh - 70px);
        }

        .page-title {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 32px;
          letter-spacing: -0.03em;
          transition: all 0.3s ease;
          color: white;
          background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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

        .final-btn {
          background-color: #8b5cf6;
        }

        .final-btn:hover {
          background-color: #7c3aed;
        }

        .awaiting-text {
          color: #fbbf24;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          background-color: #451a03;
          border-radius: 6px;
          border: 1px solid #92400e;
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
          width: 90vw;
          max-width: 800px;
          max-height: 90vh;
          color: white;
          position: relative;
          box-shadow: 0 0 20px rgba(0,0,0,0.8);
          overflow-y: auto;
        }

        .modal-content h2 {
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          color: #e5e7eb;
          border-bottom: 2px solid #444;
          padding-bottom: 12px;
        }

        .modal-body {
          margin-top: 20px;
        }

        .details {
          background-color: #333;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          border: 1px solid #444;
        }

        .details p {
          margin: 12px 0;
          font-size: 15px;
          color: #d1d5db;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #444;
        }

        .details p:last-child {
          border-bottom: none;
        }

        .details strong {
          color: #e5e7eb;
          min-width: 120px;
          text-align: left;
        }

        .signatures {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 24px;
          padding: 20px;
          background-color: #333;
          border-radius: 12px;
          border: 1px solid #444;
        }

        .signature-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          background-color: #2a2a2a;
          border-radius: 8px;
          border: 1px solid #555;
          min-height: 160px;
          justify-content: center;
        }

        .signature-block p {
          margin: 0 0 12px 0;
          font-weight: 600;
          font-size: 14px;
          color: #e5e7eb;
          text-align: center;
        }

        .signature-block img {
          max-width: 180px;
          max-height: 80px;
          min-width: 120px;
          min-height: 60px;
          border: 2px solid #666;
          border-radius: 6px;
          background-color: #fff;
          padding: 4px;
          object-fit: contain;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .signature-block:empty::after,
        .signature-block img[src=""]:parent::after {
          content: "Not signed";
          color: #9ca3af;
          font-style: italic;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
          border: 2px dashed #666;
          border-radius: 6px;
          background-color: #1f2937;
          width: 180px;
        }

        .signature-container {
          background-color: #333;
          padding: 20px;
          border-radius: 12px;
          margin-top: 20px;
          border: 1px solid #444;
        }

        .sigCanvas {
          border: 2px solid #666;
          border-radius: 8px;
          background-color: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: crosshair;
        }

        .signature-actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          justify-content: center;
        }

        .clear-btn {
          background-color: #ef4444;
          border: none;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }

        .clear-btn:hover {
          background-color: #dc2626;
        }

        .print-btn {
          background-color: #059669;
          border: none;
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .print-btn:hover {
          background-color: #047857;
        }

        .print-btn::before {
          content: "🖨️";
          font-size: 16px;
        }

        .modal-actions {
          margin-top: 20px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
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
          .load-more-btn,
.pagination-controls button {
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover,
.pagination-controls button:hover {
  background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.pagination-controls span {
  font-size: 14px;
  color: #d1d5db;
}

.filter-dropdown select {
  background-color: #333;
  color: white;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s ease;
}

.filter-dropdown select:hover {
  background-color: #444;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-btn {
  background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.pagination-btn:hover {
  background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);
}

.pagination-btn.disabled,
.pagination-btn:disabled {
  background: #444;
  color: #aaa;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-indicator {
  font-size: 15px;
  color: #d1d5db;
  font-weight: 500;
}


        /* Responsive Design */
        @media (max-width: 768px) {
          main.dashboard-main {
            margin-left: 0;
            padding: 20px 12px;
            max-width: 100vw;
          }
          
          .page-title {
            font-size: 24px;
            margin-bottom: 24px;
          }
          
          .cards-container {
            gap: 12px;
          }
          
          .card {
            padding: 12px;
          }
          
          .modal-content {
            width: 95vw;
            padding: 16px;
          }
          
          .signatures {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>

      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
};

export default HallBookings;