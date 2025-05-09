import repo from '@/app/repo/repo';
import React from 'react';
//This shows the pending courses,which has to be shown in the admistrator
export default async function Page() {
  const pendingCourses = await repo.getPendingCourses(); // expects structure like what you posted

  return (
    <div className="course-list">
      {pendingCourses.map((course) => (
        <div key={course.id} className="course-card" style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
          <div className="course-name"><strong>{course.name || 'Unnamed Course'}</strong></div>
          <div className="course-category">Category: {course.category || 'No Category'}</div>
          <div className="course-credits">Credits: {course.credits ?? 'N/A'}</div>

          <div className="course-sections">
            <strong>Sections:</strong>
            {course.sections.map((section) => (
              <div key={section.id} className="section-card" style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                <div>Section No: {section.sectionNo}</div>
                <div>Instructor: {section.instructorId ?? 'TBD'}</div>
                <div>Status: {section.status}</div>
                <div>Enrolled Students: {section.enrolledStudents} / {section.maxSeats}</div>
                <div>Validation: {section.validation}</div>
                <div id="validationCard">
                  <button className="approve-btn" data-section-id={section.id}>Approve</button>
                  <button className="decline-btn" data-section-id={section.id}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
