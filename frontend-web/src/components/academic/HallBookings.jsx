import React, { useEffect, useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import AcademicSidebar from './AcademicSidebar';
import axios from '../../api/axiosInstance';
import { PRIVILEGES } from '../../api/rolePrivileges';
import { getCurrentUserRole, getCurrentUserId } from '../../utils/auth';

const HallBookings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isSigning, setIsSigning] = useState(false);

  const sigCanvas = useRef(null);
  const printRef = useRef();

  const role = getCurrentUserRole();
  const userPrivs = PRIVILEGES[role] || [];
  const userId = getCurrentUserId();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/api/bookings');
      console.log('Fetched bookings:', res.data);
      const sorted = res.data.sort((a, b) => b.id - a.id);
      setBookings(sorted);
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
                <td>${
  selectedItem.slotIds && selectedItem.slotIds.length > 0 
    ? `${selectedItem.slotIds[0].startTime.slice(0,5)} - ${selectedItem.slotIds[selectedItem.slotIds.length - 1].endTime.slice(0,5)}` 
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
    
    // Wait for content to load before printing
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.venueId?.toString().includes(searchQuery) ||
      b.clubName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBookingCard = (booking) => (
    <div key={booking.id} className="card">
      <div className="card-header">
        <span className="hall-name">Booking #{booking.id}</span>
        <span className={`status ${booking.status?.toLowerCase()}`}>{booking.status}</span>
      </div>
      <div className="card-body">
        <p><strong>Hall: </strong> {booking.venueName}</p>
        <p><strong>Date: </strong> {booking.date}</p>
        <p><strong>Time: </strong> 
          {booking.slotIds && booking.slotIds.length > 0 && 
            `${booking.slotIds[0].startTime.slice(0,5)} - ${booking.slotIds[booking.slotIds.length - 1].endTime.slice(0,5)}`
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
                <p><strong>Time Slots:</strong> {selectedItem.slotIds?.join(', ')}</p>
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
          /* Enhanced Signature Display Styles */
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

/* Signature Canvas Styling */
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

.final-btn {
  background-color: #8b5cf6;
}

.final-btn:hover {
  background-color: #7c3aed;
}

/* Modal Content Enhancements */
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

/* Print Button Styling */
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

/* Awaiting Text Styling */
.awaiting-text {
  color: #fbbf24;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  background-color: #451a03;
  border-radius: 6px;
  border: 1px solid #92400e;
}

/* Print-specific styles - these will be injected into the print window */
@media print {
  body {
    font-family: Arial, sans-serif;
    padding: 20px;
    color: #000;
    background: white;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 24px;
    border-bottom: 2px solid #333;
    padding-bottom: 10px;
  }
  
  .details {
    margin-bottom: 30px;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
  }
  
  .details p {
    margin: 10px 0;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding: 8px 0;
  }
  
  .signatures {
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
    gap: 20px;
    page-break-inside: avoid;
  }
  
  .signature-block {
    text-align: center;
    flex: 1;
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .signature-block p {
    font-weight: bold;
    margin-bottom: 15px;
    font-size: 14px;
  }
  
  .signature-block img {
    max-width: 180px;
    max-height: 80px;
    border: 1px solid #999;
    background-color: white;
    padding: 5px;
    border-radius: 4px;
  }
  
  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    background-color: #f0f0f0;
    color: #333;
  }
}
      `}</style>
    </div>
  );
};

export default HallBookings;