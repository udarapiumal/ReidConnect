import React, { useState, useEffect } from 'react';
import { timeUtils } from '../utils/timeUtils';
import LoadingSpinner from './LoadingSpinner';
import EditableScheduleCell from './EditableScheduleCell';
import TimeTableEntryModal from './TimeTableEntryModal';

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export default function EditableTimeTableGrid({ 
  timetableData, 
  courses, 
  loading, 
  selectedYear, 
  selectedDegree, 
  onEntryDelete, 
  onEntryUpdate, 
  onEntryCreate 
}) {
  const [selectedCells, setSelectedCells] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  const timeSlots = [
    { start: "08:00", end: "09:00", index: 0, slotIds: [1, 2] },
    { start: "09:00", end: "10:00", index: 1, slotIds: [3, 4] },
    { start: "10:00", end: "11:00", index: 2, slotIds: [5, 6] },
    { start: "11:00", end: "12:00", index: 3, slotIds: [7, 8] },
    { start: "12:00", end: "13:00", index: 4, slotIds: [9, 10] },
    { start: "13:00", end: "14:00", index: 5, slotIds: [11, 12] },
    { start: "14:00", end: "15:00", index: 6, slotIds: [13, 14] },
    { start: "15:00", end: "16:00", index: 7, slotIds: [15, 16] },
    { start: "16:00", end: "17:00", index: 8, slotIds: [17, 18] },
    { start: "17:00", end: "18:00", index: 9, slotIds: [19, 20] },
    { start: "18:00", end: "19:00", index: 10, slotIds: [21, 22] }
  ];

  const handleCellSelect = (day, timeSlot) => {
    const cellId = `${day}-${timeSlot.index}`;
    
    setSelectedCells(prev => {
      if (prev.includes(cellId)) {
        return prev.filter(id => id !== cellId);
      } else {
        return [...prev, cellId];
      }
    });
  };

  const handleCreateNew = () => {
    if (selectedCells.length === 0) {
      alert('Please select at least one time slot to create a new entry.');
      return;
    }
    
    setModalMode('create');
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry) => {
    setModalMode('edit');
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (entry) => {
    if (window.confirm(`Are you sure you want to delete ${entry.courseCode} - ${entry.courseType}?`)) {
      await onEntryDelete(entry.id);
    }
  };

  const handleModalSubmit = async (formData) => {
  try {
    const slotIds = new Set();

    if (modalMode === 'create') {
      selectedCells.forEach(cellId => {
        const [day, timeIndex] = cellId.split('-');
        const timeSlot = timeSlots[parseInt(timeIndex)];
        timeSlot.slotIds.forEach(slotId => slotIds.add(slotId));
      });

      const firstCell = selectedCells[0];
      const [day] = firstCell.split('-');

      const createData = {
        ...formData,
        day: day.toUpperCase(),
        slotIds: Array.from(slotIds).sort((a, b) => a - b), // ensure correct order
      };

      

      await onEntryCreate(createData);
      setSelectedCells([]);

    } else {
      // Edit mode: recalc slotIds from editingEntry's start/end time
      const matchedSlots = timeSlots.filter(ts =>
        ts.start >= editingEntry.startTime && ts.end <= editingEntry.endTime
      ).flatMap(ts => ts.slotIds);

      const updateData = {
        ...formData,
        day: editingEntry.day.toUpperCase(),
        slotIds: matchedSlots.sort((a, b) => a - b),
      };

      await onEntryUpdate(editingEntry.id, updateData);
    }

    setIsModalOpen(false);
    setEditingEntry(null);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};


  const clearSelection = () => {
    setSelectedCells([]);
  };

  return (
    <section className="timetable-section">
      {loading ? (
        <LoadingSpinner message="Loading timetable..." />
      ) : (
        <>
          <div className="edit-controls">
            <div className="selection-info">
              {selectedCells.length > 0 ? (
                <span>Selected {selectedCells.length} time slot(s)</span>
              ) : (
                <span>Click on empty time slots to select them for creating new entries</span>
              )}
            </div>
            <div className="edit-actions">
              <button 
                className="create-button"
                onClick={handleCreateNew}
                disabled={selectedCells.length === 0}
              >
                Create New Entry
              </button>
              <button 
                className="clear-button"
                onClick={clearSelection}
                disabled={selectedCells.length === 0}
              >
                Clear Selection
              </button>
            </div>
          </div>

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
                    <EditableScheduleCell
                      key={`${day}-${timeIndex}`}
                      day={day}
                      timeSlot={timeSlot}
                      timetableData={timetableData}
                      isSelected={selectedCells.includes(`${day}-${timeIndex}`)}
                      onCellSelect={handleCellSelect}
                      onEditEntry={handleEditEntry}
                      onDeleteEntry={handleDeleteEntry}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          <TimeTableEntryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            courses={courses}
            selectedCells={selectedCells}
            editingEntry={editingEntry}
            mode={modalMode}
            selectedYear={selectedYear}
            selectedDegree={selectedDegree}
          />
        </>
      )}
    </section>
  );
}