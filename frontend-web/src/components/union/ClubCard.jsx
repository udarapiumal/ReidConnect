import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/ClubCard.css';

const baseUrl = 'http://localhost:8080';
const ClubCard = ({ club, isSelected, onSelect }) => {
  const navigate = useNavigate();

  // Helper function to truncate bio text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'No bio available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Helper function to format website URL
  const formatWebsiteUrl = (url) => {
    if (!url) return null;
        
    // Add https:// if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  // Helper function to get domain name from URL
  const getDomainName = (url) => {
    if (!url) return 'No website';
    try {
      const formattedUrl = formatWebsiteUrl(url);
      const domain = new URL(formattedUrl).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Handle row click to navigate to club detail page
  const handleRowClick = (e) => {
    // Prevent navigation if clicking on checkbox, links, or interactive elements
    if (e.target.type === 'checkbox' || e.target.tagName === 'A' || e.target.closest('input')) {
      return;
    }
    navigate(`/club/${club.id}`);
  };

  // Handle checkbox click separately
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  return (
   <tr className={`club-row ${isSelected ? 'selected' : ''}`} onClick={handleRowClick} style={{ cursor: 'pointer' }}>
  {/* Name */}
  <td className="name-col">
    <div className="club-name-cell">
      <div className="club-avatar">
        <img
          src={`${baseUrl}${club.profilePicture}`}
          alt={`${club.clubName || 'Club'} profile`}
          className="club-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-profile.png";
          }}
        />
      </div>
      <span className="club-name">{club.clubName || 'Unnamed Club'}</span>
    </div>
  </td>

  {/* Website */}
  <td className="website-col">
    {club.website ? (
      <a 
        href={formatWebsiteUrl(club.website)}
        target="_blank"
        rel="noopener noreferrer"
        className="website-link"
        title={club.website}
        onClick={(e) => e.stopPropagation()}
      >
        {getDomainName(club.website)}
      </a>
    ) : (
      <span className="no-website">No website</span>
    )}
  </td>

  {/* Members — you can replace this with actual member count if available */}
  <td className="members-col">
    {/* Placeholder text for now */}
    <span>--</span>
  </td>

  {/* Created — replace with club.createdAt if available */}
  <td className="created-col">
    <span title={club.bio}>
      {club.bio}
    </span>
  </td>

  {/* Status — owner info */}
  <td className="owner-col">
    <div className="owner-cell">
      {club.user ? (
        <>
          <span className="owner-name">
            {club.user.firstName && club.user.lastName
              ? `${club.user.firstName} ${club.user.lastName}`
              : club.user.username || club.user.email || 'Unknown User'}
          </span>
          {club.user.email && (
            <span className="owner-email" title={club.user.email}>
              {club.user.email}
            </span>
          )}
        </>
      ) : (
        <span className="no-owner">No owner info</span>
      )}
    </div>
  </td>
</tr>

  );
};

export default ClubCard;