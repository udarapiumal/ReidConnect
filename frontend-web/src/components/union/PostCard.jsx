import React, { useState } from 'react';
import '../../css/PostCard.css';

const PostCard = ({ post, onPostStatusChange }) => {
  const { id, description, mediaPaths, created_at, title, active } = post;
  const baseUrl = 'http://localhost:8080/';
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleStatusChange = async (newStatus) => {
    const confirmMessage = newStatus
      ? 'Are you sure you want to activate this post?'
      : 'Are you sure you want to deactivate this post?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      const url = `${baseUrl}api/posts/${id}/${newStatus ? 'activate' : 'deactivate'}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log(`✅ Post ${newStatus ? 'activated' : 'deactivated'} successfully`);
        if (onPostStatusChange) {
          onPostStatusChange(id, newStatus);
        }
      } else {
        const errorText = await response.text();
        console.error(`❌ ${newStatus ? 'Activation' : 'Deactivation'} failed:`, errorText);
        throw new Error(`Failed to ${newStatus ? 'activate' : 'deactivate'} post: ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Error ${newStatus ? 'activating' : 'deactivating'} post:`, error);
      alert(`Failed to ${newStatus ? 'activate' : 'deactivate'} post. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle active state including string and boolean types
  const isActive = active === true || active === 'true';

  return (
    <div className={`post-card ${isActive ? 'active' : 'deactivated'}`}>
      {mediaPaths && mediaPaths.length > 0 && (
        <div className="post-media-wrapper">
          <img
            src={`${baseUrl}api/posts/${mediaPaths[0]}`}
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
        <div className="post-header">
          <h3 className="post-title">{title}</h3>
          <button
            className={isActive ? 'deactivate-button' : 'activate-button'}
            onClick={() => handleStatusChange(!isActive)}
            disabled={isProcessing}
            title={isActive ? 'Deactivate this post' : 'Activate this post'}
          >
            {isProcessing ? '⏳' : isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>

        {isActive ? (
          <>
            <p className="post-description">
              {description || 'No description provided.'}
            </p>

            <div className="post-footer">
              <span className="post-date">{formatDate(created_at)}</span>
              <span className="post-status">Active</span>
            </div>
          </>
        ) : (
          <div className="deactivated-notice">
            <span>This post has been deactivated</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
