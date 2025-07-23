import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { label: 'Home', path: '/union/dashboard', icon: 'fa-solid fa-house' },
    { label: 'Lost and Found', path: '/union/LostandFound', icon: 'fa-solid fa-box-open' },
    { label: 'Profile Management', path: '/union/Profilemanagement', icon: 'fa-solid fa-user-gear' },
    { label: 'Club Management', path: '/union/Clubmanagement', icon: 'fa-solid fa-people-group' },
    { label: 'Events', path: '/union/events', icon: 'fa-solid fa-calendar-days' },  // Added Events here
    { label: 'Sign Out', isLogout: true, icon: 'fa-solid fa-right-from-bracket' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear auth token
    navigate('/'); // Redirect to login page (adjust if your login route is different)
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.topSection}>
        <h2 style={styles.sidebarLogo}>Reid Connect</h2>
        <ul style={styles.sidebarNav}>
          {links.map((link) => (
            <li key={link.label} style={styles.navListItem}>
              {link.isLogout ? (
                <button
                  onClick={handleLogout}
                  style={{
                    ...styles.sidebarLink,
                    backgroundColor: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <i className={link.icon} style={styles.navIcon}></i>
                  <span style={styles.navText}>{link.label}</span>
                </button>
              ) : (
                <Link
                  to={link.path}
                  style={{
                    ...styles.sidebarLink,
                    ...(location.pathname === link.path ? styles.sidebarLinkActive : {})
                  }}
                >
                  <i className={link.icon} style={styles.navIcon}></i>
                  <span
                    style={{
                      ...styles.navText,
                      ...(location.pathname === link.path ? styles.navTextActive : {})
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '200px',
    backgroundColor: '#151718',
    padding: '24px 16px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRight: '1px solid #333',
    position: 'fixed',
    top: '0',
    left: 0,
    zIndex: 1000,
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarLogo: {
    color: '#FF0033',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '24px',
    margin: '0 0 24px 0',
  },
  sidebarNav: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navListItem: {
    listStyle: 'none',
  },
  sidebarLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    height: '48px',
    borderRadius: '8px',
    paddingLeft: '12px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '400',
    transition: 'background 0.3s ease',
    backgroundColor: 'transparent',
  },
  sidebarLinkActive: {
    backgroundColor: '#2a2a2a',
  },
  navIcon: {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  navText: {
    fontWeight: '400',
  },
  navTextActive: {
    fontWeight: '500',
  },
};

export default Sidebar;
