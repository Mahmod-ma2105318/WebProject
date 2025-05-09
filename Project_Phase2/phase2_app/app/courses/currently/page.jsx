import repo from '@/app/repo/repo';
import React from 'react';

export default async function page() {
  const currentlyTakenCourses = await repo.showCurrentCourses({ studentId: 1 });

  return (
    <>
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
    </>
  );
}
