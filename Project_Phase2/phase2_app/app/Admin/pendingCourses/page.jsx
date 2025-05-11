import repo from '@/app/repo/repo';
import React from 'react';
import AdminNavBar from '@/app/components/AdminNavBar';
import SearhBar from '@/app/components/SearchBar';

export default async function Page() {
  const pendingCourses = await repo.getPendingCourses(); // returns array of enrollments with section, course, student, instructor

  return (
    <>
      <AdminNavBar />
      <div className="container">
        <SearhBar />
        <h1>Pending Courses</h1>

        {pendingCourses.map((enrollment, index) => (
          <div key={index} className="course-card">
            <div className="student-info">
              Student: {enrollment.student.user.username}
            </div>

            <div className="course-name">
              {enrollment.section.course.name || 'Unnamed Course'}
            </div>
            <div className="course-category">
              Category: {enrollment.section.course.category || 'No Category'}
            </div>
            <div className="course-credits">
              Credits: {enrollment.section.course.credits}
            </div>
            <div className="course-instructor">
              Instructor: {enrollment.section.instructor?.user.username || 'TBD'}
            </div>
            <div className="course-status">
              Status: {enrollment.validation || 'PENDING'}
            </div>

            <div id="validationCard">
              <button className="approve-btn" data-enrollment-id={enrollment.id}>
                Approve
              </button>
              <button className="decline-btn" data-enrollment-id={enrollment.id}>
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
