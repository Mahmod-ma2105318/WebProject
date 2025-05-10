import repo from '@/app/repo/repo';
import React from 'react';
import NavBar from '@/app/components/NavBar';
import CoursesList from '@/app/components/CoursesList';
//This page will be added in the student part, especially in the currentlyTakenCourse

export default async function Page() {
  const currentlyTakenCourses = await repo.showCurrentCourses({ studentId: 1 });

  // Preload instructor names
  const coursesWithInstructor = await Promise.all(
    currentlyTakenCourses.map(async (register) => {
      const instructorName = await repo.showInstructorBySectionId(register.sectionId);
      return {
        ...register,
        instructorName: instructorName || 'TBD'
      };
    })
  );

  return (
    <>
      <NavBar />
      <div className="container">
        <CoursesList />
        <h1>Currently Taken Courses</h1>

        {coursesWithInstructor.map((register, index) => (
          <div key={index} className="course-card">
            <div className="course-name">{register.section.course.name}</div>
            <div className="course-category">{register.section.course.category}</div>
            <div className="course-credits">Credits: {register.section.course.credits}</div>
            <div className="course-instructor">Instructor: {register.instructorName}</div>
          </div>
        ))}
      </div>
    </>
  );
}
