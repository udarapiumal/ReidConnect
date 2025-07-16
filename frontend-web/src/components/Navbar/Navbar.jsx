import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <nav className="navbar">
        <h2 className="logo">Reid Connect</h2>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/LostandFound">Lost And Found</Link></li>
          <li><Link to="/search">Profile Management</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {/* Internal CSS styles */}
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #FF0000;
          padding: 1rem 2rem;
        }

        .logo {
          color: #fff;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .nav-links {
          list-style: none;
          display: flex;
          gap: 1.5rem;
          margin: 0;
          padding: 0;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          font-size: 1rem;
        }

        .nav-links a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .nav-links {
            flex-direction: column;
            gap: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
