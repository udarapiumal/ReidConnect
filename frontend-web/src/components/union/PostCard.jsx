import React from 'react';
import '../../css/PostCard.css';

const PostCard = ({ post }) => {
  const { description, mediaPaths } = post;

  // Base URL for images — adjust to your backend static resources URL
  const baseUrl = 'http://localhost:8080/';
  console.log(post);

  return (
    <div className="post-card">
      <p>{description}</p>
      
      <div className="media-container">
        {mediaPaths && mediaPaths.length > 0 ? (
          mediaPaths.map((path, index) => (
            
            <img
              key={index}
              src={`${baseUrl}${path}`}
              alt={`Post media ${index + 1}`}
              className="post-media-image"
              
            />
          ))
        ) : (
          <p>No media available</p>
          
        )}
      </div>
    </div>
  );
};

export default PostCard;
