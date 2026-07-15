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

  // API base URL - adjust according to your backend configuration
  const API_BASE_URL = 'http://35.209.196.254:8080/api'; // Change this to your actual backend URL

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get JWT token from localStorage
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Include JWT token
      };

      // Fetch dashboard statistics
      const statsResponse = await fetch(`${API_BASE_URL}/bookings/dashboard/stats`, { headers });
      if (!statsResponse.ok) {
        throw new Error(`Failed to fetch stats: ${statsResponse.status}`);
      }
      const stats = await statsResponse.json();
      setDashboardStats(stats);

      // Fetch recent approved bookings for activities
      const activitiesResponse = await fetch(`${API_BASE_URL}/bookings/dashboard/approved`, { headers });
      if (!activitiesResponse.ok) {
        throw new Error(`Failed to fetch activities: ${activitiesResponse.status}`);
      }
      const bookings = await activitiesResponse.json();

      // Transform bookings to activities format
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
      case 'success': return '#22c55e'; // green
      case 'warning': return '#eab308'; // yellow
      case 'pending': return '#f97316'; // orange
      case 'info': return '#3b82f6'; // blue
      default: return '#64748b'; // slate
    }
  };

  if (loading) {
    return (
      <div style={styles.dashboardContainer}>
        <Sidebar />
        <div style={styles.contentWrapper}>
          <header style={styles.headerBar}>
            <div style={styles.headerLeft}>
              <span style={styles.reidConnect}>ReidConnect</span>
              <span style={styles.highlight}>UnionAdmin</span>
            </div>
            <div style={styles.adminInfo}>
              <i className="fa fa-bell" style={styles.headerIcon}></i>
              <i className="fa fa-user" style={styles.headerIcon}></i>
              <span>Admin</span>
            </div>
          </header>
          <main style={styles.dashboardMain}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
              color: '#fff',
              fontSize: '1.2rem'
            }}>
              Loading dashboard data...
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.dashboardContainer}>
        <Sidebar />
        <div style={styles.contentWrapper}>
          <header style={styles.headerBar}>
            <div style={styles.headerLeft}>
              <span style={styles.reidConnect}>ReidConnect</span>
              <span style={styles.highlight}>UnionAdmin</span>
            </div>
            <div style={styles.adminInfo}>
              <i className="fa fa-bell" style={styles.headerIcon}></i>
              <i className="fa fa-user" style={styles.headerIcon}></i>
              <span>Admin</span>
            </div>
          </header>
          <main style={styles.dashboardMain}>
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
              <div style={{ color: '#a1a1aa', marginBottom: '24px' }}>
                {error}
              </div>
              <button 
                onClick={fetchDashboardData}
                style={{
                  background: '#FF0033',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboardContainer}>
      <Sidebar />
      <div style={styles.contentWrapper}>
        <header style={styles.headerBar}>
          <div style={styles.headerLeft}>
            <span style={styles.reidConnect}>ReidConnect</span>
            <span style={styles.highlight}>UnionAdmin</span>
          </div>
          <div style={styles.adminInfo}>
            
            
          </div>
        </header>
        <main style={styles.dashboardMain}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.03em',
            }}>Dashboard Overview</h2>
            <button 
              onClick={fetchDashboardData}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <i className="fa fa-refresh"></i>
              Refresh
            </button>
          </div>

          <div style={styles.dashboardStats}>
  <div style={styles.statCard}>
    <i className="fa-solid fa-people-group" style={{...styles.statIcon, color: '#fff'}}></i>
    <div style={styles.statAmount}>{dashboardStats.totalClubs}</div>
    <h3 style={styles.statTitle}>Total Clubs</h3>
  </div>
  <div style={styles.statCard}>
    <i className="fa-solid fa-user-gear" style={{...styles.statIcon, color: '#fff'}}></i>
    <div style={styles.statAmount}>{dashboardStats.totalStudentProfiles}</div>
    <h3 style={styles.statTitle}>Student Profiles</h3>
  </div>
  <div style={styles.statCard}>
    <i className="fa-solid fa-calendar-check" style={{...styles.statIcon, color: '#fff'}}></i>
    <div style={styles.statAmount}>{dashboardStats.fullyApprovedBookings}</div>
    <h3 style={styles.statTitle}>Approved Bookings</h3>
  </div>
</div>

          {/* Recent Activities Section */}
          <div style={styles.activitiesSection}>
            <h3 style={styles.activitiesTitle}>Recent Approved Venue Bookings</h3>
            <div style={{
              background: '#232323',
              borderRadius: '10px',
              padding: '18px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)',
              border: '1px solid #232323',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '12px 0',
                    borderBottom: recentActivities.indexOf(activity) < recentActivities.length - 1 ? '1px solid #282828' : 'none',
                    fontSize: '1rem',
                    color: '#e5e7eb',
                    background: 'none',
                    borderRadius: 0,
                    minHeight: '40px',
                  }}>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '500', marginBottom: '6px'}}>
                        {activity.message}
                      </div>
                      {activity.reason && (
                        <div style={{fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '2px'}}>
                          Purpose: {activity.reason}
                        </div>
                      )}
                      {activity.contactNumber && (
                        <div style={{fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '2px'}}>
                          Contact: {activity.contactNumber}
                        </div>
                      )}
                      {activity.registrationNumber && (
                        <div style={{fontSize: '0.9rem', color: '#a1a1aa'}}>
                          Registration: {activity.registrationNumber}
                        </div>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '0.92rem',
                        color: '#8e9297',
                      }}>{activity.time}</span>
                      <span style={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        color: getStatusColor(activity.status),
                        minWidth: '70px',
                        textTransform: 'capitalize',
                        background: getStatusColor(activity.status) + '22',
                        border: 'none',
                        borderRadius: '16px',
                        padding: '4px 16px',
                        display: 'inline-block',
                        textAlign: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                      }}>{activity.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#a1a1aa',
                  padding: '32px',
                  fontSize: '1rem'
                }}>
                  No approved venue bookings found
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    fontFamily: 'Inter, Segoe UI, Roboto, sans-serif',
    display: 'flex',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: 'white',
  },
  contentWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    marginLeft: '220px',
    transition: 'margin-left 0.2s',
  },
  headerBar: {
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
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
  },
  reidConnect: {
    fontWeight: 700,
    fontSize: '22px',
    color: 'white',
    letterSpacing: '-0.02em',
  },
  highlight: {
    fontWeight: 700,
    fontSize: '22px',
    color: '#FF0033',
    background: 'linear-gradient(135deg, #FF0033 0%, #ea580c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginLeft: '0px',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    color: 'rgba(255,255,255,0.8)',
  },
  headerIcon: {
    fontSize: '18px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'color 0.3s',
    color: '#fff',
  },
  dashboardMain: {
    flex: 1,
    padding: '40px',
    marginTop: '70px',
    overflowY: 'auto',
    minHeight: 'calc(100vh - 70px)',
  },
  dashboardStats: {
    display: 'flex',
    gap: '32px',
    marginTop: '24px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 220px',
    background: 'linear-gradient(145deg, #2a2a2a 0%, #252525 100%)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '220px',
    maxWidth: '320px',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    fontSize: '2.5rem',
    color: '#fff',
    marginBottom: '16px',
    transition: 'color 0.3s',
  },
  statAmount: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '8px',
  },
  statTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#FF0033',
  },
  activitiesSection: {
    marginTop: '16px',
  },
  activitiesTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '12px',
  },
};