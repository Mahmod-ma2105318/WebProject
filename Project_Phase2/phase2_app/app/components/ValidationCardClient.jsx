'use client';

import { validateSection, invalidateSection } from '@/app/actions/server-actions';
import React, { useState } from 'react';

export default function ValidationCardClient({ courses: initialCourses }) {
  const [courses, setCourses] = useState(initialCourses);

  function getValidationRecommendation(enrolled, maxSeats) {
    const ratio = enrolled / maxSeats;
    return ratio < 0.25
      ? 'It is not recommended by the administration to validate this course under normal circumstances.'
      : 'It is recommended by the administration to validate this course under normal circumstances.';
  }

  const handleValidation = async (sectionId, courseIndex) => {
    await validateSection(sectionId);
    updateCourses(sectionId, courseIndex);
    alert('Section validated');
  };

  const handleInvalidation = async (sectionId, courseIndex) => {
    await invalidateSection(sectionId);
    updateCourses(sectionId, courseIndex);
    alert('Section invalidated');
  };

  const updateCourses = (sectionId, courseIndex) => {
    setCourses((prevCourses) => {
      const updatedCourses = [...prevCourses];
      const course = updatedCourses[courseIndex];
      course.sections = course.sections.filter((section) => section.id !== sectionId);
      return updatedCourses;
    });
  };

  return (
    <div className="course-container">
      {courses.map((course, courseIndex) => {
        const pendingSections = course.sections.filter(
          (section) => !section.validation || section.validation === 'pending'
        );

        if (pendingSections.length === 0) return null;

        return (
          <div key={course.id} className="course-card">
            <div className="course-name"><strong>Course:</strong> {course.name}</div>
            <div className="course-category"><strong>Category:</strong> {course.category}</div>
            <div className="course-credits"><strong>Credits:</strong> {course.credits}</div>
            <div className="section-header"><strong>Sections:</strong></div>

            {pendingSections.map((section, sectionIndex) => (
              <div key={section.id} className="section-info">
                <div><strong>Section:</strong> {section.sectionNo}</div>
                <div><strong>Instructor:</strong> {section.instructor?.user?.username ?? 'TBD'}</div>
                <div><strong>Status:</strong> {section.status}</div>
                <div><strong>Enrolled:</strong> {section.enrolledStudents}/{section.maxSeats}</div>
                <div><strong>Validation:</strong> {section.validation || 'pending'}</div>
                <div><strong>Recommendation:</strong> {getValidationRecommendation(section.enrolledStudents, section.maxSeats)}</div>

                <button
                  onClick={() => handleValidation(section.id, courseIndex)}
                  className="validate-btn"
                >
                  Validate
                </button>

                <button
                  onClick={() => handleInvalidation(section.id, courseIndex)}
                  className="invalidate-btn"
                >
                  Invalidate
                </button>
                <hr />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
