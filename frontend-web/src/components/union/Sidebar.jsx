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
    { label: 'Events', path: '/union/events', icon: 'fa-solid fa-calendar-days' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.topSection}>
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.path}
            style={{
              ...styles.navItem,
              ...(location.pathname === link.path ? styles.navItemActive : {})
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
        ))}
      </div>
      <div style={styles.bottomSection}>
        <button
          style={styles.logoutButton}
          onClick={handleLogout}
        >
          <i
            className="fa-solid fa-right-from-bracket"
            style={{ marginRight: '10px', fontSize: '16px', color: '#fff' }}
          ></i>
          <span style={styles.logoutText}>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '200px',
    backgroundColor: '#1e1e1e',
    padding: '20px 0',
    height: 'calc(100vh - 70px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRight: '1px solid #333',
    position: 'fixed',
    top: '70px',
    left: 0,
    zIndex: 999,
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    paddingTop: '20px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '48px',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    gap: '16px',
    paddingLeft: '16px',
    paddingRight: '16px',
    cursor: 'pointer',
    fontSize: '14px',
    textAlign: 'left',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    marginBottom: '2px',
  },
  navItemActive: {
    backgroundColor: '#2a2a2a',
    borderLeft: '3px solid #3b82f6',
    color: '#ffffff',
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
  bottomSection: {
    padding: '0 16px 20px 16px',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF453A',
    padding: '12px 16px',
    marginBottom: '10px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.2s ease',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default Sidebar;
