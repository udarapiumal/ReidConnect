// frontend-web/src/components/academic/components/TimeTableEntryModal.jsx
import React, { useState, useEffect } from 'react';

export default function TimeTableEntryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  courses, 
  editingEntry, 
  mode, 
  selectedYear, 
  selectedDegree 
}) {
  const [formData, setFormData] = useState({
    courseId: '',
    courseType: 'LECTURE',
    group: null
  });

  const courseTypes = [
    { value: 'LECTURE', label: 'Lecture' },
    { value: 'TUTORIAL', label: 'Tutorial' },
    { value: 'PRACTICAL', label: 'Practical' }
  ];

  const groups = [
    { value: null , label: 'All Students' },
    { value: 'GROUP_1', label: 'Group 1' },
    { value: 'GROUP_2', label: 'Group 2' }
  ];

  useEffect(() => {
    if (mode === 'edit' && editingEntry) {
      setFormData({
        courseId: editingEntry.courseId || '',
        courseType: editingEntry.courseType || 'LECTURE',
        group: editingEntry.group || null
      });
    } else {
      setFormData({
        courseId: '',
        courseType: 'LECTURE',
        group: null
      });
    }
  }, [mode, editingEntry, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.courseId) {
      alert('Please select a course');
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  // Filter courses based on selected degree and year
  const filteredCourses = courses.filter(course => 
    course.degree === selectedDegree && course.year === selectedYear
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{mode === 'create' ? 'Create New Entry' : 'Edit Entry'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Course*</label>
            <select
              className="form-select"
              value={formData.courseId}
              onChange={(e) => handleChange('courseId', e.target.value)}
              required
            >
              <option value="">Select a course</option>
              {filteredCourses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Course Type*</label>
            <select
              className="form-select"
              value={formData.courseType}
              onChange={(e) => handleChange('courseType', e.target.value)}
              required
            >
              {courseTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Group</label>
            <select
              className="form-select"
              value={formData.group}
              onChange={(e) => handleChange('group', e.target.value)}
            >
              {groups.map(group => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              {mode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}