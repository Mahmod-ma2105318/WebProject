import repo from '@/app/repo/repo';
import React from 'react';
import AdminNavBar from '@/app/components/AdminNavBar';
import CoursesList from '@/app/components/CoursesList';
import PendingCourseActions from '@/app/components/pendingCourseAction'; // 👇 client component

export default async function Page() {
  const pendingCourses = await repo.getPendingCourses(); // ✅ runs on server

  return (
    <>
      <AdminNavBar />
      <div className="container">
        <CoursesList />
        <h1>Pending Courses</h1>
        <PendingCourseActions initialCourses={pendingCourses} />
      </div>
    </>
  );
}
