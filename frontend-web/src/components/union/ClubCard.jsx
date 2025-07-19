import React from 'react';
import '../../css/ClubCard.css';

const ClubCard = ({ club, isSelected, onSelect }) => {
  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const statusClass = status ? status.toLowerCase() : 'active';
    return (
      <span className={`status-badge ${statusClass}`}>
        {status || 'Active'}
      </span>
    );
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Helper function to get location flag (you can expand this with more flags)
  const getLocationFlag = (location) => {
    const flags = {
      'Stockholm': '🇸🇪',
      'Miami': '🇺🇸',
      'Kyiv': '🇺🇦',
      'Ottawa': '🇨🇦',
      'São Paulo': '🇧🇷',
      'London': '🇬🇧',
      'default': '🌍'
    };
    return flags[location] || flags.default;
  };

  return (
    <tr className={`club-row ${isSelected ? 'selected' : ''}`}>
      <td className="checkbox-col">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="table-checkbox"
        />
      </td>
      
      <td className="name-col">
        <div className="club-name-cell">
          <div className="club-avatar">
            <img
              src={club.profile_picture || "/default-profile.png"}
              alt={`${club.club_name || 'Club'} profile`}
              className="club-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/default-profile.png";
              }}
            />
          </div>
          <span className="club-name">{club.club_name || 'Club Name'}</span>
        </div>
      </td>
      
      <td>
        <span className="club-category">{club.category || 'General'}</span>
      </td>
      
      <td>
        <div className="location-cell">
          <span className="location-flag">{getLocationFlag(club.location)}</span>
          {club.website ? (
            <a 
              href={club.website}
              target="_blank"
              rel="noopener noreferrer"
              className="website-link"
            >
              Visit Site
            </a>
          ) : (
            <span className="no-website">No website</span>
          )}
        </div>
      </td>
      
      <td>
        <span className="member-count">{club.member_count || '0'}</span>
      </td>
      
      <td>
        <span className="created-date">{formatDate(club.created_at)}</span>
      </td>
      
      <td>
        {getStatusBadge(club.status)}
      </td>
    </tr>
  );
};

export default ClubCard;