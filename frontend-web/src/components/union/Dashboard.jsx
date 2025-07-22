import React from "react";

export default function UnionDashboard() {
  return (
    <div style={styles.unionDashboardContainer}>
      <h2 style={styles.dashboardHeading}>Union Dashboard</h2>
      
      <div style={styles.dashboardContent}>
        <p>Welcome to the University Student Union Dashboard.</p>
        <p>Here you can manage events, clubs, profiles, and more.</p>
      </div>
    </div>
  );
}

const styles = {
  unionDashboardContainer: {
    marginLeft: '200px', // Matches sidebar width
    marginTop: '0',      // Remove top margin to eliminate blank space
    padding: '2rem',
    paddingTop: '2rem',  // Keep internal padding for content
    backgroundColor: '#1e1e1e',
    minHeight: '100vh',  // Full viewport height
    color: '#ffffff',
  },
  dashboardHeading: {
    fontSize: '1.75rem',
    color: '#FF0033',
    fontWeight: '600',
    marginBottom: '1.5rem',
    margin: '0 0 1.5rem 0',
  },
  dashboardContent: {
    backgroundColor: '#2a2a2a',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  // Note: Media queries need to be handled differently with inline styles
  // You can use react-responsive library or useEffect with window.matchMedia
  // For responsive behavior similar to your original CSS
};