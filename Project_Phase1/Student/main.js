// document.addEventListener("DOMContentLoaded", function () {
//     let user = localStorage.getItem("loggedInUser");

//     if (!user) {
//         window.location.href = "../Login/login.html";
//     } else {
//         user = JSON.parse(user);
//         document.getElementById("welcome").innerText = `Welcome, ${user.role} ${user.username}!`;
//     }
//     fetchCourses().then(() => {
//         // Initial display of all courses
//         displayCourses(courses);
//         setupSearch(courses);
//     })
// });

// function logout() {
//     localStorage.removeItem("loggedInUser");
//     window.location.href = "../Login/login.html";
// }

const filterType = document.querySelector("#filterType");
const searchBox = document.querySelector("#searchInput");


filterType.addEventListener('change', filterChange);
searchBox.addEventListener('input', search);

let user = localStorage.getItem("loggedInUser");
user = JSON.parse(user);
let courses = localStorage.courses ? JSON.parse(localStorage.courses) : [];
if (courses.length === 0) fetchCourses();
displayCourses(courses);


async function fetchCourses() {
    try {
        const response = await fetch('courses.json');
        const data = await response.json();
        courses = data.courses;
        localStorage.courses = JSON.stringify(courses);
        displayCourses(courses);
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

function displayCourses(courses) {
    const courseContainer = document.getElementById('courseContainer');

    courseContainer.innerHTML = courses.map(course => `
                <div class="course-card">
                    <div class="course-name">${course.name}</div>
                    <div class="course-category">${course.category}</div>
                    <div class="course-Credits">Credits: ${course.credits}</div>
                    <div class="course-prerequisites">prerequisites: ${course.prerequisites.join(", ")}</div>
                    <div class="course-Instructor">Instructor: ${course.instructor}</div>
                    <div class="course-status" style="color: ${course.status === 'Open' ? '#27ae60' : '#c0392b'}">
                        Status: ${course.status}
                    </div>
                </div>
            `).join("");
}

// Function to add student info
function addStudentInfo() {
    const studentInfoDiv = document.getElementById("student-info");

    if (studentInfoDiv) {
        studentInfoDiv.innerHTML = `<div class="user-info-container">
            <img src="../images/image.png" alt="User Image">
            <div>
                <div id="username">${user.username}</div>
                <div id="role">${user.role}</div>
            </div>
        </div>
        
        `;
    } else {
        console.error("Element with id 'student-info' not found.");
    }
}
addStudentInfo();



function filterChange() {
    displayCourses(courses);
}

function search(e) {
    const searchInput = e.target.value.toLowerCase();
    const filter = filterType.value;

    const filteredCourses = courses.filter(course => {
        if (filter === 'name') {
            return course.name.toLowerCase().includes(searchInput);
        }
        if (filter === 'category') {
            return course.category.toLowerCase().includes(searchInput);
        }
        return course.name.toLowerCase().includes(searchInput) ||
            course.category.toLowerCase().includes(searchInput);
    });

    displayCourses(filteredCourses);
}