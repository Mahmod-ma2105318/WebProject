import repo from '@/app/repo/repo'
import React from 'react'
import AdminNavBar from '@/app/components/AdminNavBar';
import SearhBar from '@/app/components/SearchBar';
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
