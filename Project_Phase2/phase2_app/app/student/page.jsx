// app/student/page.jsx or similar

import React from 'react';
import repo from '@/app/repo/repo.js';
import NavBar from "@/app/components/NavBar";
import CourseCardClient from '@/app/components/CourseCardClient';
import SearchBar from '../components/SearchBar';

export default async function Page({ searchParams }) {
  const searchTerm = await searchParams?.search || '';
  const filterType = await searchParams?.filterType || 'all';

  let courses;
  if (searchTerm) {
    switch (filterType) {
      case 'name':
        courses = await repo.searchForCoursesByName(searchTerm);
        break;
      case 'category':
        courses = await repo.searchForCoursesByCategory(searchTerm);
        break;
      default:
        courses = await repo.searchForCourses(searchTerm);
    }
  } else {
    courses = await repo.getCourses();
  }

  const user = await repo.getLoggedInUser();
  return (
    <div className="main-layout">
      <NavBar />
      <div className="container">
        <SearchBar />

        <h1>Courses</h1>
        <CourseCardClient courses={courses} user={user} />
      </div>
    </div>


  );
}
