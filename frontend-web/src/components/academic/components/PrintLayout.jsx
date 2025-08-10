import React from 'react';
import { timeUtils } from '../utils/timeUtils';

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export default function PrintLayout({ printData }) {
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

  const formatClassCellForPrint = (classes) => {
    if (classes.length === 0) return '';
    
    return classes.map(cls => {
      let content = cls.courseCode;
      
      if (cls.courseType === 'LECTURE') content += ' L';
      else if (cls.courseType === 'PRACTICAL') content += ' P';
      else if (cls.courseType === 'TUTORIAL') content += ' T';
      
      if (cls.venue && cls.venue !== 'TBA') {
        content += `\n(${cls.venue})`;
      }
      
      if (cls.lecturerCodes) {
        content += `\n${cls.lecturerCodes}`;
      }
      
      if (cls.group && cls.group !== 'ALL') {
        content += `\nGrp ${cls.group}`;
      }
      
      return content;
    }).join('\n\n');
  };

  const getYearDisplayName = (year) => {
    switch (year) {
      case 'YEAR_1': return 'First Year';
      case 'YEAR_2': return 'Second Year';
      case 'YEAR_3': return 'Third Year';
      case 'YEAR_4': return 'Fourth Year';
      default: return year;
    }
  };

  return (
    <div className="print-only" id="print-content">
      {Object.keys(printData).length > 0 ? (
        ["YEAR_1", "YEAR_2", "YEAR_3", "YEAR_4"].map((year) => {
          const yearData = printData[year];
          if (!yearData) return null;
          
          return (
            <div key={year} className="print-page">
              <div className="print-header">
                <h1>University of Colombo School of Computing (UCSC)</h1>
                <h2>Bachelor of Science in Computer Science and Bachelor of Science in Information Systems Degree Programme</h2>
                <h3>Timetable {getYearDisplayName(year)} - 2025 (Semester I)</h3>
              </div>

              <table className="print-table">
                <thead>
                  <tr>
                    <th rowSpan="2" className="time-header-print">TIME</th>
                    <th colSpan="2">MONDAY</th>
                    <th colSpan="2">TUESDAY</th>
                    <th colSpan="2">WEDNESDAY</th>
                    <th colSpan="2">THURSDAY</th>
                    <th colSpan="2">FRIDAY</th>
                  </tr>
                  <tr>
                    <th className="degree-header">IS</th>
                    <th className="degree-header">CS</th>
                    <th className="degree-header">IS</th>
                    <th className="degree-header">CS</th>
                    <th className="degree-header">IS</th>
                    <th className="degree-header">CS</th>
                    <th className="degree-header">IS</th>
                    <th className="degree-header">CS</th>
                    <th className="degree-header">IS</th>
                    <th className="degree-header">CS</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((timeSlot) => (
                    <tr key={`${year}-${timeSlot.start}`}>
                      <td className="time-cell-print">
                        {timeSlot.start} - {timeSlot.end}
                      </td>
                      {days.map(day => (
                        <React.Fragment key={`${year}-${day}-${timeSlot.start}`}>
                          <td className="schedule-cell-print">
                            {formatClassCellForPrint(timeUtils.getClassesForTimeSlot(day, timeSlot, yearData.IS || []))}
                          </td>
                          <td className="schedule-cell-print">
                            {formatClassCellForPrint(timeUtils.getClassesForTimeSlot(day, timeSlot, yearData.CS || []))}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="print-courses">
                <div className="print-courses-column">
                  <div className="course-list">
                    {yearData.courses?.IS?.length > 0 ? (
                      yearData.courses.IS.map((course, index) => (
                        <div key={course.id || `is-${index}`} className="print-course-item">
                          <strong>{course.code}</strong> {course.name} ({course.credits} Credits)
                          {course.lecturerNames?.length > 0 && (
                            <span className="lecturer-info"> - {course.lecturerNames.join(', ')}</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="print-course-item">No IS courses found for this year</div>
                    )}
                  </div>
                </div>
                <div className="print-courses-column">
                  <div className="course-list">
                    {yearData.courses?.CS?.length > 0 ? (
                      yearData.courses.CS.map((course, index) => (
                        <div key={course.id || `cs-${index}`} className="print-course-item">
                          <strong>{course.code}</strong> {course.name} ({course.credits} Credits)
                          {course.lecturerNames?.length > 0 && (
                            <span className="lecturer-info"> - {course.lecturerNames.join(', ')}</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="print-course-item">No CS courses found for this year</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="print-loading">
          <div className="print-page">
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>
              <p>Loading timetable data for printing...</p>
              <p>Please wait while we fetch all year and degree information.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}