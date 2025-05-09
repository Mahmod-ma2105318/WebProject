'use server'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import repo from "@/app/repo/repo"

export async function logout() {
    redirect('/')


}

export async function handleLogin(formData) {
    const username = formData.get('username');
    const password = formData.get('password');

    const user = await repo.userByUsername(username);

    if (!user) {
        throw new Error('User not found');
    }

    if (password !== user.password) {
        throw new Error('Incorrect password');
    }

    switch (user.role) {
        case 'STUDENT':
            redirect('/courses');
        case 'ADMINISTRATOR':
            redirect('/Admin');
        case 'INSTRUCTOR':
            redirect('/Instructor');
        default:
            throw new Error('Unknown role');
    }
}