document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("loggedInUser");

    if (!user) {
        window.location.href = "../Login/login.html";
    } else {
        user = JSON.parse(user);

        const filterType = document.querySelector("#filterType");
        const searchBox = document.querySelector("#searchInput");
        const registeredCourses = document.querySelector("#registeredCoursesButton");

        filterType.addEventListener('change', filterChange);
        searchBox.addEventListener('input', search);
        registeredCourses.addEventListener('click', registerCourse);

        let courses = localStorage.courses ? JSON.parse(localStorage.courses) : [];
        if (courses.length === 0) fetchCourses();
        displayCourses(courses);

        let registered = localStorage.registered ? JSON.parse(localStorage.registered) : [];
        if (registered.length === 0) fetchStudent();

        async function fetchStudent() {
            try {
                const response = await fetch('student.json');
                const data = await response.json();
                registered = data.students;
                localStorage.registered = JSON.stringify(registered);
            } catch (error) {
                console.error('Error loading registeredCourses:', error);
            }
        }

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
                <div class="course-card" course-name="${course.name}">
                    <div class="course-name">${course.name}</div>
                    <div class="course-category">${course.category}</div>
                    <div class="course-Credits">Credits: ${course.credits}</div>
                    <div class="course-prerequisites">Prerequisites: ${course.prerequisites.join(", ")}</div>
                    <div class="course-Instructor">Instructor: ${course.instructor}</div>
                    <div class="course-status" style="color: ${course.status === 'Open' ? '#27ae60' : '#c0392b'}">
                        Status: ${course.status}
                    </div>
                    <button class="register-btn">Register</button>
                </div>
            `).join("");

            // Add event listeners to the Register buttons after rendering courses
            const registerButtons = document.querySelectorAll('.register-btn');
            registerButtons.forEach(button => {
                button.addEventListener('click', registerCourse);
            });
        }

        function registerCourse(e) {
            const courseCard = e.target.closest('.course-card');
            const courseName = courseCard.getAttribute('course-name'); // get the course name from the card

            // Find the course object based on the courseName
            const selectedCourse = courses.find(course => course.name === courseName);

            if (!selectedCourse) {
                console.error('Course not found.');
                return;
            }

            // Get the currently logged in user
            const user = JSON.parse(localStorage.getItem("loggedInUser"));

            // Fetch the registered courses from localStorage, or initialize an empty array if not present
            let registered = JSON.parse(localStorage.getItem("registered")) || [];

            // Check if the user is already registered for this course
            const isAlreadyRegistered = registered.some(course => course.username === user.username && course.courseName === selectedCourse.name);

            if (isAlreadyRegistered) {
                alert('You are already registered for this course!');
                return;
            }

            // Register the user for the selected course
            const registration = {
                username: user.username,
                courseName: selectedCourse.name,
                courseCategory: selectedCourse.category,
                courseInstructor: selectedCourse.instructor,
                courseCredits: selectedCourse.credits
            };

            // Add the registration to the registered array
            registered.push(registration);

            // Update the localStorage with the new registration
            localStorage.setItem("registered", JSON.stringify(registered));

            // Optionally, update the UI to reflect that the user is registered
            alert(`Successfully registered for ${selectedCourse.name}`);

            // Optionally, you could disable the Register button or change its text to "Registered" after successful registration
            e.target.disabled = true;
            e.target.textContent = 'Registered';
        }

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
    }
});
