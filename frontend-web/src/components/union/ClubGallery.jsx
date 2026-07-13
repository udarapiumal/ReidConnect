import React, { useEffect, useState } from 'react';
import ClubCard from './ClubCard';
import '../../css/Clubgallery.css';
import axios from 'axios';

const ClubGallery = () => {
  const [clubs, setClubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('https://reidconnect.onrender.com/api/club', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClubs(response.data);
      } catch (error) {
        console.error('Error fetching clubs:', error);
      }
    };
    fetchClubs();
  }, []);

  // Filter clubs based on search term
  const filteredClubs = clubs.filter(club =>
    club.clubName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="club-gallery-container">
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
        backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '0 24px', zIndex: 1200, background: 'rgba(20,20,20,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
          <span style={{ fontWeight: 700, fontSize: '22px', color: 'white' }}>ReidConnect</span>
          <span style={{
            fontWeight: 700, fontSize: '22px',
            color: '#FF0033', background: 'linear-gradient(135deg,#FF0033 0%,#ea580c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginLeft: '0px'
          }}>UnionAdmin</span>
        </div>
      </header>

      <div className="gallery-header" style={{ marginTop: '70px', display: 'flex', justifyContent: 'flex-start', gap: '1rem' }}>
        <div className="search-container" style={{ width: '300px' }}>
          <input
            type="text"
            placeholder="Search club by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="clubs-table-container" style={{ marginTop: '1rem' }}>
        {filteredClubs.length === 0 ? (
          <div className="no-clubs">
            <p>No clubs found.</p>
          </div>
        ) : (
          <table className="clubs-table">
            <thead>
              <tr>
                <th className="name-col">Name</th>
                <th className="website-col">Website</th>
                <th className="members-col">Members</th>
                <th className="bio-col">Bio</th>
                <th className="owner-col">Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.map((club) => (
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
