document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("loggedInUser");

    if (!user) {
        window.location.href = "../login/login.html";
    } else {
        user = JSON.parse(user);
        function addAdminInfo() {
            const adminInfoDiv = document.getElementById("admin-info");

            if (adminInfoDiv) {
                adminInfoDiv.innerHTML = `<div class="user-info-container">
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
        addAdminInfo();

        let courses = localStorage.courses ? JSON.parse(localStorage.courses) : [];
        let registered = localStorage.students ? JSON.parse(localStorage.students) : [];

        const pendingCourses = document.querySelector("#PendingCoursesButton");
        pendingCourses.addEventListener('click', displayPendingCourses)

        function displayPendingCourses() {
            const courseContainer = document.getElementById('courseContainer');

            // Clear previous content
            courseContainer.innerHTML = '';

            // Loop through each student
            registered.forEach((student, studentIndex) => {
                // Check if student has RegisteredCourses
                if (student.RegisteredCourses && student.RegisteredCourses.length > 0) {
                    // Get the username from the nested user array
                    const username = student.user?.[0]?.username || 'Unknown Student';

                    // Loop through each registered course
                    student.RegisteredCourses.forEach((course, courseIndex) => {
                        // Only display if status is Pending or undefined (treat undefined as Pending)
                        if (!course.status || course.status === "pending") {
                            // Create course card HTML
                            const courseCard = document.createElement('div');
                            courseCard.className = 'course-card';
                            courseCard.innerHTML = `
                                <div class="student-info">Student: ${username}</div>
                                <div class="course-name">${course.courseName || 'Unnamed Course'}</div>
                                <div class="course-category">${course.courseCategory || 'No Category'}</div>
                                ${course.credits ? `<div class="course-credits">Credits: ${course.credits}</div>` : ''}
                                ${course.instructor ? `<div class="course-instructor">Instructor: ${course.instructor}</div>` : ''}
                                <div class="course-status">Status: ${course.status || "Pending"}</div>
                                
                                <button class="approve-btn" 
                                    data-student-index="${studentIndex}" 
                                    data-course-index="${courseIndex}">
                                    Approve
                                </button>
                                <button class="decline-btn" 
                                    data-student-index="${studentIndex}" 
                                    data-course-index="${courseIndex}">
                                    Decline
                                </button>
                            `;

                            // Add to container
                            courseContainer.appendChild(courseCard);
                        }
                    });
                }
            });

            // Add event listeners
            document.querySelectorAll('.approve-btn').forEach(button => {
                button.addEventListener('click', function () {
                    approveCourse(
                        parseInt(this.dataset.studentIndex),
                        parseInt(this.dataset.courseIndex)
                    );
                });
            });

            document.querySelectorAll('.decline-btn').forEach(button => {
                button.addEventListener('click', function () {
                    declineCourse(
                        parseInt(this.dataset.studentIndex),
                        parseInt(this.dataset.courseIndex)
                    );
                });
            });
        }
        function approveCourse(studentIndex, courseIndex) {
            // Check if the indices are valid
            if (registered[studentIndex] &&
                registered[studentIndex].RegisteredCourses &&
                registered[studentIndex].RegisteredCourses[courseIndex]) {

                // Update the status of the specific course
                registered[studentIndex].RegisteredCourses[courseIndex].status = "Approved";

                // Save to localStorage
                localStorage.setItem("students", JSON.stringify(registered));

                // Refresh the list
                displayPendingCourses();
            } else {
                console.error("Invalid indices for approval:", studentIndex, courseIndex);
            }
        }

        function declineCourse(studentIndex, courseIndex) {
            // Check if the indices are valid
            if (registered[studentIndex] &&
                registered[studentIndex].RegisteredCourses &&
                registered[studentIndex].RegisteredCourses[courseIndex]) {

                // Remove only the specific course from the student's RegisteredCourses
                registered[studentIndex].RegisteredCourses.splice(courseIndex, 1);

                // Save to localStorage
                localStorage.setItem("students", JSON.stringify(registered));

                // Refresh the list
                displayPendingCourses();
            } else {
                console.error("Invalid indices for decline:", studentIndex, courseIndex);
            }
        }




        function displayCourses(courses) {

            const openCourses = courses.filter(course => course.status === "Open");

            const courseContainer = document.getElementById('courseContainer');

            courseContainer.innerHTML = openCourses.map(course => `
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
                   

                </div>`

            ).join("");

            // const registerButtons = document.querySelectorAll('.register-btn');
            // registerButtons.forEach(button => {
            //     button.addEventListener('click', registerCourse);
            // });

        }

        displayCourses(courses);
    }

});

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../login/login.html";
}
