import repo from '@/app/repo/repo';
import React from 'react';
import AdminNavBar from '@/app/components/AdminNavBar';
import SearhBar from '@/app/components/SearchBar';
import PendingCourseActions from '@/app/components/pendingCourseAction'; // 👇 client component
export default async function Page() {
  const pendingCourses = await repo.getPendingCourses(); // returns array of enrollments with section, course, student, instructor

  return (
    <>
      <AdminNavBar />
      <div className="container">
        <SearhBar />
        <h1>Pending Courses</h1>
        <PendingCourseActions initialCourses={pendingCourses} />

      </div>
    </>
  );
}
