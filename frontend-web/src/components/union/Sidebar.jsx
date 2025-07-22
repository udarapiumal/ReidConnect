import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      <div className="sidebar">
        <h2 className="logo">Reid Connect</h2>
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/union/LostandFound"
              className={location.pathname === '/union/LostandFound' ? 'active' : ''}
            >
              Lost and Found
            </Link>
          </li>
          <li>
            <Link
              to="/union/Profilemanagement"
              className={location.pathname === '/union/Profilemanagement' ? 'active' : ''}
            >
              Profile Management
            </Link>
          </li>
           <li>
            <Link
              to="/union/Clubmanagement"
              className={location.pathname === '/union/Clubmanagement' ? 'active' : ''}
            >
              Club Management
            </Link>
          </li>
        </ul>
      </div>

      {/* Sidebar Styles */}
      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 220px;
          background-color: #151718;
          padding: 2rem 1rem;
          display: flex;
          flex-direction: column;
          border-right: 2px solid #FF0033;
          z-index: 1000;
        }

        .logo {
          color: #FF0033;
          font-size: 1.75rem;
          font-weight: bold;
          margin-bottom: 2rem;
          text-align: center;
        }

        .nav-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .nav-links a {
          color: #ffffff;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: background 0.3s ease, color 0.3s ease;
        }

        .nav-links a:hover {
          background-color: #1e1e1e;
          color: #FF0033;
        }

        .nav-links a.active {
          background-color: #1e1e1e;
          color: #FF0033;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: auto;
            flex-direction: row;
            justify-content: space-around;
            border-right: none;
            border-bottom: 2px solid #FF0033;
          }

          .nav-links {
            flex-direction: row;
            gap: 1rem;
          }

          .logo {
            margin-bottom: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
