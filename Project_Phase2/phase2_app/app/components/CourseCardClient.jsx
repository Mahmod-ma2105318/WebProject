'use client';
import React from 'react';
import { registerCourse } from '../actions/server-actions';

export default function CourseCardClient({ courses }) {
  const handleRegister = async (sectionId) => {
    try {
      await registerCourse({ sectionId }); 
      alert("Registered successfully!");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (

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
              Prerequisites: {course.prerequisites && course.prerequisites.length > 0
                ? course.prerequisites.map((prereq, index) => (
                  // Adjust the property here based on your data structure. 
                  // For example, using prereq.prerequisiteId:
                  <span key={index}>
                    {prereq.name}{index !== course.prerequisites.length - 1 ? ', ' : ''}
                  </span>
                ))
                : 'None'}
            </div>


            <div className="course-sections">
              <strong>Sections:</strong>
              {course.sections?.map(sec => (
                <div className="section-card" key={`${course.name}-${sec.sectionNo}`}>
                  <div>Section No: {sec.sectionNo}</div>
                  <div>
                    Status: <span style={{ color: sec.status === 'Open' ? '#27ae60' : '#c0392b' }}>
                      {sec.status}
                    </span>
                  </div>
                  <div>Max Seats: {sec.maxSeats}</div>
                  <div>Enrolled Students: {sec.enrolledStudents}</div>
                  <button
                    className="register-btn"
                    onClick={() => handleRegister(sec.id)}
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

  );
}
