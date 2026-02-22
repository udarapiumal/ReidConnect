import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function UnionDashboard() {
  const [dashboardStats, setDashboardStats] = useState({
    totalClubs: 0,
    totalStudentProfiles: 0,
    totalBookings: 0,
    fullyApprovedBookings: 0,
    pendingBookings: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      const statsResponse = await fetch(`${API_BASE_URL}/bookings/dashboard/stats`, { headers });
      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
      }
      const stats = await statsResponse.json();
      setDashboardStats(stats);

      const activitiesResponse = await fetch(`${API_BASE_URL}/bookings/dashboard/approved`, { headers });
      if (!activitiesResponse.ok) {
        throw new Error(`Failed to fetch activities: ${activitiesResponse.status}`);
      }
      const bookings = await activitiesResponse.json();

      const activities = bookings.slice(0, 5).map((booking) => ({
        id: booking.id,
        type: 'booking',
        message: `${booking.clubName} - ${booking.venue?.name || 'Venue'} booking approved`,
        time: formatTime(booking.date),
        status: 'success',
        reason: booking.reason,
        contactNumber: booking.contactNumber,
        registrationNumber: booking.registrationNumber
      }));

      setRecentActivities(activities);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Unknown time';

    const bookingDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - bookingDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#22c55e';
      case 'warning': return '#eab308';
      case 'pending': return '#f97316';
      case 'info': return '#3b82f6';
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <header className="header">
          <div className="header-left">
            <span className="title">ReidConnect</span>
            <span className="title highlight">UnionAdmin</span>
          </div>
        </header>
        <div className="dashboard-content">
          <Sidebar />
          <main className="dashboard-main">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '1.1rem'
            }}>
              Loading dashboard data...
            </div>
          </main>
        </div>
        <style>{embeddedCSS}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <header className="header">
          <div className="header-left">
            <span className="title">ReidConnect</span>
            <span className="title highlight">UnionAdmin</span>
          </div>
        </header>
        <div className="dashboard-content">
          <Sidebar />
          <main className="dashboard-main">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
              color: '#fff'
            }}>
              <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '1.2rem' }}>
                Error loading dashboard data
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>
                {error}
              </div>
              <button className="btn-primary" onClick={fetchDashboardData}>
                Retry
              </button>
            </div>
          </main>
        </div>
        <style>{embeddedCSS}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="header-left">
          <span className="title">ReidConnect</span>
          <span className="title highlight">UnionAdmin</span>
        </div>
        <div className="header-right">
          <button className="refresh-btn" onClick={fetchDashboardData}>
            <i className="fa fa-refresh"></i>
            Refresh
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <Sidebar />
        <main className="dashboard-main">
          <h2 className="page-title">Dashboard Overview</h2>

          <div className="dashboard-stats">
            <div className="stat-card">
              <i className="fa-solid fa-people-group stat-icon"></i>
              <h3>{dashboardStats.totalClubs}</h3>
              <p>Total Clubs</p>
            </div>
            <div className="stat-card">
              <i className="fa-solid fa-user-gear stat-icon"></i>
              <h3>{dashboardStats.totalStudentProfiles}</h3>
              <p>Student Profiles</p>
            </div>
            <div className="stat-card">
              <i className="fa-solid fa-calendar-check stat-icon"></i>
              <h3>{dashboardStats.fullyApprovedBookings}</h3>
              <p>Approved Bookings</p>
            </div>
          </div>

          {/* Recent Activities Section */}
          <div className="activities-section">
            <h3 className="activities-title">Recent Approved Venue Bookings</h3>
            <div className="activities-card">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id} className={`activity-row ${index < recentActivities.length - 1 ? 'activity-row-border' : ''}`}>
                    <div className="activity-info">
                      <div className="activity-message">
                        {activity.message}
                      </div>
                      {activity.reason && (
                        <div className="activity-detail">Purpose: {activity.reason}</div>
                      )}
                      {activity.contactNumber && (
                        <div className="activity-detail">Contact: {activity.contactNumber}</div>
                      )}
                      {activity.registrationNumber && (
                        <div className="activity-detail">Registration: {activity.registrationNumber}</div>
                      )}
                    </div>
                    <div className="activity-meta">
                      <span className="activity-time">{activity.time}</span>
                      <span
                        className="activity-status"
                        style={{
                          color: getStatusColor(activity.status),
                          background: getStatusColor(activity.status) + '18',
                        }}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="activities-empty">
                  No approved venue bookings found
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <style>{embeddedCSS}</style>
    </div>
  );
}

const embeddedCSS = `
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

  .header-left {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .title {
    font-weight: 700;
    font-size: 22px;
    letter-spacing: -0.02em;
    color: white;
  }

  .title.highlight {
    color: #FF453A;
    background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .refresh-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 10px 18px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .refresh-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: white;
    transform: translateY(-1px);
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
    max-width: calc(100vw - 240px);
  }

  .page-title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 32px;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #ffffff 0%, #e5e5e5 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .dashboard-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 40px;
  }

  .stat-card {
    padding: 28px 20px;
    border-radius: 16px;
    text-align: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .stat-icon {
    font-size: 28px;
    margin-bottom: 14px;
    display: block;
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
    color: #ffffff;
  }

  .stat-card p {
    margin: 0;
    font-weight: 500;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.6);
  }

  .activities-section {
    margin-top: 8px;
  }

  .activities-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
  }

  .activities-card {
    background: linear-gradient(145deg, #2a2a2a 0%, #252525 100%);
    border-radius: 16px;
    padding: 8px 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .activity-row {
    display: flex;
    align-items: flex-start;
    padding: 16px 0;
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.9);
    min-height: 40px;
  }

  .activity-row-border {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .activity-info {
    flex: 1;
  }

  .activity-message {
    font-weight: 500;
    margin-bottom: 6px;
  }

  .activity-detail {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 2px;
  }

  .activity-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
  }

  .activity-time {
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.4);
  }

  .activity-status {
    font-weight: 600;
    font-size: 0.85rem;
    min-width: 70px;
    text-transform: capitalize;
    border-radius: 20px;
    padding: 4px 14px;
    display: inline-block;
    text-align: center;
  }

  .activities-empty {
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
    padding: 32px;
    font-size: 0.95rem;
  }

  .btn-primary {
    background: linear-gradient(135deg, #FF453A 0%, #ea580c 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(249, 115, 22, 0.25);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(249, 115, 22, 0.4);
  }

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
      margin-bottom: 24px;
    }
    .stat-card {
      padding: 20px 14px;
    }
    .stat-card h3 {
      font-size: 24px;
    }
  }
`;