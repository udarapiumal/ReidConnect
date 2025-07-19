import React from 'react';

const ClubCard = ({ club }) => {
  return (
    <div className="club-card">
      <img
        src={club.profile_picture}
        alt={`${club.club_name} profile`}
        className="club-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/default-profile.png";
        }}
      />
      <h3>{club.club_name}</h3>
      <p>{club.bio}</p>
      <a href={club.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
    </div>
  );
};

export default ClubCard;