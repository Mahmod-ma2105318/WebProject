document.addEventListener("DOMContentLoaded", function () {
    let user = localStorage.getItem("loggedInUser");

    if (!user) {
        window.location.href = "../Login/login.html";
    } else {
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
    }
});

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../Login/login.html";
}
