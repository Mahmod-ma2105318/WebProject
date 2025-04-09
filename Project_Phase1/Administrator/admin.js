document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("loggedInUser");

    if (!user) {
        window.location.href = "../login/login.html";
    } else {

        user = JSON.parse(user);
        document.querySelector('.menu-toggle').addEventListener('click', function() {
            document.getElementById('buttons').classList.toggle('active');
            document.body.classList.toggle('sidebar-active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            const sidebar = document.getElementById('buttons');
            const toggleBtn = document.querySelector('.menu-toggle');
            
            if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-active');
            }
        });
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

        // Add Course Modal Handling
        const addCourseBtn = document.getElementById('addCourseButton');
        const modal = document.getElementById('courseModal');
        const closeBtn = document.querySelector('.close');
        const addSectionBtn = document.getElementById('addSection');
        const courseForm = document.getElementById('courseForm');

        addCourseBtn.addEventListener('click', () => modal.style.display = 'block');
        closeBtn.addEventListener('click', () => modal.style.display = 'none');

        let courses = localStorage.courses ? JSON.parse(localStorage.courses) : [];
        if (courses.length === 0) fetchCourses();

        let CurrentlyTakenCourses = localStorage.CurrentlyTakenCourses ? JSON.parse(localStorage.CurrentlyTakenCourses) : [];
        if (courses.length === 0) fetchCurrentlyTakenCourses();

        async function fetchCourses() {
            try {
                const response = await fetch('../Data/courses.json');
                const data = await response.json();
                courses = data.CoursesForRegistration;
                localStorage.courses = JSON.stringify(courses);
                displayCourses(courses);
            } catch (error) {
                console.error('Error loading courses:', error);
            }
        }

        async function fetchCurrentlyTakenCourses() {
            try {
                const response = await fetch('../Data/courses.json');
                const data = await response.json();
                CurrentlyTakenCourses = data.CurrentlyTakenCourses;
                localStorage.CurrentlyTakenCourses = JSON.stringify(CurrentlyTakenCourses);

            } catch (error) {
                console.error('Error loading courses:', error);
            }
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        // Add Section Functionality
        addSectionBtn.addEventListener('click', () => {
            const newSection = document.createElement('div');
            newSection.className = 'section-input';
            newSection.innerHTML = `
        <div class="form-group">
            <label>Section Number:</label>
            <input type="text" class="sectionNo" required>
        </div>
        <div class="form-group">
            <label>Instructor:</label>
            <input type="text" class="sectionInstructor" required>
        </div>
        <div class="form-group">
            <label>Max Seats:</label>
            <input type="number" class="sectionMaxSeats" required>
        </div>
    `;
            addSectionBtn.parentNode.insertBefore(newSection, addSectionBtn);
        });

        // Form Submission
        courseForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newCourse = {
                name: document.getElementById('courseName').value,
                category: document.getElementById('courseCategory').value,
                credits: parseInt(document.getElementById('courseCredits').value),
                prerequisites: document.getElementById('coursePrerequisites').value
                    .split(',')
                    .map(p => p.trim())
                    .filter(p => p),
                section: []
            };

            // Get sections
            document.querySelectorAll('.section-input').forEach(section => {
                newCourse.section.push({
                    sectionNo: section.querySelector('.sectionNo').value,
                    instructor: section.querySelector('.sectionInstructor').value,
                    maxSeats: parseInt(section.querySelector('.sectionMaxSeats').value),
                    enrolledStudents: 0,
                    status: "Open",
                    validation: "pending"
                });
            });

            // Add to CoursesForRegistration
            courses.push(newCourse);
            localStorage.setItem("courses", JSON.stringify(courses));

            modal.style.display = 'none';
            courseForm.reset();
            displayCourses(courses); // Update the display
        });





        let registered = localStorage.students ? JSON.parse(localStorage.students) : [];
        //Courses 


        // const filterType = document.querySelector("#filterType");
        // const searchBox = document.querySelector("#searchInput");
        const searchButton = document.querySelector("#searchButton");
        const ValidateCoursesButton = document.querySelector("#ValidateCoursesButton");


        searchButton.addEventListener('click', function () {
            displayCourses(courses);
        });
        ValidateCoursesButton.addEventListener('click', displayValidateCourses)
        // searchBox.addEventListener('input', search);
        // filterType.addEventListener('change', filterChange);

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
                                
                                <div id="validationCard">
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
                                </div>
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
        
                // Remove the course from RegisteredCourses and move it to CurrentCourses
                let removedItem = registered[studentIndex].RegisteredCourses.splice(courseIndex, 1)[0];
                console.log(removedItem);
                
                const registration = {
                    "name":removedItem.courseName ,
                    "category":removedItem.courseCategory ,
                    "credits": removedItem.courseCredits,
                    "prerequisites": removedItem.prerequisites,
                    "instructor": removedItem.courseInstructor
                }
                
                
                registered[studentIndex].CurrentCourses.push(registration); 
        
                // Save to localStorage
                localStorage.setItem("students", JSON.stringify(registered));
        
                // Refresh the list
                displayCurrentlyTakenCourses();
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

        function displayValidateCourses() {
            const courseContainer = document.getElementById('courseContainer');
            courseContainer.innerHTML = '';

            courses.forEach((course, courseIndex) => {
                // Filter only pending or undefined sections
                const pendingSections = course.section.filter(
                    (section) => !section.validation || section.validation === "pending"
                );

                // Only show the course if it has at least one pending section
                if (pendingSections.length > 0) {
                    const courseCard = document.createElement('div');
                    courseCard.className = 'course-card';

                    // Basic course info
                    let cardHTML = `
                        <div class="course-name"><strong>Course:</strong> ${course.name || 'Unnamed Course'}</div>
                        <div class="course-category"><strong>Category:</strong> ${course.category || 'No Category'}</div>
                        <div class="course-credits"><strong>Credits:</strong> ${course.credits || 'N/A'}</div>
                        <div class="section-header"><strong>Sections:</strong></div>
                    `;

                    function getValidationRecommendation(enrolled, maxSeats) {
                        const enrollmentRatio = enrolled / maxSeats;

                        if (enrollmentRatio < 0.25) {
                            return "It is not recommended by the administration to validate this course under normal circumstances.";
                        } else {
                            return "It is recommended by the administration to validate this course under normal circumstances.";
                        }
                    }

                    // List each pending section
                    pendingSections.forEach((section, sectionIndex) => {
                        cardHTML += `
                            <div class="section-info">
                                <div><strong>Section:</strong> ${section.sectionNo}</div>
                                <div><strong>Instructor:</strong> ${section.instructor}</div>
                                <div><strong>Status:</strong> ${section.status}</div>
                                <div><strong>Enrolled:</strong> ${section.enrolledStudents}/${section.maxSeats}</div>
                                <div><strong>Validation:</strong> ${section.validation || "pending"}</div>
                                <div><strong>Recommendation:</strong> ${getValidationRecommendation(section.enrolledStudents, section.maxSeats)}</div>
                                <button class="validate-btn" data-course-index="${courseIndex}" data-section-index="${sectionIndex}">
                                    Validate
                                </button>
                                <button class="InValidate-btn" data-course-index="${courseIndex}" data-section-index="${sectionIndex}">
                                    InValidate
                                </button>
                                <hr>
                            </div>
                        `;
                    });

                    courseCard.innerHTML = cardHTML;
                    courseContainer.appendChild(courseCard);
                }
            });

            // Add event listeners
            document.querySelectorAll('.validate-btn').forEach(button => {
                button.addEventListener('click', function () {
                    validateCourse(
                        parseInt(this.dataset.courseIndex),
                        parseInt(this.dataset.sectionIndex)
                    );
                });
            });

            document.querySelectorAll('.InValidate-btn').forEach(button => {
                button.addEventListener('click', function () {
                    InValidateCourse(
                        parseInt(this.dataset.courseIndex),
                        parseInt(this.dataset.sectionIndex)
                    );
                });
            });
        }



        function validateCourse(courseIndex, sectionIndex) {
            const section = courses[courseIndex].section[sectionIndex];
            if (section) {
                let [selectedSection] = courses[courseIndex].section.splice(sectionIndex, 1);
                selectedSection.validation = "Valid";

                const selectedCourse = courses[courseIndex];
                const coursename = selectedCourse.name;

                let existingCourse = CurrentlyTakenCourses.find(course => course.name === coursename);

                if (existingCourse) {
                    existingCourse.section.push(selectedSection);
                } else {
                    const course = {
                        name: selectedCourse.name,
                        category: selectedCourse.category,
                        credits: selectedCourse.credits,
                        prerequisites: selectedCourse.prerequisites,
                        section: [selectedSection]
                    };
                    CurrentlyTakenCourses.push(course);
                }

                // Save the updated arrays to localStorage
                localStorage.setItem("courses", JSON.stringify(courses));
                localStorage.setItem("CurrentlyTakenCourses", JSON.stringify(CurrentlyTakenCourses));

                // Call the function to display validated courses
                displayValidateCourses();
            } else {
                console.error("Invalid course/section index", courseIndex, sectionIndex);
            }
        }


        function InValidateCourse(courseIndex, sectionIndex) {
            const section = courses[courseIndex].section[sectionIndex];
            if (section) {
                section.validation = "rejected";

                courses[courseIndex].section.splice(sectionIndex, 1);

                localStorage.setItem("courses", JSON.stringify(courses));

                displayValidateCourses();

            } else {
                console.error("Invalid course/section index", courseIndex, sectionIndex);
            }
        }

        const CurrentlyTakenCoursesSelector = document.querySelector("#CurrentCoursesButton");
        CurrentlyTakenCoursesSelector.addEventListener('click', displayCurrentlyTakenCourses);


        function displayCurrentlyTakenCourses() {

            const courseContainer = document.getElementById('courseContainer');

            courseContainer.innerHTML = CurrentlyTakenCourses.map(course => `
                <div class="course-card">
                    <div class="course-name"><strong>${course.name}</strong></div>
                    <div class="course-category">Category: ${course.category}</div>
                    <div class="course-credits">Credits: ${course.credits}</div>
                    
        
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

        function displayCourses(courses) {
            // Keep course info + filter open sections
            const openCourses = courses
                .map(course => {
                    const openSections = course.section?.filter(sec => sec.status === "Open") || [];
                    if (openSections.length > 0) {
                        return { ...course, section: openSections }; // Keep course info + only open sections
                    }
                    return null;
                })
                .filter(course => course !== null); // Remove courses without open sections

            const courseContainer = document.getElementById('courseContainer');

            courseContainer.innerHTML = openCourses.map(course => `
                <div class="course-card">
                    <div class="course-name"><strong>${course.name}</strong></div>
                    <div class="course-category">Category: ${course.category}</div>
                    <div class="course-credits">Credits: ${course.credits}</div>
                    <div class="course-prerequisites">Prerequisites: ${course.prerequisites?.join(", ") || "None"}</div>
        
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

