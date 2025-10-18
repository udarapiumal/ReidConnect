import React, { useEffect, useState } from 'react';
import '../styles/StyledAlert.css';

export default function StyledAlert({ message, onClose, timeout = 10000 }) {
  const [timeLeft, setTimeLeft] = useState(timeout);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          onClose();
          return 0;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onClose]);

  const progressPercentage = (timeLeft / timeout) * 100;

  return (
    <div className="styled-alert-overlay">
      <div className="styled-alert">
        <div className="styled-alert-content">
          <div className="styled-alert-header">
            <div className="styled-alert-icon">⚠️</div>
            <strong>Venue Clash Detected</strong>
          </div>
          <div className="styled-alert-message">
            {message}
          </div>
          <button
            onClick={onClose}
            className="styled-alert-close"
            aria-label="Close alert"
          >
            ×
          </button>
        </div>
        <div className="styled-alert-timeout-bar">
          <div 
            className="styled-alert-timeout-progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}