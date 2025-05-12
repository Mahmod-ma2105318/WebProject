'use client';

import React, { useState } from 'react';
import { gradeStudent } from '@/app/actions/server-actions';

export default function InstructorGradePanel({ enrollments }) {
  const [enrollmentList, setEnrollmentList] = useState(enrollments);

  const handleGrade = async (studentId, sectionId, inputId) => {
    const grade = document.getElementById(inputId)?.value;
    if (!grade) return alert('Please enter a grade');

    try {
      await gradeStudent(sectionId, studentId, grade);
      alert('Grade submitted!');

      // Remove the graded enrollment from state
      setEnrollmentList(prev =>
        prev.filter(e =>
          !(e.student.id === studentId && e.section.id === sectionId)
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to submit grade');
    }
  };

  // Dynamically group by course
  const courseGroups = {};
  enrollmentList.forEach((enrollment) => {
    const courseName = enrollment.section.course.name;
    const studentName = enrollment.student.user.username;

    if (!courseGroups[courseName]) {
      courseGroups[courseName] = {
        course: enrollment.section.course,
        students: [],
      };
    }

    courseGroups[courseName].students.push({
      studentName,
      studentId: enrollment.student.id,
      sectionId: enrollment.section.id,
      category: enrollment.section.course.category,
      credits: enrollment.section.course.credits,
      instructor: enrollment.section.instructor.user.username,
    });
  });

  return (
    <>
      {Object.keys(courseGroups).length === 0 ? (
        <p>✅ All students have been graded!</p>
      ) : (
        Object.entries(courseGroups).map(([courseName, group]) => (
          <div key={courseName} className="course-group">
            <h3>{courseName}</h3>
            <div className="students-list">
              {group.students.map((student, index) => {
                const inputId = `${student.studentName}-${courseName.replace(/\s+/g, '-')}`;
                return (
                  <div key={index} className="instructor-card">
                    <div><strong>Student:</strong> {student.studentName}</div>
                    <div>Category: {student.category}</div>
                    <div>Credits: {student.credits}</div>
                    <div>Instructor: {student.instructor}</div>
                    <div>
                      <label htmlFor={`grade-${inputId}`}>Enter Grade:</label>
                      <input id={`grade-${inputId}`} placeholder="e.g. A+" />
                      <button
                        onClick={() => handleGrade(
                          student.studentId,
                          student.sectionId,
                          `grade-${inputId}`
                        )}
                      >
                        Submit Grade
                      </button>
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </>
  );
}