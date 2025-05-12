import repo from '@/app/repo/repo';
import React from 'react';
import NavBar from '@/app/components/NavBar';
import SearchBar from '@/app/components/SearchBar';
//This page will be added in the student part, especially in the finishedCourses

export default async function page() {
  const user = await repo.getLoggedInUser()
  const finishedCourses = await repo.showFinishedCourses({ studentId: user.id });

  return (
    <div className="main-layout">
      <NavBar />
      <div className="container">
        <SearchBar />
        <h1>Finished Courses</h1>
        {finishedCourses.map((finish, index) => (
          <div key={index} className="course-card">
            <div className="course-name">{finish.section.course.name}</div>
            <div className="course-grade">Grade: {finish.grade}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

