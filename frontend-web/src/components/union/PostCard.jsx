import React from 'react';
import '../../css/PostCard.css';

const PostCard = ({ post }) => {
  const { description, mediaPaths, created_at, title } = post;
  const baseUrl = 'http://localhost:8080/';

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="post-card">
      {mediaPaths && mediaPaths.length > 0 && (
        <div className="post-media-wrapper">
          <img
            src={`${baseUrl}${mediaPaths[0]}`}
            alt="Post"
            className="post-media"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-image.png';
            }}
          />
        </div>
      )}
      
      <div className="post-content">
        <h3 className="post-title">{title}</h3>
        <p className="post-description">
          {description || 'No description provided.'}
        </p>
        <div className="post-footer">
          
          <span className="post-date">{formatDate(created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;