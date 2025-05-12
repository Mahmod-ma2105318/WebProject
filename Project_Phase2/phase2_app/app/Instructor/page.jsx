import React from 'react';
import repo from '@/app/repo/repo';
import InstructorNavBar from '@/app/components/InstructorNavBar';
import SearhBar from '@/app/components/SearchBar';
import InstructorGradePanel from '../components/InstructorGradePanel';
export default async function Page() {
  const user = await repo.getLoggedInUser();
  const enrollments = await repo.getEnrollmentsForInstructor(user.id);

  // Group by course name
  const courseGroups = {};

  enrollments.forEach((enrollment) => {
    const courseName = enrollment.section.course.name;
    const studentName = enrollment.student.user.username;

    if (!courseGroups[courseName]) {
      courseGroups[courseName] = {
        course: enrollment.section.course,
        students: [],
      };
    }

    courseGroups[courseName].students.push({
      studentName,
      enrollmentId: enrollment.id,
      category: enrollment.section.course.category,
      credits: enrollment.section.course.credits,
      instructor: enrollment.section.instructor.user.username,
    });
  });

  return (
    <div className="main-layout">

      <InstructorNavBar />
      <div className="container">
        <SearhBar />
        <h2>Currently Teaching Courses</h2>
        <InstructorGradePanel enrollments={enrollments} />
      </div>
    </div>
  );
}
