'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import repo from "@/app/repo/repo"

export async function logout() {
    redirect('/login')


}