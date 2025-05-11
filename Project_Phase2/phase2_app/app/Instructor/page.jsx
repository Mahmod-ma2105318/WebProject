import React from 'react';
import repo from '@/app/repo/repo';
import InstructorNavBar from '@/app/components/InstructorNavBar';
import CoursesList from '@/app/components/CoursesList';
import InstructorGradePanel from '../components/InstructorGradePanel';

export default async function Page() {
  const user = await repo.getLoggedInUser();
  const enrollments = await repo.getEnrollmentsForInstructor(user.id);

  return (
    <>
      <InstructorNavBar />
      <div className="container">
        <CoursesList />
        <h2>Currently Teaching Courses</h2>
        <InstructorGradePanel enrollments={enrollments}/>

      </div>
    </>
  );
}
