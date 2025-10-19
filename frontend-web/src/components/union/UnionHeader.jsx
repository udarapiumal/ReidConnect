import React from 'react';

const UnionHeader = () => {
  return (
    <header style={styles.headerBar} className="union-header">
      <div style={styles.headerLeft}>
        <span style={styles.reidConnect}>ReidConnect</span>
        <span style={styles.highlight}>UnionAdmin</span>
      </div>
      <div style={styles.adminInfo}>
        <i className="fa fa-bell" style={styles.headerIcon} aria-hidden="true"></i>
        <i className="fa fa-user" style={styles.headerIcon} aria-hidden="true"></i>
        <span style={{marginLeft:4}}>Admin</span>
      </div>
    </header>
  );
};

const styles = {
  headerBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '64px',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    zIndex: 1200,
    background: 'rgba(20,20,20,0.95)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  reidConnect: {
    fontWeight: 700,
    fontSize: '20px',
    color: 'white'
  },
  highlight: {
    fontWeight: 700,
    fontSize: '20px',
    color: '#FF0033',
    marginLeft: '4px'
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    color: 'rgba(255,255,255,0.85)'
  },
  headerIcon: {
    fontSize: '18px',
    cursor: 'pointer'
  }
};

export default UnionHeader;
