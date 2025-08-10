import React from 'react';

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}