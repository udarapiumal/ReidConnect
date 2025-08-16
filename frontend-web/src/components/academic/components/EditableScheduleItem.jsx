import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { timeUtils } from '../utils/timeUtils';

export default function EditableScheduleItem({ item, onEdit, onDelete }) {
  const duration = timeUtils.calculateDuration(item.startTime, item.endTime);
  
  const getTypeColor = (type) => {
    switch (type) {
      case 'LECTURE': return '#60a5fa'; // blue
      case 'PRACTICAL': return '#34d399'; // green
      case 'TUTORIAL': return '#fbbf24'; // yellow
      default: return '#9ca3af'; // gray
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(item);
  };

  return (
    <div
      className="schedule-item editable-item"
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
      <div className="item-actions">
        <button 
          className="edit-item-btn" 
          onClick={handleEdit} 
          title="Edit"
          style={{
            height: '28px',
            width: '28px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '4px',
            padding: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginRight: '4px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 1)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.9)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <Edit2 size={12} color="#374151" />
        </button>
        <button 
          className="delete-item-btn" 
          onClick={handleDelete} 
          title="Delete"
          style={{
            height: '28px',
            width: '28px',
            background: 'rgba(239, 68, 68, 0.9)',
            border: 'none',
            borderRadius: '4px',
            padding: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 1)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(239, 68, 68, 0.9)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <Trash2 size={12} color="white" />
        </button>
      </div>
      
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