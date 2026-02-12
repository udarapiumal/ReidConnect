import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../api/axiosInstance';

export default function TimeTableFilters({
  selectedYear,
  selectedDegree,
  selectedCalendarId,
  onYearChange,
  onDegreeChange,
  onCalendarChange,
  onPrint,
  isLoadingPrint
}) {
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await axiosInstance.get('/api/academic-calendar');
        // Filter only SEMESTER type calendars for timetable purposes
        const semesterCalendars = response.data.filter(c => c.periodType === 'SEMESTER');
        setCalendars(semesterCalendars);
      } catch (error) {
        console.error('Error fetching academic calendars:', error);
      }
    };
    fetchCalendars();
  }, []);

  return (
    <div className="filters">
      <div className="filter-group">
        <label className="filter-label">Academic Calendar:</label>
        <select
          className="filter-select"
          value={selectedCalendarId || ''}
          onChange={(e) => onCalendarChange(e.target.value)}
        >
          <option value="" disabled>Select Semester</option>
          {calendars.map(cal => (
            <option key={cal.id} value={cal.id}>
              {cal.title} ({cal.academicYear})
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">Year:</label>
        <select
          className="filter-select"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
        >
          <option value="YEAR_1">First Year</option>
          <option value="YEAR_2">Second Year</option>
          <option value="YEAR_3">Third Year</option>
          <option value="YEAR_4">Fourth Year</option>
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label">Degree:</label>
        <select
          className="filter-select"
          value={selectedDegree}
          onChange={(e) => onDegreeChange(e.target.value)}
        >
          <option value="CS">Computer Science</option>
          <option value="IS">Information Systems</option>
        </select>
      </div>
      <button
        className="print-button"
        onClick={onPrint}
        disabled={isLoadingPrint || !selectedCalendarId}
      >
        {isLoadingPrint ? 'Loading...' : 'Print All Timetables'}
      </button>
    </div>
  );
}