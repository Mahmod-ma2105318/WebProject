import React from 'react'
import repo from '@/app/repo/repo.js';
import NavBar from '@/app/components/NavBar';
import CoursesList from '@/app/components/CoursesList';

export default async function page() {
  const courses = await repo.getCourses();
  return (
    <>
      <NavBar />
      <div className="container">
        <CoursesList />
        <h1>Courses</h1>
        <div className="course-container">
          {courses.length === 0 ? (
            <div>No courses match your filters</div>
          ) : (
            courses.map(course => (
              <div className="course-card" key={course.name}>
                <div className="course-name"><strong>{course.name}</strong></div>
                <div className="course-category">Category: {course.category}</div>
                <div className="course-credits">Credits: {course.credits}</div>
                <div className="course-prerequisites">
                  Prerequisites: {course.prerequisites?.join(", ") || "None"}
                </div>

                <div className="course-sections">
                  <strong>Sections:</strong>
                  {course.sections?.map(sec => (
                    <div className="section-card" key={`${course.name}-${sec.sectionNo}`}>
                      <div>Section No: {sec.sectionNo}</div>
                      <div>Instructor: {sec.instructor}</div>
                      <div>
                        Status: <span style={{ color: sec.status === 'Open' ? '#27ae60' : '#c0392b' }}>
                          {sec.status}
                        </span>
                      </div>
                      <div>Max Seats: {sec.maxSeats}</div>
                      <div>Enrolled Students: {sec.enrolledStudents}</div>
                      <button className="register-btn"
                        disabled={sec.status !== 'Open'}
                      >
                        Register
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </>

  )

}
