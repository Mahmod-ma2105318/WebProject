'use server'
import { redirect } from 'next/navigation'
import accountsRepo from '@/app/repo/accounts-repo';
import JobsRepo from '../repo/JobsRepo';

// export async function getJobs(){
//     const jobs=await JobsRepo.getJobs();
// }