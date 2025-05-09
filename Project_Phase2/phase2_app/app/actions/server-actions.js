'use server'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import repo from "@/app/repo/repo"

export async function logout() {
    redirect('/')


}

import { signIn } from 'next-auth/react';

export async function handleLogin(formData) {
    const username = formData.get('username');
    const password = formData.get('password');

    const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
    });

    if (!result || result.error) {
        throw new Error('Authentication failed');
    }

    switch (result.user.role) {
        case 'STUDENT':
            redirect('/courses');
            break;
        case 'ADMINISTRATOR':
            redirect('/Admin');
            break;
        case 'INSTRUCTOR':
            redirect('/Instructor');
            break;
        default:
            throw new Error('Unknown role');
    }
}
