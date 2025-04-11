// 1. get the references of the DOM elements you will be working with
const username = document.querySelector('#username');
const pass = document.querySelector('#password');
const submit = document.querySelector('#submitButton');
const form = document.querySelector('form');

// 2. add event listeners to the DOM elements
submit.addEventListener('click', navigation);

// step 3: define the event handlers
let users = localStorage.users ? JSON.parse(localStorage.users) : [];
if (users.length === 0) fetchUsers();


async function fetchUsers() {
    try {
        const response = await fetch('../Data/users.json');
        const data = await response.json();
        users = data.users;
        localStorage.users = JSON.stringify(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function navigation(e) {
    e.preventDefault();
    fetchUsers();


    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if (!username.value || !pass.value) {
        return;
    }

    const loogedUser = users.find(user => username.value === user.username && pass.value === user.pass);

    if (!loogedUser) {
        alert("Invalid username or password");
        return;
    }

    if (loogedUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(loogedUser));
        if (loogedUser.role === 'student') window.location.href = "../Student/student.html";
        else if (loogedUser.role === 'administrator') window.location.href = "../Administrator/admin.html";
        else if (loogedUser.role === 'instructor') window.location.href = "../Instructor/instructor.html";
    }
}




