// app/admin/validate-sections/page.jsx
import repo from '@/app/repo/repo';
import React from 'react';
import AdminNavBar from '@/app/components/AdminNavBar';
import CoursesList from '@/app/components/CoursesList';
import ValidationCardClient from '@/app/components/ValidationCardClient'; // 👇 new client component

export default async function Page() {
  const courses = await repo.getCoursesWithPendingSections();

  return (
    <>
      <AdminNavBar />
      <div className="container">
        <CoursesList />
        <ValidationCardClient courses={courses} />
      </div>
    </>
  );
}
