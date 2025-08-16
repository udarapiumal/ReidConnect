import React from 'react';

export default function TimeTableFilters({ 
  selectedYear, 
  selectedDegree, 
  onYearChange, 
  onDegreeChange, 
  onPrint, 
  isLoadingPrint 
}) {
  return (
    <div className="filters">
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
        disabled={isLoadingPrint}
      >
        {isLoadingPrint ? 'Loading...' : 'Print All Timetables'}
      </button>
    </div>
  );
}