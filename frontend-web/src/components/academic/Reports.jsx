import React, { useState } from "react";
import AcademicSidebar from './AcademicSidebar'; 
import Header from './components/Header';
import UserProfile from './UserProfile';

export default function Reports() {
  const [activeNavItem, setActiveNavItem] = useState("Reports");
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
  };

  const handleProfileToggle = () => {
    setShowProfile(!showProfile);
  };

  const handleProfileClose = () => {
    setShowProfile(false);
  };

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
  };

  const handleNotificationClose = () => {
    setShowNotifications(false);
  };

  // Sample documents data
  const documents = [
    {
      id: 1,
      name: "Academic Staff Performance Report Q2 2025",
      category: "Performance Reports",
      uploadDate: "2025-07-15",
      fileSize: "2.5 MB",
      status: "Published",
      downloadCount: 45,
      fileType: "PDF"
    },
    {
      id: 2,
      name: "Student Enrollment Statistics 2025",
      category: "Statistical Reports",
      uploadDate: "2025-07-10",
      fileSize: "1.8 MB",
      status: "Draft",
      downloadCount: 0,
      fileType: "Excel"
    },
    {
      id: 3,
      name: "Hall Utilization Analysis Report",
      category: "Facility Reports",
      uploadDate: "2025-07-08",
      fileSize: "3.2 MB",
      status: "Published",
      downloadCount: 23,
      fileType: "PDF"
    },
    {
      id: 4,
      name: "Event Management Summary June 2025",
      category: "Event Reports",
      uploadDate: "2025-07-01",
      fileSize: "1.1 MB",
      status: "Published",
      downloadCount: 67,
      fileType: "Word"
    },
    {
      id: 5,
      name: "Budget Allocation Report 2025-2026",
      category: "Financial Reports",
      uploadDate: "2025-06-28",
      fileSize: "4.7 MB",
      status: "Review",
      downloadCount: 12,
      fileType: "PDF"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return '#22c55e'; // green
      case 'Draft': return '#fbbf24'; // yellow
      case 'Review': return '#f97316'; // orange
      default: return '#6b7280'; // gray
    }
  };

  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case 'PDF': return 'fa-file-pdf';
      case 'Excel': return 'fa-file-excel';
      case 'Word': return 'fa-file-word';
      default: return 'fa-file';
    }
  };

  // Notifications data (same as Dashboard)
  const notifications = [
    { 
      id: 1, 
      title: "New Report Generated", 
      message: "Monthly performance report has been generated successfully", 
      time: "5 min ago", 
      type: "report",
      unread: true 
    },
    { 
      id: 2, 
      title: "Document Approval", 
      message: "Budget report requires your approval", 
      time: "30 min ago", 
      type: "approval",
      unread: true 
    }
  ];

  return (
    <div className={`dashboard-container ${showNotifications ? 'blur-background' : ''} ${showProfile ? 'blur-background' : ''}`}>
      <Header 
        onNotificationToggle={handleNotificationToggle}
        onProfileToggle={handleProfileToggle}
      />

      {showNotifications && (
        <>
          <div className="notification-overlay" onClick={handleNotificationClose}></div>
          <div className="notification-popup">
            <div className="notification-header">
              <h3>Notifications</h3>
              <button className="close-btn" onClick={handleNotificationClose}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="notification-list">
              {notifications.map((notification) => (
                <div key={notification.id} className={`notification-item ${notification.unread ? 'unread' : ''}`}>
                  <div className="notification-icon">
                    <i className={`fa ${
                      notification.type === 'report' ? 'fa-file' :
                      notification.type === 'approval' ? 'fa-check-circle' :
                      'fa-cog'
                    }`}></i>
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {notification.unread && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
            <div className="notification-footer">
              <button className="mark-all-read">Mark all as read</button>
              <button className="view-all">View all notifications</button>
            </div>
          </div>
        </>
      )}

      {showProfile && (
        <UserProfile onClose={handleProfileClose} />
      )}

      <div className="dashboard-content">
        <AcademicSidebar 
          activeItem={activeNavItem} 
          onNavigate={handleNavigation} 
          isDarkMode={true}
        />

        <main className="dashboard-main">
          <h2 className="page-title">Reports & Documents</h2>

          {/* Statistics Cards - matching Dashboard style */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <i className="fas fa-file-alt"></i>
              <h3>{documents.length}</h3>
              <p>Total Documents</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-eye"></i>
              <h3>{documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}</h3>
              <p>Total Downloads</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-check-circle"></i>
              <h3>{documents.filter(doc => doc.status === 'Published').length}</h3>
              <p>Published</p>
            </div>
            <div className="stat-card">
              <i className="fas fa-clock"></i>
              <h3>{documents.filter(doc => doc.status === 'Draft' || doc.status === 'Review').length}</h3>
              <p>Pending</p>
            </div>
          </div>

          {/* Documents Section - matching Dashboard style */}
          <section className="timeline-section">
            <div className="section-header">
              <h3>Document Management</h3>
              <button className="upload-btn">
                <i className="fas fa-upload"></i>
                Upload
              </button>
            </div>
            
            <div className="documents-table">
              <div className="table-header">
                <div className="table-cell table-cell-docname">Document Name</div>
                <div className="table-cell">Upload Date</div>
                <div className="table-cell">Size</div>
                <div className="table-cell">Status</div>
                <div className="table-cell">Actions</div>
              </div>

              {documents.map(document => (
                <div key={document.id} className="table-row">
                  <div className="table-cell document-info">
                    <i className={`fas ${getFileTypeIcon(document.fileType)} file-icon`}></i>
                    <div className="document-details">
                      <div className="document-name">{document.name}</div>
                      <div className="document-category">{document.category}</div>
                    </div>
                  </div>
                  <div className="table-cell">{document.uploadDate}</div>
                  <div className="table-cell">{document.fileSize}</div>
                  <div className="table-cell">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(document.status) }}
                    >
                      {document.status}
                    </span>
                  </div>
                  <div className="table-cell actions-container">
                    <button className="action-btn" title="Download">
                      <i className="fas fa-download"></i>
                    </button>
                    <button className="action-btn" title="Delete">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* CSS Styles - matching Dashboard */}
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

        /* Dashboard Stats */
        .dashboard-stats {
          margin-top: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          padding: 20px 16px;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: white;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        .stat-card i {
          font-size: 24px;
          margin-bottom: 12px;
          opacity: 0.9;
          display: block;
          transition: color 0.3s ease;
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-card h3 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.02em;
          transition: color 0.3s ease;
          color: #ffffff;
        }

        .stat-card p {
          margin: 0;
          font-weight: 500;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: color 0.3s ease;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Timeline Section (used for documents) */
        .timeline-section {
          padding: 20px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          transition: border-color 0.3s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .section-header h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          transition: color 0.3s ease;
          color: #ffffff;
        }

        .upload-btn {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border: none;
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .upload-btn:hover {
          background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
          transform: translateY(-1px);
        }

        /* Documents Table */
        .documents-table {
          display: flex;
          flex-direction: column;
        }

        .table-header, .table-row {
          display: flex;
          padding: 16px 0;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .table-header {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .table-cell {
          flex: 1;
          padding: 0 12px;
          text-align: left;
        }

        .table-cell-docname {
          flex: 2;
        }

        .document-info {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
        }

        .file-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
          color: #ef4444;
        }

        .document-details {
          display: flex;
          flex-direction: column;
        }

        .document-name {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .document-category {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 16px;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          min-width: 70px;
          text-align: center;
          border: 1px solid transparent;
          color: white;
        }

        .actions-container {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-1px);
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
          
          .dashboard-stats {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 12px;
          }
          
          .stat-card {
            padding: 16px 12px;
          }
          
          .stat-card h3 {
            font-size: 24px;
          }
          
          .notification-popup {
            right: 12px;
            left: 12px;
            width: auto;
            top: 90px;
          }
          
          .table-header {
            display: none;
          }
          
          .table-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 20px 0;
          }
          
          .table-cell {
            width: 100%;
            padding: 0;
          }
          
          .actions-container {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}