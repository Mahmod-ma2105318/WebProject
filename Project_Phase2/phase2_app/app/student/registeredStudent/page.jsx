import React from 'react';
import repo from '@/app/repo/repo';
import NavBar from '@/app/components/NavBar';
import SearchBar from '@/app/components/SearchBar';

export default async function Page() {
  const user = await repo.getLoggedInUser()

  const registeredCourses = await repo.showRegisteredCourses({ studentId: user.id });

  return (
    <div className="main-layout">
      <NavBar />
      <div className="container">
        <SearchBar />
        <h1>Registered Courses</h1>
        <div className="course-container">
          {registeredCourses.map((register, index) => (
            <div key={index} className="course-card">
              <div className="course-name">{register.section.course.name}</div>
              <div className="course-category">{register.section.course.category}</div>
              <div className="course-credits">Credits: {register.section.course.credits}</div>
              <div className="course-instructor">Instructor ID: {register.section.instructorId}</div>
              <div className="course-status">Status: {register.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
