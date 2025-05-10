import repo from '@/app/repo/repo';
import React from 'react';
import NavBar from '@/app/components/NavBar';
import CoursesList from '@/app/components/CoursesList';
//This page will be added in the student part, especially in the currentlyTakenCourse
//دي الي بقولك حاول فيها لاين 17

export default async function page() {
  const currentlyTakenCourses = await repo.showCurrentCourses({ studentId: 1 });

  return (
    <>
      <NavBar />
      <div className="container">
        <CoursesList />
        <h1>Currently Taken Courses</h1>

        {currentlyTakenCourses.map((register, index) => (
          <div key={index} className="course-card">
            <div className="course-name">{register.section.course.name}</div>
            <div className="course-category">{register.section.course.category}</div>
            <div className="course-credits">Credits: {register.section.course.credits}</div>
            <div className="course-instructor">
              Instructor: {register.section.instructor?.user?.username || 'N/A'}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
