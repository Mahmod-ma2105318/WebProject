document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("loggedInUser");

    if (!user) {
        window.location.href = "../Login/login.html";
    } else {
        const studentCourses= document.querySelector("#studentCurrentCourses");
        studentCourses.addEventListener('click', () => {
            displayCurrentCoursesByInstructor(user.username);
        });
    
        user = JSON.parse(user);

        
        function addInstructorInfo() {
            const instructorInfoDiv = document.getElementById("instructor-info");

            if (instructorInfoDiv) {
                instructorInfoDiv.innerHTML = `<div class="user-info-container">
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
        addInstructorInfo();

        //Local Storage
        let students = localStorage.students ? JSON.parse(localStorage.students) : [];
        if (students.length === 0) fetchStudent();

        //Fetch Students
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

        function displayCurrentCoursesByInstructor(instructorName) {
            const courseContainer = document.getElementById('courseContainer');
            let html = "";
        
            const courseGroups = {};
        
            // Group students by course name and instructor
            students.forEach(student => {
                student.CurrentCourses.forEach(course => {
                    const courseName = course.name;
        
                    // Initialize an empty array for the course if not already created
                    if (!courseGroups[courseName]) {
                        courseGroups[courseName] = {
                            courseDetails: course,
                            students: []
                        };
                    }
        
                    // Only add students for courses that match the instructor
                    if (course.instructor === instructorName) {
                        courseGroups[courseName].students.push({
                            username: student.user[0].username,
                            course: course
                        });
                    }
                });
            });
        
            // Iterate over the grouped courses and generate HTML for courses taught by the instructor
            for (const courseName in courseGroups) {
                const courseGroup = courseGroups[courseName];
                
                // Check if the course has students and the instructor matches
                if (courseGroup.students.length > 0) {
                    const course = courseGroup.courseDetails;
        
                    html += `
                        <div class="course-group">
                            <h3 class="course-name">${courseName}</h3>
                            <div class="students-list">
                    `;
        
                    // Iterate over students in this course and add their details
                    courseGroup.students.forEach(student => {
                        const username = student.username;
                        const course = student.course;
                        const courseId = `${username}-${courseName.replace(/\s+/g, '-')}`;
        
                        html += `
                            <div class="course-card">
                                <div class="student-name"><strong>Student: ${username}</strong></div>
                                <div class="course-name"><strong>${course.name}</strong></div>
                                <div>Category: ${course.category}</div>
                                <div>Credits: ${course.credits}</div>
                                <div>Instructor: ${course.instructor}</div>
                                <div>Prerequisites: ${course.prerequisites.join(", ")}</div>
                                <div>
                                    <label for="grade-${courseId}" class="grade-label">Enter Grade:</label>
                                    <input type="text" id="grade-${courseId}" class="grade-input" placeholder="e.g. A+" />
                                   <button 
                                    class="submit-button"
                                    data-username="${username}" 
                                    data-course="${course.name}" 
                                    data-input-id="grade-${courseId}">
                                    Submit Grade
                                    </button>
                                </div>
                            </div>
                        `;
                    });
        
                    html += `
                            </div>
                        </div>
                    `;
                }
            }
        
            // Update the course container with the generated HTML
            courseContainer.innerHTML = html;
        }
        const buttons = document.querySelectorAll('.submit-button');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const username = button.dataset.username;
                const courseName = button.dataset.course;
                const inputId = button.dataset.inputId;

                submitGrade(username, courseName, inputId);
                displayCurrentCoursesByInstructor(courseName); // optionally refresh
            });
        });
        
        
        
    }
    function submitGrade(username, courseName, inputId) {
        const gradeInput = document.getElementById(inputId);
        const gradeValue = gradeInput.value.trim();
    
        if (!gradeValue) {
            alert("Please enter a grade.");
            return;
        }
    
        console.log(`Grade submitted for ${username} in ${courseName}: ${gradeValue}`);
        alert(`Grade "${gradeValue}" submitted for ${username} - ${courseName}`);
    
        // Find the student by username
        const student = students.find(student => student.user[0].username === username);
        
        if (!student) {
            alert("Student not found.");
            return;
        }
    
        // Find the course in the CurrentCourses array
        const course = student.CurrentCourses.find(course => course.name === courseName);
        
        if (!course) {
            alert("Course not found.");
            return;
        }
    
        // Create the grade entry for finishedCourses
        const gradeEntry = {
            courseName: course.name,
            Grade: gradeValue
        };
    
        // Add the grade to finishedCourses
        student.finishedCourses.push(gradeEntry);
    
        // Optionally, remove the course from CurrentCourses (if the course is completed)
        const courseIndex = student.CurrentCourses.indexOf(course);
        if (courseIndex !== -1) {
            student.CurrentCourses.splice(courseIndex, 1);
        }
    
        // Clear the input field
        gradeInput.value = "";
}
    
});



function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../Login/login.html";
}
