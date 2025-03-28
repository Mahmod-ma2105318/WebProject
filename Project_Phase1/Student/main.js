document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("loggedInUser");

    if (!user) {
        window.location.href = "../Login/login.html";
    } else {
        user = JSON.parse(user);

        //Attributes
        const filterType = document.querySelector("#filterType");
        const searchBox = document.querySelector("#searchInput");
        const registeredCourses = document.querySelector("#registeredCoursesButton");


        filterType.addEventListener('change', filterChange);
        searchBox.addEventListener('input', search);
        registeredCourses.addEventListener('click', registerCourse);

        //localStorage
        let courses = localStorage.courses ? JSON.parse(localStorage.courses) : [];
        if (courses.length === 0) fetchCourses();
        displayCourses(courses);

        let students = localStorage.students ? JSON.parse(localStorage.students) : [];
        if (students.length === 0) fetchStudent();

        //registerd coureses
        async function fetchStudent() {
            try {
                const response = await fetch('student.json');
                const data = await response.json();
                students = data.students;
                localStorage.students = JSON.stringify(students);
            } catch (error) {
                console.error('Error loading students:', error);
            }

        }

        //Courses 
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

        //Display the courses in a grid
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
                    <div class="course-maxSeats"> Max Seats: ${course.maxSeats}</div>
                    <div class="course-enrolledStudents"> Enrolled Students: ${course.enrolledStudents}</div>
                    <button class="register-btn">Register</button> 

                </div>`

            ).join("");

            const registerButtons = document.querySelectorAll('.register-btn');
            registerButtons.forEach(button => {
                button.addEventListener('click', registerCourse);
            });

        }

        //
        function registerCourse(e) {
            const courseCard = e.target.closest('.course-card');
            const courseName = courseCard.querySelector('.course-name').textContent.trim();

            // Find the course from the courses based on the courseName
            const selectedCourse = courses.find(course => course.name === courseName);
            if (!selectedCourse) {
                console.error('Course not found.');
                return;
            }

            let registered = JSON.parse(localStorage.getItem("students")) || [];
            // Find the logged-in student's record
            let studentRecord = registered.find(student => student.user[0].username === user.username);
            if (!studentRecord) {
                alert('Student record not found.');
                return;
            }

            let finishedCourses = studentRecord.finishedCourses || [];
            let prerequisites = selectedCourse.prerequisites || [];

            //Maybe there is a better way
            if (prerequisites.length === 1 && prerequisites[0] === "None") {
                prerequisites = [];
            }

            //Check if student finished prerequisites
            if (prerequisites.length > 0) {
                let hasCompletedPrerequisites = prerequisites.every(prereq =>
                    finishedCourses.includes(prereq)
                );

                if (!hasCompletedPrerequisites) {
                    alert(`You need to complete all prerequisite courses: ${prerequisites.join(", ")}`);
                    return;
                }
            }

            if (selectedCourse.enrolledStudents >= selectedCourse.maxSeats) {
                alert(`Registration failed: ${selectedCourse.instructor}'s class is full.`);
                return;
            }

            // Check if the user is already registered for this course
            const isAlreadyRegistered = registered.find(course =>
                course.username === user.username && course.courseName === selectedCourse.name
            );



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

            updateCourseData(selectedCourse);

            // Optionally, update the UI to reflect that the user is registered
            alert(`Successfully registered for ${selectedCourse.name}`);

            // Optionally, disable the Register button after successful registration
            e.target.disabled = true;
            e.target.textContent = 'Registered';

        }

        function updateCourseData(course) {
            // Get the courses list from localStorage
            let courses = JSON.parse(localStorage.getItem("courses")) || [];

            // Find the course that the user registered for and update its information
            let courseToUpdate = courses.find(c => c.name === course.name);

            if (courseToUpdate) {
                // Increase enrolled students count
                if (courseToUpdate.enrolledStudents < courseToUpdate.maxSeats) {
                    courseToUpdate.enrolledStudents++;
                    displayCourses(courses);
                }

                // Update maxSeats for the instructor if needed
                if (courseToUpdate.enrolledStudents === courseToUpdate.maxSeats) {
                    console.log('Instructor has reached the maximum number of students.');
                }

                // Save the updated courses list back to localStorage
                localStorage.setItem("courses", JSON.stringify(courses));
            }
        }

        function addStudentInfo() {
            const studentInfoDiv = document.getElementById("student-info");

            if (studentInfoDiv) {
                studentInfoDiv.innerHTML = `<div class="user-info-container">
                    <img src="../images/image.png" alt="User Image"></img>
                    <div>
                        <div id="username">${user.username}</div>
                        <div id="role">${user.role}</div>
                    </div>
                </div>`
                    ;
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

    }

});

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../Login/login.html";
}