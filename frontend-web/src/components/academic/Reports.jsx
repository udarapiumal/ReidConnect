import React, { useState } from "react";
import AcademicSidebar from './AcademicSidebar'; // Assuming this is a web React component

export default function Reports() {
  const [activeNavItem, setActiveNavItem] = useState("Reports");

  const handleNavigation = (itemId) => {
    setActiveNavItem(itemId);
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

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="app-title">
            ReidConnect <span className="academic-text">AcademicAdmin</span>
          </h1>
        </div>
        <div className="header-right">
          <div className="header-icons">
            <i className="fas fa-bell icon"></i>
            <i className="fas fa-user icon"></i>
          </div>
          <span className="admin-text">Admin</span>
        </div>
      </header>

      {/* Content */}
      <div className="content">
        <AcademicSidebar activeItem={activeNavItem} onNavigate={handleNavigation} />

        <main className="main-content">
          {/* Page Header */}
          <div className="page-header">
            <h2 className="page-title">Reports & Documents</h2>
            <button className="upload-btn">
              <i className="fas fa-upload btn-icon"></i>
              <span className="btn-text">Upload</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <section className="stats-section">
            <div className="stats-card">
              <i className="fas fa-file-alt stats-icon"></i>
              <div className="stats-content">
                <div className="stats-number">{documents.length}</div>
                <div className="stats-label">Total Documents</div>
              </div>
            </div>

            <div className="stats-card">
              <i className="fas fa-eye stats-icon"></i>
              <div className="stats-content">
                <div className="stats-number">{documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}</div>
                <div className="stats-label">Total Downloads</div>
              </div>
            </div>

            <div className="stats-card">
              <i className="fas fa-check-circle stats-icon"></i>
              <div className="stats-content">
                <div className="stats-number">{documents.filter(doc => doc.status === 'Published').length}</div>
                <div className="stats-label">Published</div>
              </div>
            </div>

            <div className="stats-card">
              <i className="fas fa-clock stats-icon"></i>
              <div className="stats-content">
                <div className="stats-number">{documents.filter(doc => doc.status === 'Draft' || doc.status === 'Review').length}</div>
                <div className="stats-label">Pending</div>
              </div>
            </div>
          </section>

          {/* Documents Table */}
          <section className="documents-section">
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
                    <div className="document-type">{document.fileType}</div>
                  </div>
                </div>
                <div className="table-cell">{document.uploadDate}</div>
                <div className="table-cell">{document.fileSize}</div>
                <div className="table-cell status-container">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(document.status) }}
                  >
                    {document.status}
                  </span>
                </div>
                <div className="table-cell actions-container">
                  <button className="action-btn" title="Download">
                    <i className="fas fa-download action-icon"></i>
                  </button>
                  <button className="action-btn" title="Delete">
                    <i className="fas fa-trash action-icon"></i>
                  </button>
                </div>
              </div>
            ))}
          </section>
        </main>
      </div>

      {/* Add your CSS below or import a CSS file */}
      <style>{`
        /* Container */
        .container {
          background-color: #1a1a1a;
          min-height: 100vh;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background-color: #2a2a2a;
          border-bottom: 1px solid #333;
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          z-index: 1001;
        }
        .header-left {
          flex: 1;
        }
        .app-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
          color: white;
        }
        .academic-text {
          color: #ef4444;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
          color: white;
        }
        .header-icons {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .icon {
          font-size: 20px;
          color: white;
          cursor: pointer;
        }
        .admin-text {
          font-size: 16px;
        }
        /* Content */
        .content {
          display: flex;
          margin-top: 64px;
        }
        /* Main Content */
        .main-content {
          flex: 1;
          padding: 32px;
          background-color: #1a1a1a;
          margin-left: 200px; /* Assuming sidebar width */
          min-height: calc(100vh - 64px);
          overflow-y: auto;
        }
        /* Page Header */
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .page-title {
          font-size: 32px;
          font-weight: bold;
          margin: 0;
        }
        .upload-btn {
          background-color: #ef4444;
          border: none;
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        .upload-btn:hover {
          background-color: #dc2626;
        }
        .btn-icon {
          font-size: 14px;
        }
        /* Stats Section */
        .stats-section {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .stats-card {
          flex: 1 1 200px;
          background-color: #2a2a2a;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid #333;
        }
        .stats-icon {
          font-size: 24px;
          color: #60a5fa;
          flex-shrink: 0;
        }
        .stats-content {
          flex: 1;
        }
        .stats-number {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .stats-label {
          font-size: 14px;
          color: #ccc;
        }
        /* Documents Section */
        .documents-section {
          background-color: #2a2a2a;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #333;
        }
        .table-header, .table-row {
          display: flex;
          padding: 16px 20px;
          align-items: center;
          color: #ccc;
          font-size: 14px;
        }
        .table-header {
          background-color: #333;
          font-weight: 600;
          color: #ccc;
        }
        .table-cell {
          flex: 1;
          text-align: left;
          overflow-wrap: anywhere;
        }
        .table-cell-docname {
          flex: 2;
        }
        .document-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 2;
          color: white;
          font-weight: 500;
        }
        .file-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
          color: white;
          flex-shrink: 0;
        }
        .document-details {
          display: flex;
          flex-direction: column;
        }
        .document-name {
          font-size: 14px;
          margin-bottom: 2px;
        }
        .document-type {
          font-size: 12px;
          color: #888;
        }
        .status-container {
          flex: 1;
          text-align: left;
        }
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-weight: 500;
          font-size: 12px;
          display: inline-block;
          min-width: 80px;
          text-align: center;
        }
        .actions-container {
          flex: 1;
          display: flex;
          gap: 8px;
          justify-content: flex-start;
        }
        .action-btn {
          background-color: #333;
          border: none;
          padding: 8px;
          border-radius: 6px;
          color: #ccc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        .action-btn:hover {
          background-color: #555;
          color: white;
        }
      `}</style>
    </div>
  );
}
