'use server'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import repo from "@/app/repo/repo"

export async function logout() {
    const user = await repo.getLoggedInUser();
    if (user) {
      await repo.logOut(user);
    }
    redirect('/');
  }
  

export async function handleLogin(formData) {
    const username = formData.get('username');
    const password = formData.get('password');
  
    const user = await repo.getUser(username, password);
  
    if (!user) {
      throw new Error('Invalid username or password');
    }
  
    await repo.logIn(user);
  
    switch (user.role) {
      case 'STUDENT':
        redirect('/student');
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

export async function registerCourse(sectionId) {
  
    const user = await repo.getLoggedInUser();
    if (!user) throw new Error('No user logged in');
    await repo.registerForCourse(sectionId);
   
    
  }
  