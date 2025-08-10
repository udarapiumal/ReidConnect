import React from 'react';
import { timeUtils } from '../utils/timeUtils';
import EditableScheduleItem from './EditableScheduleItem';

export default function EditableScheduleCell({ 
  day, 
  timeSlot, 
  timetableData, 
  isSelected, 
  onCellSelect, 
  onEditEntry, 
  onDeleteEntry 
}) {
  const classesInSlot = timeUtils.getClassesForTimeSlot(day, timeSlot, timetableData);
  
  // Only show lunch break if there are no classes in this slot
  if (timeSlot.start === "12:00" && classesInSlot.length === 0) {
    return (
      <div className="lunch-break">
        Lunch Break
      </div>
    );
  }

  const handleCellClick = () => {
    if (classesInSlot.length === 0) {
      onCellSelect(day, timeSlot);
    }
  };
  
  return (
    <div 
      className={`schedule-cell editable-cell ${isSelected ? 'selected' : ''} ${classesInSlot.length === 0 ? 'empty-cell' : ''}`}
      onClick={handleCellClick}
    >
      {classesInSlot.map(item => {
        // Check if this time slot is the start of the class
        const itemStartMinutes = timeUtils.timeToMinutes(item.startTime);
        const slotStartMinutes = timeUtils.timeToMinutes(timeSlot.start);
        
        // Only render if this is the starting time slot for the class
        if (itemStartMinutes === slotStartMinutes) {
          return (
            <EditableScheduleItem
              key={`${item.id}-${item.courseCode}`}
              item={item}
              onEdit={onEditEntry}
              onDelete={onDeleteEntry}
            />
          );
        }
        return null;
      })}
    </div>
  );
}
