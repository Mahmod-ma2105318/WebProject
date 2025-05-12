import repo from '@/app/repo/repo';
import React from 'react';
import AdminNavBar from '@/app/components/AdminNavBar';
import SearchBar from '@/app/components/SearchBar';

export default async function Page({ searchParams }) {
  const searchTerm = await searchParams?.search || '';
  const filterType = await searchParams?.filterType || 'all';

  let courses;
  if (searchTerm) {
    switch (filterType) {
      case 'name':
        courses = await repo.searchForCoursesByName(searchTerm);
        break;
      case 'category':
        courses = await repo.searchForCoursesByCategory(searchTerm);
        break;
      default:
        courses = await repo.searchForCourses(searchTerm);
    }
  } else {
    courses = await repo.getCourses();
  }

  return (
    <div className="main-layout">
      <AdminNavBar />
      <div className="container">
        <SearchBar />
        <h1>Courses{searchTerm ? ` matching "${searchTerm}"` : ''}</h1>
        {courses
          .filter(course => course?.sections?.length > 0)
          .map((course) => (
            <div key={course.id} className="course-card" style={{ border: '1px solid #ccc', margin: '1rem', padding: '1rem' }}>
              <div className="course-name">
                <strong>{course.name}</strong>
              </div>
              <div className="course-category">Category: {course.category}</div>
              <div className="course-credits">Credits: {course.credits}</div>
              <div className="course-prerequisites">
                Prerequisites:{" "}
                {course?.prerequisites?.length > 0
                  ? course.prerequisites.map((p) => p.prerequisiteId).join(", ")
                  : "None"}
              </div>

              <div className="course-sections">
                <strong>Sections:</strong>
                {course.sections.map((sec) => (
                  <div key={sec.id} className="section-card" style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                    <div>Section No: {sec.sectionNo}</div>
                    <div>Instructor: {sec.instructorName || "TBD"}</div>
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
      </div>
    </div>
  );
}