import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function CoursesList({ coursesData, loading }) {
  // Keep only unique courses by `code`
  const uniqueCourses = Array.from(
    
    new Map(coursesData.map(course => [course.code, course])).values()
  );

  return (
    console.log('Courses Data:', coursesData),
    <section className="courses-section">
      <h3 className="courses-title">Course Codes & Names</h3>
      {loading ? (
        <LoadingSpinner message="Loading courses..." />
      ) : (
        <div className="courses-grid">
          {uniqueCourses.map((course, index) => (
            <div key={course.id || index} className="course-item">
              <span className="course-code-text">{course.code}</span>
              <span className="course-name-text">
                {course.name} ({course.lectureCredits} L +{course.practicalCredits} P)
                {course.lecturerNames && course.lecturerNames.length > 0 && (
                  <div className="lecturer-names">
                    {course.lecturerCodes.join('& ')}
                  </div>
                )}
              </span>
            </div>
          ))}
          {uniqueCourses.length === 0 && (
            <div className="no-data">
              <p>No courses found for the selected filters.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
