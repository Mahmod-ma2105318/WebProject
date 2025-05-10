import repo from '@/app/repo/repo';
import React from 'react';
import NavBar from '@/app/components/NavBar';
import CoursesList from '@/app/components/CoursesList';
//This page will be added in the student part, especially in the finishedCourses

export default async function page() {
  const finishedCourses = await repo.showFinishedCourses({ studentId: 1 });

  return (
    <>
      <NavBar />
      <div className="container">
        <CoursesList />
        <h1>Finished Courses</h1>
        {finishedCourses.map((finish, index) => (
          <div key={index} className="course-card">
            <div className="course-name">{finish.section.course.name}</div>
            <div className="course-grade">Grade: {finish.grade}</div>
          </div>
        ))}
      </div>
    </>
  );
}

