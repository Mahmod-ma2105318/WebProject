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
        const searchButton = document.querySelector("#searchButton");
        const finishedCoursesButton = document.querySelector("#FinishedCoursesButton");
        const CurrentCoursesButton = document.querySelector("#CurrentCoursesButton");
        let currentView = 'all';


        document.querySelector('.menu-toggle').addEventListener('click', function () {
            document.getElementById('buttons').classList.toggle('active');
            document.body.classList.toggle('sidebar-active');
        });

        filterType.addEventListener('change', filterChange);
        searchBox.addEventListener('input', search);
        registeredCourses.addEventListener('click', function () {
            displayRegisteredCourses();
            currentView = 'registered';
        });
        searchButton.addEventListener('click', function () {
            displayCourses(courses);
            currentView = 'all';
        });
        finishedCoursesButton.addEventListener('click', function () {
            finishedCourses();
            currentView = 'finished';
        });
        CurrentCoursesButton.addEventListener('click', function () {
            displayCurrentCourses();
            currentView = 'current';
        })

        //localStorage
        let courses = localStorage.courses ? JSON.parse(localStorage.courses) : [];
        if (courses.length === 0) fetchCourses();
        displayCourses(courses);

        let CurrentlyTakenCourses = localStorage.CurrentlyTakenCourses ? JSON.parse(localStorage.CurrentlyTakenCourses) : [];
        if (courses.length === 0) fetchCurrentlyTakenCourses();

        let students = localStorage.students ? JSON.parse(localStorage.students) : [];
        if (students.length === 0) fetchStudent();


        //functions

        //registerd coureses
        async function fetchStudent() {
            try {
                const response = await fetch('../Data/students.json');
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

        //Display the courses in a grid
        function displayCourses(courses) {
            const courseContainer = document.getElementById('courseContainer');

            courseContainer.innerHTML = courses.map(course => `
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
                                <button class="register-btn" data-course="${course.name}" data-section="${sec.sectionNo}">Register</button>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `).join("");

            const registerButtons = document.querySelectorAll('.register-btn');
            registerButtons.forEach(button => {
                button.addEventListener('click', event => {
                    const courseName = event.target.dataset.course;
                    const sectionNo = event.target.dataset.section;
                    registerCourse(courseName, sectionNo);
                });
            });
        }



        function displayRegisteredCourses(data = null) {
            const courseContainer = document.getElementById('courseContainer');

            let student = students.find(s => s.user.some(u => u.username === user.username));
            const dataset = data || student.RegisteredCourses;

            courseContainer.innerHTML = dataset.map(register => `
                <div class="course-card">
                    <div class="course-name">${register.courseName}</div>
                    <div class="course-category">${register.courseCategory}</div>
                    <div class="course-Credits">Credits: ${register.courseCredits}</div>
                    <div class="course-Instructor">Instructor: ${register.courseInstructor}</div>
                    <div class="course-Instructor">Status: ${register.status}</div>
                </div>
            `).join("");
        }

        function displayCurrentCourses(data = null) {

            const courseContainer = document.getElementById('courseContainer');

            let student = students.find(s => s.user.some(u => u.username === user.username));
            const dataset = data || student.CurrentCourses;

            courseContainer.innerHTML = dataset.map(register => `
                <div class="course-card">
                    <div class="course-name">${register.name}</div>
                    <div class="course-category">${register.category}</div>
                    <div class="course-Credits">Credits: ${register.credits}</div>
                    <div class="course-Instructor">Instructor: ${register.instructor}</div>
                    
                </div>
            `).join("");

        }

        function finishedCourses(data = null) {
            const courseContainer = document.getElementById('courseContainer');

            const userFinishedCourses = students.find(student => student.user[0].username === user.username);
            const dataset = data || userFinishedCourses.finishedCourses || [];



            if (userFinishedCourses.length === 0) {
                courseContainer.innerHTML = "<p>No finished courses found.</p>";
                return;
            }

            courseContainer.innerHTML = dataset.map(finish => `
                <div class="course-card">
                    <div class="course-name">${finish.courseName}</div>
                    <div class="course-Grade">Grade: ${finish.Grade}</div>
                    
                </div>
            `).join("");

        }

        function registerCourse(courseName, sectionNo) {
            const selectedCourse = courses.find(course => course.name === courseName);
            console.log(selectedCourse);

            if (!selectedCourse) {
                console.error('Course not found.');
                return;
            }



            const selectedSection = selectedCourse.section.find(sec => sec.sectionNo === sectionNo);
            if (!selectedSection) {
                console.error('Section not found.');
                return;
            }


            if (selectedSection.status !== "Open") {
                alert(`Registration failed: Course ${courseName} Section ${sectionNo} is not open for registration.`);
                return;
            }


            if (selectedSection.enrolledStudents >= selectedSection.maxSeats) {
                alert(`Registration failed: Course ${courseName} Section ${sectionNo} is full.`);
                return;
            }

            let studentRecord = students.find(student => student.user[0].username === user.username);
            if (!studentRecord) {
                alert('Student record not found.');
                return;
            }

            const isCourseFinished = studentRecord.finishedCourses.some(c => c.courseName === selectedCourse.name);
            console.log(isCourseFinished);

            const isCourseCurrent = studentRecord.CurrentCourses?.some(c => c.name === selectedCourse.name);
            let finishedCourses = studentRecord.finishedCourses || [];
            let prerequisites = selectedCourse.prerequisites || [];

            if (isCourseCurrent) {
                alert(`You already taking ${courseName} course!`);
                return;
            }
            if (isCourseFinished) {
                alert(`You already finished ${courseName} course!`)
                return;
            }

            if (prerequisites.length === 1 && prerequisites[0] === "None") {
                prerequisites = [];
            }

            if (prerequisites.length > 0) {
                let hasCompletedPrerequisites = prerequisites.every(prereq =>
                    finishedCourses.some(finished => finished.courseName === prereq)
                );

                if (!hasCompletedPrerequisites) {
                    alert(`You need to complete all prerequisite courses: ${prerequisites.join(", ")}, for ${courseName}`);
                    return;
                }
            }

            if (selectedCourse.enrolledStudents >= selectedCourse.maxSeats) {
                alert(`Registration failed: ${selectedCourse.instructor}'s class in ${courseName} is full.`);
                return;
            }


            const isAlreadyRegistered = studentRecord.RegisteredCourses.some(register =>
                register.courseName === selectedCourse.name
            );

            if (isAlreadyRegistered) {
                alert(`You are already registered for a section of ${courseName} course!`);
                return;
            }


            if (isAlreadyRegistered) {
                alert(`You are already registered for ${courseName} course!`);
                return;
            }

            const registration = {
                username: user.username,
                courseName: selectedCourse.name,
                courseCategory: selectedCourse.category,
                courseInstructor: selectedCourse.instructor,
                courseCredits: selectedCourse.credits,
                maxSeats: selectedSection.maxSeats,
                enrolledStudents: selectedSection.enrolledStudents,
                status: "pending",
                sectionNo: selectedSection.sectionNo,
                courseInstructor: selectedSection.instructor
            };

            let studentIndex = students.findIndex(s => s.user.some(u => u.username === user.username));
            students[studentIndex].RegisteredCourses.push(registration);

            localStorage.setItem("students", JSON.stringify(students));

            updateCourseData(selectedCourse, sectionNo);

            alert(`Successfully registered for ${selectedCourse.name} section ${sectionNo}`);


        }

        function updateCourseData(course, sectionNo) {
            const courseToUpdate = courses.find(c => c.name === course.name);
            if (!courseToUpdate) {
                console.error('Course not found for update');
                return;
            }

            const sectionToUpdate = courseToUpdate.section?.find(sec => sec.sectionNo === sectionNo);
            if (!sectionToUpdate) {
                console.error('Section not found');
                console.log('Available sections:', courseToUpdate.section);
                return false;
            }
            if (sectionToUpdate.enrolledStudents < sectionToUpdate.maxSeats) {
                sectionToUpdate.enrolledStudents++;

                if (sectionToUpdate.enrolledStudents >= sectionToUpdate.maxSeats) {
                    sectionToUpdate.status = "Closed";
                    console.log(`Section ${sectionNo} is now full`);
                }
            } else {
                console.log(`Section ${sectionNo} is already full`);
            }

            localStorage.setItem("courses", JSON.stringify(courses));

            displayCourses(courses);
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
            console.log('change');
        }

        function search(e) {
            const searchInput = e.target.value.toLowerCase();
            const filter = filterType.value;

            let dataset;
            let displayFunction;
            let nameField, categoryField;


            const student = students.find(s =>
                s.user.some(u => u.username === user.username));


            switch (currentView) {
                case 'all':
                    dataset = courses;
                    displayFunction = displayCourses;
                    nameField = 'name';
                    categoryField = 'category';
                    break;
                case 'registered':
                    dataset = student?.RegisteredCourses || [];
                    displayFunction = displayRegisteredCourses;
                    nameField = 'courseName';
                    categoryField = 'courseCategory';
                    break;
                case 'current':
                    dataset = student?.CurrentCourses || [];
                    displayFunction = displayCurrentCourses;
                    nameField = 'name';
                    categoryField = 'category';
                    break;
                case 'finished':
                    dataset = student?.finishedCourses || [];
                    displayFunction = finishedCourses;
                    nameField = 'courseName';
                    categoryField = null;
                    break;
                default:
                    dataset = courses;
                    displayFunction = displayCourses;
                    nameField = 'name';
                    categoryField = 'category';
            }

            if (!Array.isArray(dataset)) {
                console.error("Invalid dataset:", dataset);
                dataset = [];
            }

            const filtered = dataset.filter(item => {
                const name = item[nameField]?.toString().toLowerCase() || "";
                const category = categoryField
                    ? item[categoryField]?.toString().toLowerCase() || ""
                    : "";


                if (filter === 'name') {
                    return name.includes(searchInput);
                } else if (filter === 'category') {
                    return category.includes(searchInput);
                } else {
                    return name.includes(searchInput) || category.includes(searchInput);
                }
            });

            displayFunction(filtered);
        }

    }

});

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../Login/login.html";
}