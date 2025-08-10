import React from 'react';
import { timeUtils } from '../utils/timeUtils';
import ScheduleItem from './ScheduleItem';

export default function ScheduleCell({ day, timeSlot, timetableData }) {
  const classesInSlot = timeUtils.getClassesForTimeSlot(day, timeSlot, timetableData);
  
  // Only show lunch break if there are no classes in this slot
  if (timeSlot.start === "12:00" && classesInSlot.length === 0) {
    return (
      <div className="lunch-break">
        Lunch Break
      </div>
    );
  }
  
  return (
    <div className="schedule-cell">
      {classesInSlot.map(item => {
        // Check if this time slot is the start of the class
        const itemStartMinutes = timeUtils.timeToMinutes(item.startTime);
        const slotStartMinutes = timeUtils.timeToMinutes(timeSlot.start);
        
        // Only render if this is the starting time slot for the class
        if (itemStartMinutes === slotStartMinutes) {
          return (
            <ScheduleItem
              key={`${item.id}-${item.courseCode}`}
              item={item}
            />
          );
        }
        return null;
      })}
    </div>
  );
}