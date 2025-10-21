import React, { useEffect, useState } from 'react';
import ClubCard from './ClubCard';
import '../../css/Clubgallery.css';
import axios from 'axios';

const ClubGallery = () => {
  const [clubs, setClubs] = useState([]);

  const styles = {
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
  };

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8080/api/club', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClubs(response.data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="club-gallery-container">
      <header style={styles.headerBar}>
        <div style={styles.headerLeft}>
          <span style={styles.reidConnect}>ReidConnect</span>
          <span style={styles.highlight}>UnionAdmin</span>
        </div>
      </header>
      {/* Content Section */}
      <div className="gallery-header" style={{ marginTop: '70px' }}>
        <div className="gallery-stats">
          <div className="stat-item">
            <span className="stat-label">Total Clubs</span>
            <div className="stat-bar">
              <div className="stat-progress" style={{ width: '100%' }}></div>
              <span className="stat-value">{clubs.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="clubs-table-container">
        {clubs.length === 0 ? (
          <div className="no-clubs">
            <p>No clubs found.</p>
          </div>
        ) : (
          <table className="clubs-table">
            <thead>
              <tr>
                <th className="name-col">
                  <div className="header-content">
                    <span>Name</span>
                  </div>
                </th>
                <th>
                  <div className="header-content">
                    <span>Website</span>
                  </div>
                </th>
                <th>
                  <div className="header-content">
                    <span>Members</span>
                  </div>
                </th>
                <th>
                  <div className="header-content">
                    <span>Bio</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClubGallery;
