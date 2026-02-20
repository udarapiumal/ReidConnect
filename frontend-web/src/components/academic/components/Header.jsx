import React from 'react';

export default function Header({ onProfileClick }) {
  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">
          ReidConnect <span className="academic-text">AcademicAdmin</span>
        </h1>
      </div>
      <div className="header-right" onClick={onProfileClick} style={{ cursor: 'pointer' }}>
        <div className="header-icons">
          <i className="fas fa-user icon"></i>
        </div>
        <span className="admin-text">Profile</span>
      </div>
    </header>
  );
}