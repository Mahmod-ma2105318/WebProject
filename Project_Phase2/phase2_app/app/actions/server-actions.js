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
export async function addOrEditCourseAction(formData) {
  const courseData = {
    name: formData.get('name').trim(),
    category: formData.get('category').trim(),
    credits: parseInt(formData.get('credits')),
    prerequisites: formData.get('prerequisites')
      .split(',')
      .filter(Boolean)
      .map(Number)
      .filter(n => !isNaN(n)),
    sections: JSON.parse(formData.get('sections')).map(section => ({
      sectionNo: section.sectionNo.toString(),
      instructorName: section.instructorName.trim(),
      maxSeats: parseInt(section.maxSeats),
      enrolledStudents: parseInt(section.enrolledStudents),
      status: section.status,
      validation: section.validation
    }))
  };


  await repo.addCourse(courseData);

  redirect('/Admin');

}

export async function searchCoursesAction(prevState, formData) {
  const searchTerm = formData.get('search')?.trim();
  const filterType = formData.get('filterType') || 'all';

  try {
    if (!searchTerm) {
      return { results: [], error: 'Please enter a search term' };
    }

    let results;
    switch (filterType) {
      case 'name':
        results = await searchForCoursesByName(searchTerm);
        break;
      case 'category':
        results = await searchForCoursesByCategory(searchTerm);
        break;
      default:
        results = await searchForCourses(searchTerm);
    }

    if (results.length === 0) {
      return { results: [], error: 'No courses found matching your search' };
    }

    return { results, error: null };

  } catch (error) {
    console.error('Search failed:', error);
    return { results: [], error: 'Failed to perform search. Please try again.' };
  }
}