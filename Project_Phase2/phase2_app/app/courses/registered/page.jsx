import repo from '@/app/repo/repo';
import React from 'react';
// This shows the open sections in the adminstrator

export default async function Page() {
  const openCourses = await repo.getOpenCourses();

  return (
    <>
      {openCourses.map((course) => (
        <div key={course.id} className="course-card" style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
          <div className="course-name">
            <strong>{course.name}</strong>
          </div>
          <div className="course-category">Category: {course.category}</div>
          <div className="course-credits">Credits: {course.credits}</div>
          <div className="course-prerequisites">
            Prerequisites:{" "}
            {course.prerequisites.length > 0
              ? course.prerequisites.map((p) => p.prerequisiteId).join(", ")
              : "None"}
          </div>

          <div className="course-sections">
            <strong>Sections:</strong>
            {course.sections.map((sec) => (
              <div key={sec.id} className="section-card" style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                <div>Section No: {sec.sectionNo}</div>
                <div>Instructor: {sec.instructorId || "TBD"}</div>
                <div>
                  Status:{" "}
                  <span style={{ color: sec.status === "Open" ? "#27ae60" : "#c0392b" }}>
                    {sec.status}
                  </span>
                </div>
                <div>Max Seats: {sec.maxSeats}</div>
                <div>Enrolled Students: {sec.enrolledStudents}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
