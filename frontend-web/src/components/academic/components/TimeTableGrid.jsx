import React from 'react';
import { timeSlotConfig } from '../utils/timeSlotConfig';
import { timeUtils } from '../utils/timeUtils';
import LoadingSpinner from './LoadingSpinner';
import ScheduleCell from './ScheduleCell';

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export default function TimeTableGrid({ timetableData, loading }) {
  const timeSlots = [
    { start: "08:00", end: "09:00", index: 0 },
    { start: "09:00", end: "10:00", index: 1 },
    { start: "10:00", end: "11:00", index: 2 },
    { start: "11:00", end: "12:00", index: 3 },
    { start: "12:00", end: "13:00", index: 4 },
    { start: "13:00", end: "14:00", index: 5 },
    { start: "14:00", end: "15:00", index: 6 },
    { start: "15:00", end: "16:00", index: 7 },
    { start: "16:00", end: "17:00", index: 8 },
    { start: "17:00", end: "18:00", index: 9 },
    { start: "18:00", end: "19:00", index: 10 }
  ];

  return (
    <section className="timetable-section">
      {loading ? (
        <LoadingSpinner message="Loading timetable..." />
      ) : (
        <div className="timetable-wrapper">
          <div className="timetable-grid">
            {/* Header Row */}
            <div className="grid-header time-header">Time</div>
            {days.map(day => (
              <div key={day} className="grid-header day-header">
                <div className="day-name">{day}</div>
              </div>
            ))}

            {/* Time Slots and Classes */}
            {timeSlots.map((timeSlot, timeIndex) => (
              <React.Fragment key={timeIndex}>
                <div className="time-cell">
                  {timeSlot.start} - {timeSlot.end}
                </div>
                {days.map((day, dayIndex) => (
                  <ScheduleCell
                    key={`${day}-${timeIndex}`}
                    day={day}
                    timeSlot={timeSlot}
                    timetableData={timetableData}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}