import repo from '@/app/repo/repo';
import React from 'react';
import AdminNavBar from '@/app/components/AdminNavBar';
import CoursesList from '@/app/components/CoursesList';

export default async function Page() {
  const courses = await repo.getCurrentlyTakenCourses();

  return (
    <>
    <AdminNavBar />
    <div className="container">
        <CoursesList />
        <h1>Courses</h1>
      {courses.map((course, index) => (
        <div key={index} className="course-card">
          <div className="course-name">
            <strong>{course.section.course.name}</strong>
          </div>
          <div className="course-category">
            Category: {course.section.course.category}
          </div>
          <div className="course-credits">
            Credits: {course.section.course.credits}
          </div>

          <div className="course-sections">
            <strong>Section:</strong>
            <div className="section-card">
              <div>Section No: {course.section.sectionNo}</div>
              <div>Instructor: {course.section.instructorId ?? 'TBD'}</div>
              <div>
                Status:{' '}
                <span
                  style={{
                    color: course.section.status === 'Open' ? '#27ae60' : '#c0392b',
                  }}
                >
                  {course.section.status}
                </span>
              </div>
              <div>Max Seats: {course.section.maxSeats}</div>
              <div>Enrolled Students: {course.section.enrolledStudents}</div>
            </div>
          </div>
        </div>
      ))}
      </div>
    </>
  );
}
