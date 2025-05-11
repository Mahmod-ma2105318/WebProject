import repo from '@/app/repo/repo'
import React from 'react'
import AdminNavBar from '@/app/components/AdminNavBar';
import CoursesList from '@/app/components/CoursesList';

export default async function Page() {
  const courses = await repo.getCoursesWithPendingSections();
  function getValidationRecommendation(enrolled, maxSeats) {
    const ratio = enrolled / maxSeats;
    return ratio < 0.25
      ? "It is not recommended by the administration to validate this course under normal circumstances."
      : "It is recommended by the administration to validate this course under normal circumstances.";
  }


  return (
    <>
    <AdminNavBar />
    <div className="container">
    <CoursesList />
    <div className="course-container">
      {courses.map((course, courseIndex) => {
        const pendingSections = course.sections.filter(
          (section) => !section.validation || section.validation === "pending"
        );

        if (pendingSections.length === 0) return null;

        return (
          <div key={courseIndex} className="course-card">
            <div className="course-name"><strong>Course:</strong> {course.name}</div>
            <div className="course-category"><strong>Category:</strong> {course.category}</div>
            <div className="course-credits"><strong>Credits:</strong> {course.credits}</div>
            <div className="section-header"><strong>Sections:</strong></div>

            {pendingSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="section-info">
                <div><strong>Section:</strong> {section.sectionNo}</div>
                <div><strong>Instructor:</strong> {section.instructor?.user?.username ?? "TBD"}</div>
                <div><strong>Status:</strong> {section.status}</div>
                <div><strong>Enrolled:</strong> {section.enrolledStudents}/{section.maxSeats}</div>
                <div><strong>Validation:</strong> {section.validation || "pending"}</div>
                <div><strong>Recommendation:</strong> {getValidationRecommendation(section.enrolledStudents, section.maxSeats)}</div>

                <button className="validate-btn" data-course-index={courseIndex} data-section-index={sectionIndex}>Validate</button>
                <button className="invalidate-btn" data-course-index={courseIndex} data-section-index={sectionIndex}>Invalidate</button>
                <hr />
              </div>
            ))}
          </div>
        );
      })}
    </div>

    </div>
    </>
  );
}
