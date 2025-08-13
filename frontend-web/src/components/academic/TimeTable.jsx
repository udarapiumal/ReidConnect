import React, { useState, useEffect } from "react";
import axiosInstance from '../../api/axiosInstance';
import Header from './components/Header';
import TimeTableFilters from './components/TimeTableFilters';
import TimeTableGrid from './components/TimeTableGrid';
import EditableTimeTableGrid from './components/EditableTimeTableGrid';
import CoursesList from './components/CoursesList';
import PrintLayout from './components/PrintLayout';
import { useTimeTableData } from './hooks/useTimeTableData';
import { timeSlotConfig } from './utils/timeSlotConfig';
import { PRIVILEGES } from '../../api/rolePrivileges';
import { getCurrentUserRole } from '../../utils/auth';
import StyledAlert from './components/StyledAlert'; 

import './styles/TimeTable.css';

export default function TimeTable() {
  const [selectedYear, setSelectedYear] = useState("YEAR_1");
  const [selectedDegree, setSelectedDegree] = useState("CS");
  const [printData, setPrintData] = useState({});
  const [isLoadingPrint, setIsLoadingPrint] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [courses, setCourses] = useState([]);
  const [refreshToggle, setRefreshToggle] = useState(false); 
  const role = getCurrentUserRole();
  const userPrivs = PRIVILEGES[role] || [];
  const canEditTimetable = userPrivs.includes("TIMETABLE_EDIT");
  const [clashAlert, setClashAlert] = useState(null);



  const {
    timetableData,
    coursesData,
    loading,
    fetchTimetableData,
  } = useTimeTableData(selectedYear, selectedDegree, refreshToggle); // Pass refreshToggle to the hook so it re-fetches when toggled

  useEffect(() => {
    fetchTimetableData();
    fetchCourses();
  }, [selectedYear, selectedDegree, refreshToggle]);

  // Fetch courses for dropdowns in edit mode
  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };

  const triggerRefresh = () => {
    setRefreshToggle(prev => !prev); // toggle to trigger refresh
  };

  const handleEntryDelete = async (entryId) => {
    try {
      await axiosInstance.delete(`/api/timetable/${entryId}`);
      triggerRefresh();
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  const handleEntryCreate = async (createData) => {
  try {
    await axiosInstance.post('/api/timetable', createData);
    triggerRefresh();
  } catch (error) {
    console.error('Error creating entry:', error);
    if (error.response && error.response.data && error.response.data.message) {
      const msg = error.response.data.message;
      // Show styled alert for venue or staff clashes
      if (msg.includes('Venue clash detected') || msg.includes('Staff clash detected')) {
        setClashAlert(msg);
      } else {
        alert(msg); // fallback for other errors
      }
    } else {
      alert('Failed to create entry. Please try again.');
    }
  }
};

// Same in update
const handleEntryUpdate = async (entryId, updateData) => {
  try {
    await axiosInstance.put(`/api/timetable/${entryId}`, updateData);
    triggerRefresh();
  } catch (error) {
    console.error('Error updating entry:', error);
    if (error.response && error.response.data && error.response.data.message) {
      const msg = error.response.data.message;
      if (msg.includes('Venue clash detected') || msg.includes('Staff clash detected')) {
        setClashAlert(msg);
      } else {
        alert(msg);
      }
    } else {
      alert('Failed to update entry. Please try again.');
    }
  }
};


  const handlePrint = async () => {
    try {
      console.log('Starting print process...');
      const printDataResult = await fetchAllTimetableData();
      console.log('Print data fetched:', printDataResult);
      
      setTimeout(() => {
        console.log('Opening print dialog...');
        window.print();
      }, 1500);
    } catch (error) {
      console.error('Error preparing print data:', error);
      alert('Error preparing print data. Please try again.');
    }
  };

  const fetchAllTimetableData = async () => {
    setIsLoadingPrint(true);
    const years = ["YEAR_1", "YEAR_2", "YEAR_3", "YEAR_4"];
    const degrees = ["CS", "IS"];
    const allData = {};

    try {
      for (const year of years) {
        allData[year] = { CS: [], IS: [], courses: { CS: [], IS: [] } };
        
        for (const degree of degrees) {
          try {
            console.log(`Fetching data for ${year} ${degree}`);
            const response = await axiosInstance.get(
              `/api/timetable/byYearAndDegree?degree=${degree}&year=${year}`
            );
            
            const timetableEntries = response.data || [];
            console.log(`Received ${timetableEntries.length} entries for ${year} ${degree}`);
            
            const processedData = timetableEntries.map(entry => {
              const timeSlots = timeSlotConfig.convertSlotsToTime(entry.slotIds);
              if (!timeSlots) return null;

              return {
                id: entry.id,
                day: entry.day.toUpperCase(),
                courseCode: entry.courseCode,
                courseName: entry.courseName,
                courseType: entry.courseType,
                group: entry.group,
                startTime: timeSlots.startTime,
                endTime: timeSlots.endTime,
                venue: entry.venue || 'TBA',
                lecturerCodes: entry.lecturerCodes || '',
                lecturerNames: entry.lecturerNames || '',
                degree: entry.degree,
                lectureCredits: entry.lectureCredits,
                practicalCredits: entry.practicalCredits
              };
            }).filter(Boolean);

            allData[year][degree] = processedData;

            const uniqueCourses = timetableEntries.reduce((courses, entry) => {
              if (!courses.some(course => course.courseCode === entry.courseCode)) {
                courses.push({
                  id: entry.id,
                  code: entry.courseCode,
                  name: entry.courseName,
                  lectureCredits: entry.lectureCredits,
                  practicalCredits: entry.practicalCredits,
                  degree: entry.degree,
                  lecturerNames: entry.lecturerNames ? entry.lecturerNames.split(', ') : [],
                  lecturerCodes: entry.lecturerCodes ? entry.lecturerCodes.split(', ') : []
                });
              }
              return courses;
            }, []);
            
            allData[year].courses[degree] = uniqueCourses;
            
          } catch (degreeError) {
            console.error(`Error fetching ${year} ${degree}:`, degreeError);
            allData[year][degree] = [];
            allData[year].courses[degree] = [];
          }
        }
      }
      
      console.log('Final print data:', allData);
      setPrintData(allData);
      return allData;
      
    } catch (error) {
      console.error('Error fetching print data:', error);
      return {};
    } finally {
      setIsLoadingPrint(false);
    }
  };

  return (
    <div className="timetable-container">
      <Header />
      
      <div className="content">
        <main className="main-content">
          <div className="page-header">
            <h2 className="page-title">Academic Timetable</h2>
            <div className="header-controls">
              <TimeTableFilters
                selectedYear={selectedYear}
                selectedDegree={selectedDegree}
                onYearChange={setSelectedYear}
                onDegreeChange={setSelectedDegree}
                onPrint={handlePrint}
                isLoadingPrint={isLoadingPrint}
              />
              
              {canEditTimetable && (
                <button 
                  className={`edit-button ${isEditMode ? 'edit-active' : ''}`}
                  onClick={handleEditToggle}
                >
                  {isEditMode ? 'Exit Edit' : 'Edit'}
                </button>
              )}
            </div>
          </div>

          {isEditMode ? (
            <EditableTimeTableGrid 
              timetableData={timetableData}
              courses={courses}
              loading={loading}
              selectedYear={selectedYear}
              selectedDegree={selectedDegree}
              onEntryDelete={handleEntryDelete}
              onEntryUpdate={handleEntryUpdate}
              onEntryCreate={handleEntryCreate}
            />
          ) : (
            <TimeTableGrid 
              timetableData={timetableData}
              loading={loading}
            />
          )}

          <CoursesList 
            coursesData={coursesData}
            loading={loading}
          />
        </main>
      </div>

      <PrintLayout printData={printData} />

      {clashAlert && (
        <StyledAlert
          message={clashAlert}
          onClose={() => setClashAlert(null)}
        />
      )}
    </div>
  );
}