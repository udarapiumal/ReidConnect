import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function CoursesList({ coursesData, loading }) {
  return (
    <section className="courses-section">
      <h3 className="courses-title">Course Codes & Names</h3>
      {loading ? (
        <LoadingSpinner message="Loading courses..." />
      ) : (
        <div className="courses-grid">
          {coursesData.map((course, index) => (
            <div key={course.id || index} className="course-item">
              <span className="course-code-text">{course.code}</span>
              <span className="course-name-text">
                {course.name} ({course.credits} Credits)
                {course.lecturerNames && course.lecturerNames.length > 0 && (
                  <div className="lecturer-names">
                    {course.lecturerNames.join(', ')}
                  </div>
                )}
              </span>
            </div>
          ))}
          {coursesData.length === 0 && (
            <div className="no-data">
              <p>No courses found for the selected filters.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}