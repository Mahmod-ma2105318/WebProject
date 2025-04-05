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
        let courses = localStorage.CoursesForRegistration ? JSON.parse(localStorage.CoursesForRegistration) : [];
        let registered = localStorage.students ? JSON.parse(localStorage.students) : [];
        console.log(courses);
        
        
        

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

        const CurrentlyTakenCourses = document.querySelector("#CurrentCoursesButton");
        CurrentlyTakenCourses.addEventListener('click', displayCurrentlyTakenCourses);

        function displayCurrentlyTakenCourses(courses){

        }





        function displayCourses(courses) {
            
            
            

            const openCourses = courses.filter(course =>
                course.section && course.section.some(sec => sec.status === "Open")
            );   
            const courseContainer = document.getElementById('courseContainer');

            courseContainer.innerHTML = openCourses.map(course => `
                 <div class="course-card">
                 <div class="course-name"><strong>${course.name}</strong></div>
                 <div class="course-category">Category: ${course.category}</div>
                 <div class="course-credits">Credits: ${course.credits}</div>
                 <div class="course-prerequisites">Prerequisites: ${course.prerequisites.join(", ") || "None"}</div>
                
                 <div class="course-sections">
                     <strong>Sections:</strong>
                     ${course.section.map(sec => `
                         <div class="section-card">
                             <div>Section No: ${sec.sectionNo}</div>
                             <div>Instructor: ${sec.instructor}</div>
                             <div>Status: <span style="color: ${sec.status === 'Open' ? '#27ae60' : '#c0392b'}">${sec.status}</span></div>
                             <div>Max Seats: ${sec.maxSeats}</div>
                             <div>Enrolled Students: ${sec.enrolledStudents}</div>
                             
                        </div>
                     `).join("")}
                 </div>
             </div>
         `).join("");
        }
       

        displayCourses(courses);
    }

});

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../login/login.html";
}
