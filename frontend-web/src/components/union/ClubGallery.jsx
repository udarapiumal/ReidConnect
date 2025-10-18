import React, { useEffect, useState } from 'react';
import ClubCard from './ClubCard';
import '../../css/Clubgallery.css';
import axios from 'axios';

const ClubGallery = () => {
  const [clubs, setClubs] = useState([]);

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
      {/* Header Section */}
      <div className="gallery-header">
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
