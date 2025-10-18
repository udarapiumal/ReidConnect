import React from 'react';
import { timeUtils } from '../utils/timeUtils';

export default function ScheduleItem({ item }) {
  const duration = timeUtils.calculateDuration(item.startTime, item.endTime);
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'LECTURE': return '#60a5fa'; // blue
      case 'PRACTICAL': return '#34d399'; // green
      case 'TUTORIAL': return '#fbbf24'; // yellow
      default: return '#9ca3af'; // gray
    }
  };

  return (
    <div
      className="schedule-item"
      style={{
        backgroundColor: getTypeColor(item.courseType),
        height: `${duration * 100}%`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1
      }}
    >
      <div className="course-code">{item.courseCode}</div>
      <div className="course-type">{item.courseType?.charAt(0) || 'L'}</div>
      <div className="course-venue">{item.venue}</div>
      {item.lecturerCodes && (
        <div className="lecturer-code">{item.lecturerCodes}</div>
      )}
      {item.group && item.group !== 'ALL' && (
        <div className="group-info">{item.group}</div>
      )}
    </div>
  );
}