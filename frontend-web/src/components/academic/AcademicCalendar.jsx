import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Header from './components/Header';
import './styles/AcademicCalendar.css';

const AcademicCalendar = () => {
  const [semesterDates, setSemesterDates] = useState({
    year1: { semester1: { start: '', end: '' }, semester2: { start: '', end: '' } },
    year2: { semester1: { start: '', end: '' }, semester2: { start: '', end: '' } },
    year3: { semester1: { start: '', end: '' }, semester2: { start: '', end: '' } },
    year4: { semester1: { start: '', end: '' }, semester2: { start: '', end: '' } },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSemesterDates = async () => {
      try {
        const { data } = await axiosInstance.get('/api/academic-calendar');
        const newDates = { ...semesterDates };
        data.forEach(item => {
          const yearKey = `year${item.year}`;
          const semKey = `semester${item.semester}`;
          if (newDates[yearKey] && newDates[yearKey][semKey]) {
            newDates[yearKey][semKey][item.type] = item.date.split('T')[0];
          }
        });
        setSemesterDates(newDates);
      } catch (error) {
        console.error('Error fetching semester dates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSemesterDates();
  }, []);

  const handleInputChange = (year, semester, type, value) => {
    setSemesterDates(prev => ({
      ...prev,
      [`year${year}`]: {
        ...prev[`year${year}`],
        [`semester${semester}`]: {
          ...prev[`year${year}`][`semester${semester}`],
          [type]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = [];
    for (const yearStr in semesterDates) {
      const year = parseInt(yearStr.replace('year', ''));
      for (const semesterStr in semesterDates[yearStr]) {
        const semester = parseInt(semesterStr.replace('semester', ''));
        const { start, end } = semesterDates[yearStr][semesterStr];
        if (start) payload.push({ year, semester, type: 'start', date: start });
        if (end) payload.push({ year, semester, type: 'end', date: end });
      }
    }

    try {
      await axiosInstance.post('/api/academic-calendar', payload);
      alert('Academic calendar updated successfully!');
    } catch (error) {
      console.error('Error updating academic calendar:', error);
      alert('Failed to update academic calendar.');
    }
  };

  const renderYearSection = (year) => (
    <div className="year-section" key={year}>
      <h3 className="year-title">Year {year}</h3>
      <div className="semesters-container">
        {[1, 2].map(semester => (
          <div className="semester-section" key={semester}>
            <h4 className="semester-title">Semester {semester}</h4>
            <div className="date-inputs">
              <label>
                Start Date:
                <input
                  type="date"
                  value={semesterDates[`year${year}`][`semester${semester}`].start}
                  onChange={(e) => handleInputChange(year, semester, 'start', e.target.value)}
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  value={semesterDates[`year${year}`][`semester${semester}`].end}
                  onChange={(e) => handleInputChange(year, semester, 'end', e.target.value)}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="academic-calendar-container">
      <Header />
      <main className="main-content">
        <div className="page-header">
          <h2 className="page-title">Academic Calendar Management</h2>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="calendar-form">
            {[1, 2, 3, 4].map(renderYearSection)}
            <button type="submit" className="submit-button">Save Changes</button>
          </form>
        )}
      </main>
    </div>
  );
};

export default AcademicCalendar;