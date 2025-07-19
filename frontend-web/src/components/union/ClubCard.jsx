import React from 'react';
import '../../css/ClubCard.css'; // Create this CSS file

const ClubCard = ({ club }) => {
  return (
    <div className="club-card">
      <div className="club-image-container">
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
      <div className="club-info">
        <h3>{club.club_name || 'Club Name'}</h3>
        <p className="club-bio">{club.bio || 'No description available'}</p>
        {club.website && (
          <a 
            href={club.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="website-link"
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
};

export default ClubCard;