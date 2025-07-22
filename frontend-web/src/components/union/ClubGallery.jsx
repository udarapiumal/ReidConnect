import React, { useEffect, useState } from 'react';
import ClubCard from './ClubCard';
import '../../css/Clubgallery.css'
import axios from 'axios';

const ClubGallery = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClubs, setSelectedClubs] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

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

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedClubs(new Set());
    } else {
      setSelectedClubs(new Set(clubs.map(club => club.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectClub = (clubId) => {
    const newSelected = new Set(selectedClubs);
    if (newSelected.has(clubId)) {
      newSelected.delete(clubId);
    } else {
      newSelected.add(clubId);
    }
    setSelectedClubs(newSelected);
    setSelectAll(newSelected.size === clubs.length);
  };

  return (
    <div className="club-gallery-container">
      <div className="gallery-header">
        <div className="gallery-stats">
          <div className="stat-item">
            <span className="stat-label">Total Clubs</span>
            <div className="stat-bar">
              <div className="stat-progress" style={{width: '100%'}}></div>
              <span className="stat-value">{clubs.length}</span>
            </div>
          </div>
        </div>
        
        <div className="gallery-controls">
          <div className="control-group">
            <button className="control-btn">
              <span>Columns</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.5 12.5L8 9l3.5 3.5"/>
              </svg>
            </button>
            <button className="control-btn">
              <span>Category</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.5 12.5L8 9l3.5 3.5"/>
              </svg>
            </button>
            <button className="control-btn">
              <span>Status</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.5 12.5L8 9l3.5 3.5"/>
              </svg>
            </button>
            <div className="search-container">
              <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
              <input type="text" placeholder="Search" className="search-input" />
            </div>
          </div>
          
          <div className="action-controls">
            <button className="add-btn">+</button>
            <button className="export-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="clubs-table-container">
        {clubs.length === 0 ? (
          <div className="no-clubs">
            <p>No clubs found.</p>
          </div>
        ) : (
          <table className="clubs-table">
           <thead>
  <tr>
    {/* Remove this Category column */}
    {/* <th>
      <div className="header-content">
        <span>Category</span>
        <svg className="sort-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3.5 9.5L6 7l2.5 2.5"/>
        </svg>
      </div>
    </th> */}

    <th className="name-col">
      <div className="header-content">
        <span>Name</span>
        <svg className="sort-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3.5 9.5L6 7l2.5 2.5"/>
        </svg>
      </div>
    </th>
    
    <th>
      <div className="header-content">
        <span>Website</span>
        <svg className="sort-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3.5 9.5L6 7l2.5 2.5"/>
        </svg>
      </div>
    </th>

    <th>
      <div className="header-content">
        <span>Members</span>
        <svg className="sort-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3.5 9.5L6 7l2.5 2.5"/>
        </svg>
      </div>
    </th>

    <th>
      <div className="header-content">
        <span>Bio</span>
        <svg className="sort-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3.5 9.5L6 7l2.5 2.5"/>
        </svg>
      </div>
    </th>

    <th>
      <div className="header-content">
        <span>Status</span>
        <svg className="sort-icon" width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M3.5 9.5L6 7l2.5 2.5"/>
        </svg>
      </div>
    </th>
  </tr>
</thead>

            <tbody>
              {clubs.map((club) => (
                <ClubCard 
                  key={club.id} 
                  club={club} 
                  isSelected={selectedClubs.has(club.id)}
                  onSelect={() => handleSelectClub(club.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClubGallery;