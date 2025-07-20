import React from 'react';
import '../../css/PostCard.css';

const PostCard = ({ post }) => {
  const { description, mediaPaths } = post;
  const baseUrl = 'http://localhost:8080/';

  return (
    <div className="post-card">
      <div className="card-content">
        {mediaPaths && mediaPaths.length > 0 && (
          <div className="media-container">
            {mediaPaths.map((path, index) => (
              <img
                key={index}
                src={`${baseUrl}${path}`}
                alt={`Post media ${index + 1}`}
                className="post-media-image"
              />
            ))}
          </div>
        )}
        <p className="post-description">{description}</p>
      </div>
    </div>
  );
};

export default PostCard;