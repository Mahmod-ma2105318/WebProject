'use client'
import React from 'react';
import repo from '@/app/repo/repo.js';
import InstructorNavBar from '@/app/components/InstructorNavBar';
import CoursesList from '@/app/components/CoursesList';

export default async function Page() {
  const user = await repo.getLoggedInUser();
  const enrollments = await repo.getEnrollmentsForInstructor(user.id);

  // Group by course name
  const courseGroups = {};

  enrollments.forEach((enrollment) => {
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
      enrollmentId: enrollment.id,
      category: enrollment.section.course.category,
      credits: enrollment.section.course.credits,
      instructor: enrollment.section.instructor.user.username,
    });
  });

  return (
    <>
      <InstructorNavBar />
      <div className="container">
        <CoursesList />
        <h2>Currently Teaching Courses</h2>

        {Object.entries(courseGroups).map(([courseName, group]) => (
          <div key={courseName} className="course-group">
            <h3>{courseName}</h3>
            <div className="students-list">
              {group.students.map((student, index) => {
                const courseId = `${student.studentName}-${courseName.replace(/\s+/g, '-')}`;
                return (
                  <div key={index} className="instructor-card">
                    <div><strong>Student:</strong> {student.studentName}</div>
                    <div>Category: {student.category}</div>
                    <div>Credits: {student.credits}</div>
                    <div>Instructor: {student.instructor}</div>
                    <div>
                      <label htmlFor={`grade-${courseId}`}>Enter Grade:</label>
                      <input
                        type="text"
                        id={`grade-${courseId}`}
                        className="grade-input"
                        placeholder="e.g. A+"
                      />
                      <button
                        className="submit-button"
                        data-enrollment-id={student.enrollmentId}
                        data-input-id={`grade-${courseId}`}
                        onClick={() => {
                          // Optional: hook this to a grade submission API
                          const grade = document.getElementById(`grade-${courseId}`).value;
                          console.log(`Submit grade '${grade}' for ${student.studentName} in ${courseName}`);
                        }}
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
        ))}
      </div>
    </>
  );
}
