import React from 'react'
import repo from '@/app/repo/repo.js';
import CoursesList from "@/app/components/CoursesList"

export default async function page() {
  const courses = await repo.getCourses();
  return (
    <>
      <CoursesList courses={courses} />
    </>

  )

}
