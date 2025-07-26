
import React from "react";
import Sidebar from "./Sidebar";

export default function UnionDashboard() {
  const recentActivities = [
    { id: 6, type: 'faculty', message: 'orientation program scheduled', time: '3 days ago', status: 'pending' },
    { id: 8, type: 'faculty', message: 'seminar on AI announced', time: '1 week ago', status: 'info' },
    { id: 9, type: 'faculty', message: 'lost item: USB drive', time: '1 week ago', status: 'warning' },
    { id: 11, type: 'faculty', message: 'event: Tech Talk scheduled', time: '3 weeks ago', status: 'info' },
    { id: 13, type: 'faculty', message: 'system maintenance completed', time: '1 month ago', status: 'success' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#22c55e'; // green
      case 'warning': return '#eab308'; // yellow
      case 'pending': return '#f97316'; // orange
      case 'info': return '#3b82f6'; // blue
      default: return '#64748b'; // slate
    }
  };

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
          <h2 style={{
            fontSize: styles.activitiesTitle.fontSize,
            fontWeight: styles.activitiesTitle.fontWeight,
            color: '#fff',
            marginBottom: '12px',
            letterSpacing: '-0.03em',
          }}>Dashboard Overview</h2>
          <div style={styles.dashboardStats}>
            <div style={styles.statCard}>
              <i className="fa-solid fa-people-group" style={{...styles.statIcon, color: '#fff'}}></i>
              <div style={styles.statAmount}>12</div>
              <h3 style={styles.statTitle}>Total Clubs</h3>
            </div>
            <div style={styles.statCard}>
              <i className="fa-solid fa-user-gear" style={{...styles.statIcon, color: '#fff'}}></i>
              <div style={styles.statAmount}>120</div>
              <h3 style={styles.statTitle}>Student Profiles</h3>
            </div>
            <div style={styles.statCard}>
              <i className="fa-solid fa-box-open" style={{...styles.statIcon, color: '#fff'}}></i>
              <div style={styles.statAmount}>8</div>
              <h3 style={styles.statTitle}>Lost &amp; Found Items</h3>
            </div>
          </div>
          {/* Recent Activities Section - Professional View */}
          <div style={styles.activitiesSection}>
            <h3 style={styles.activitiesTitle}>Recent Activities</h3>
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
              {recentActivities.map((activity) => (
                <div key={activity.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: '1px solid #282828',
                  fontSize: '1rem',
                  color: '#e5e7eb',
                  background: 'none',
                  borderRadius: 0,
                  minHeight: '32px',
                }}>
                  <span style={{flex: 1}}>{activity.message}</span>
                  <span style={{
                    fontSize: '0.92rem',
                    color: '#8e9297',
                    marginLeft: '16px',
                  }}>{activity.time}</span>
                  <span style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: getStatusColor(activity.status),
                    marginLeft: '16px',
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
                  <br style={{width: '100%'}} />
                </div>
              ))}
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
    marginLeft: '220px', // Increased from 200px to 220px for more space
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
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '800',
    marginBottom: '16px',
    letterSpacing: '-0.03em',
    color: 'white',
    background: 'linear-gradient(135deg, #FF0033 0%, #ea580c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '32px',
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
    color: '#FF0033', // red
  },
  statDesc: {
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
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
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  activityCard: {
    background: 'linear-gradient(135deg, #23272a 0%, #1a1a1a 100%)',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
  },
  activityContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  activityMessage: {
    color: '#fff',
    fontWeight: '500',
    fontSize: '1rem',
    marginBottom: '4px',
  },
  activityTime: {
    color: '#a1a1aa',
    fontSize: '0.95rem',
  },
};