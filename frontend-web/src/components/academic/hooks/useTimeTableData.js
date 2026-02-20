import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../../api/axiosInstance';
import { timeSlotConfig } from '../utils/timeSlotConfig';

export function useTimeTableData(selectedYear, selectedDegree, refreshToggle, academicCalendarId) {
  const [timetableData, setTimetableData] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTimetableData = useCallback(async () => {
    // Only fetch if we have a valid calendar ID
    if (!academicCalendarId) return;

    try {
      setLoading(true);

      const timetableResponse = await axiosInstance.get(
        `/api/timetable/byYearAndDegree?degree=${selectedDegree}&year=${selectedYear}&academicCalendarId=${academicCalendarId}`
      );

      const timetableEntries = timetableResponse.data;

      const processedData = timetableEntries.map(entry => {
        const timeSlots = timeSlotConfig.convertSlotsToTime(entry.slotIds);

        if (!timeSlots) {
          console.warn(`Missing slot data for entry:`, entry);
          return null;
        }

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
          credits: entry.credits,
          slotIds: entry.slotIds // Ensure this is passed for editing logic
        };
      }).filter(Boolean);

      console.log('Processed timetable data:', processedData);
      setTimetableData(processedData);

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

      setCoursesData(uniqueCourses);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      setTimetableData([]);
      setCoursesData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, selectedDegree, academicCalendarId]);

  // Auto-fetch when dependencies change
  useEffect(() => {
    fetchTimetableData();
  }, [fetchTimetableData, refreshToggle]);

  return {
    timetableData,
    coursesData,
    loading,
    fetchTimetableData
  };
}