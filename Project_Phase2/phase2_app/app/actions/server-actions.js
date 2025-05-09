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

    const user = await repo.getUser(username, password);
    if (!user) {
        throw new Error('Invalid username or password');
    }

    if (username !== user.username) {
        throw new Error('Invalid username');
    }
    if (password !== user.password) {
        throw new Error('Invalid password');
    }
    switch (user.role) {
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
