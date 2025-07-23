import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/ClubCard.css';

const baseUrl = 'http://localhost:8080';

const ClubCard = ({ club, isSelected, onSelect }) => {
  const navigate = useNavigate();

  const truncateText = (text, maxLength = 50) => {
    if (!text) return 'No bio available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatWebsiteUrl = (url) => {
    if (!url) return null;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

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

  const handleRowClick = (e) => {
    if (e.target.type === 'checkbox' || e.target.tagName === 'A' || e.target.closest('input')) {
      return;
    }
    navigate(`/club/${club.id}`);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <tr
      className={`club-row ${isSelected ? 'selected' : ''}`}
      onClick={handleRowClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Profile Picture & Name */}
      <td className="name-col">
        <div className="club-name-cell">
          <div className="club-avatar">
            <img
              src={club.profilePicture ? `${baseUrl}${club.profilePicture}` : "/default-profile.png"}
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

      {/* Bio */}
      <td className="bio-col">
        <span className="club-bio" title={club.bio || 'No bio available'}>
          {truncateText(club.bio)}
        </span>
      </td>

      {/* Members */}
      <td className="members-col">
        <span>--</span>
      </td>

      {/* Created (used club.bio for now as placeholder) */}
      <td className="created-col">
        <span title={club.bio}>{club.bio}</span>
      </td>

      {/* Owner Info */}
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
