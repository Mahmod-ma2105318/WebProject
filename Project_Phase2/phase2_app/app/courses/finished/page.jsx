import repo from '@/app/repo/repo';
import React from 'react';
//This page will be added in the student part, especially in the finishedCourses

export default async function page() {
  const finishedCourses = await repo.showFinishedCourses({ studentId: 1 });

  return (
    <>
      {finishedCourses.map((finish, index) => (
        <div key={index} className="course-card">
          <div className="course-name">{finish.section.course.name}</div>
          <div className="course-grade">Grade: {finish.grade}</div>
        </div>
      ))}
    </>
  );
}

