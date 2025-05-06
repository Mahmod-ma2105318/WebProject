import React from 'react'
import JobsRepo from './repo/JobsRepo'
import JobsCart from './components/JobsCart';

export default async function page() {
  const jobs=await JobsRepo.getJobs();
  return (
    <>
      {/* <JobsCart jobs={jobs} /> */}
      <JobsCart jobs={jobs} />
    </>
  )
}
