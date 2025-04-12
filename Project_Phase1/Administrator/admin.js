document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("loggedInUser");

    if (!user) {
        window.location.href = "../login/login.html";
    } else {

        user = JSON.parse(user);

        //Attributes
        const searchBox = document.querySelector("#searchInput");
        const filterType = document.querySelector("#filterType");
        const addCourseBtn = document.getElementById('addCourseButton');
        const modal = document.getElementById('courseModal');
        const closeBtn = document.querySelector('.close');
        const addSectionBtn = document.getElementById('addSection');
        const courseForm = document.getElementById('courseForm');
        const searchButton = document.querySelector("#searchButton");
        let currentView = 'all';


        document.querySelector("#searchButton").addEventListener('click', function () {
            currentView = 'all';
            displayCourses()
        });

        searchButton.addEventListener('click', function () {
            displayCourses(courses);
        });
        document.querySelector("#ValidateCoursesButton").addEventListener('click', function () {
            currentView = 'validate';
            displayValidateCourses();
        });

        document.querySelector("#PendingCoursesButton").addEventListener('click', function () {
            currentView = 'pending';
            displayPendingCourses();
        });

        addCourseBtn.addEventListener('click', () => modal.style.display = 'block');
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        filterType.addEventListener('change', filterChange);
        searchBox.addEventListener('input', search);

        document.querySelector('.menu-toggle').addEventListener('click', function () {
            document.getElementById('buttons').classList.toggle('active');
            document.body.classList.toggle('sidebar-active');
        });

        document.addEventListener('click', function (e) {
            const sidebar = document.getElementById('buttons');
            const toggleBtn = document.querySelector('.menu-toggle');

            if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
                sidebar.classList.remove('active');
                document.body.classList.remove('sidebar-active');
            }
        });

        //localStorage
        let courses = localStorage.courses ? JSON.parse(localStorage.courses) : [];
        if (courses.length === 0) fetchCourses();

        let CurrentlyTakenCourses = localStorage.CurrentlyTakenCourses ? JSON.parse(localStorage.CurrentlyTakenCourses) : [];
        if (courses.length === 0) fetchCurrentlyTakenCourses();

        let registered = localStorage.students ? JSON.parse(localStorage.students) : [];

        //functions
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

            courses.push(newCourse);
            localStorage.setItem("courses", JSON.stringify(courses));

            modal.style.display = 'none';
            courseForm.reset();
            displayCourses(courses);
        });


        function displayPendingCourses(data = null) {
            const courseContainer = document.getElementById('courseContainer');

            courseContainer.innerHTML = '';

            registered.forEach((student, studentIndex) => {
                if (student.RegisteredCourses && student.RegisteredCourses.length > 0) {

                    const username = student.user?.[0]?.username || 'Unknown Student';

                    student.RegisteredCourses.forEach((course, courseIndex) => {
                        if (!course.status || course.status === "pending") {
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
            }
            );

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
            if (registered[studentIndex] &&
                registered[studentIndex].RegisteredCourses &&
                registered[studentIndex].RegisteredCourses[courseIndex]) {

                let removedItem = registered[studentIndex].RegisteredCourses.splice(courseIndex, 1)[0];
                console.log(removedItem);

                const registration = {
                    "name": removedItem.courseName,
                    "category": removedItem.courseCategory,
                    "credits": removedItem.courseCredits,
                    "prerequisites": removedItem.prerequisites,
                    "instructor": removedItem.courseInstructor
                }


                registered[studentIndex].CurrentCourses.push(registration);

                localStorage.setItem("students", JSON.stringify(registered));

                displayCurrentlyTakenCourses();
            } else {
                console.error("Invalid indices for approval:", studentIndex, courseIndex);
            }
        }


        function declineCourse(studentIndex, courseIndex) {
            if (registered[studentIndex] &&
                registered[studentIndex].RegisteredCourses &&
                registered[studentIndex].RegisteredCourses[courseIndex]) {

                registered[studentIndex].RegisteredCourses.splice(courseIndex, 1);

                localStorage.setItem("students", JSON.stringify(registered));

                displayPendingCourses();
            } else {
                console.error("Invalid indices for decline:", studentIndex, courseIndex);
            }
        }

        function displayValidateCourses(data = null) {
            const courseContainer = document.getElementById('courseContainer');
            courseContainer.innerHTML = '';

            courses.forEach((course, courseIndex) => {
                const pendingSections = course.section.filter(
                    (section) => !section.validation || section.validation === "pending"
                );

                if (pendingSections.length > 0) {
                    const courseCard = document.createElement('div');
                    courseCard.className = 'course-card';

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

                localStorage.setItem("courses", JSON.stringify(courses));
                localStorage.setItem("CurrentlyTakenCourses", JSON.stringify(CurrentlyTakenCourses));

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

        document.querySelector("#CurrentCoursesButton").addEventListener('click', function () {
            currentView = 'current';
            displayCurrentlyTakenCourses();
        });

        function displayCurrentlyTakenCourses(data = null) {

            const courseContainer = document.getElementById('courseContainer');

            const dataset = data || CurrentlyTakenCourses;

            courseContainer.innerHTML = dataset.map(course => `
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
            const openCourses = courses
                .map(course => {
                    const openSections = course.section?.filter(sec => sec.status === "Open") || [];
                    if (openSections.length > 0) {
                        return { ...course, section: openSections };
                    }
                    return null;
                })
                .filter(course => course !== null);

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

        function filterChange() {
            console.log('change');
        }

        function search(e) {
            const searchTerm = e.target.value.toLowerCase();
            const filterValue = filterType.value;

            let dataset;
            let displayFunction;

            switch (currentView) {
                case 'all':
                    dataset = courses;
                    displayFunction = displayCourses;
                    break;
                case 'current':
                    dataset = CurrentlyTakenCourses;
                    displayFunction = displayCurrentlyTakenCourses;
                    break;
                case 'pending':
                    dataset = registered.flatMap(student =>
                        student.RegisteredCourses?.filter(c => !c.status || c.status === "pending") || []
                    );
                    displayFunction = displayPendingCourses;
                    break;
                case 'validate':
                    dataset = courses.flatMap(course =>
                        course.section?.filter(s => !s.validation || s.validation === "pending") || []
                    );
                    displayFunction = displayValidateCourses;
                    break;
                default:
                    dataset = courses;
                    displayFunction = displayCourses;
            }

            const filtered = dataset.filter(item => {
                switch (currentView) {
                    case 'all':
                        return filterCourses(item, searchTerm, filterValue);
                    case 'current':
                        return filterCurrentCourses(item, searchTerm, filterValue);
                    case 'pending':
                        return filterPendingCourses(item, searchTerm, filterValue);
                    case 'validate':
                        return filterValidateCourses(item, searchTerm, filterValue);
                    default:
                        return true;
                }
            });

            displayFunction(filtered.length > 0 ? filtered : []);
        }

        function filterCourses(course, term, filter) {
            const nameMatch = course.name?.toLowerCase().includes(term) ?? false;
            const categoryMatch = course.category?.toLowerCase().includes(term) ?? false;

            if (filter === 'name') return nameMatch;
            if (filter === 'category') return categoryMatch;
            return nameMatch || categoryMatch;
        }

        function filterCurrentCourses(course, term, filter) {
            return filterCourses(course, term, filter);
        }

        function filterPendingCourses(course, term, filter) {
            const nameMatch = course.courseName?.toLowerCase().includes(term) ?? false;
            const studentMatch = getStudentName(course.studentId)?.toLowerCase().includes(term) ?? false;

            if (filter === 'name') return nameMatch;
            if (filter === 'student') return studentMatch;
            return nameMatch || studentMatch;
        }

        function filterValidateCourses(section, term, filter) {
            const course = courses.find(c => c.section?.includes(section));
            const courseNameMatch = course?.name?.toLowerCase().includes(term) ?? false;
            const instructorMatch = section.instructor?.toLowerCase().includes(term) ?? false;

            if (filter === 'course') return courseNameMatch;
            if (filter === 'instructor') return instructorMatch;
            return courseNameMatch || instructorMatch;
        }

        function getStudentName(studentId) {
            const student = registered.find(s => s.id === studentId);
            return student?.user?.[0]?.username || 'Unknown';
        }
    }

});


function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../login/login.html";
}