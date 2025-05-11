// app/student/page.jsx or similar

import React from 'react';
import repo from '@/app/repo/repo.js';
import NavBar from "@/app/components/NavBar";
import CourseCardClient from '@/app/components/CourseCardClient';
import SearchBar from '../components/SearchBar';

export default async function Page() {
  const courses = await repo.getCourses(); // fetch server-side
  const user = await repo.getLoggedInUser();
  return (
    <>
      <NavBar />
      <div className="container">
        <SearchBar />

        <h1>Courses</h1>
        <CourseCardClient courses={courses} user={user} />
      </div>
    </>
  );
}
