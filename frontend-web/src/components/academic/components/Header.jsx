import React from 'react';

export default function Header() {
  return (
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
  );
}