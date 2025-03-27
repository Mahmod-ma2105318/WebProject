// 1. get the references of the DOM elements you will be working with
const username = document.querySelector('#Username');
const pass = document.querySelector('#Password');
const submit = document.querySelector('#submitButton');

// 2. add event listeners to the DOM elements
submit.addEventListener('click', Authenticate);

// step 3: define the event handlers
let users = localStorage.users ? JSON.parse(localStorage.users) : [];
if (users.length === 0) fetchUsers();


async function fetchUsers() {
    try {
        const response = await fetch('users.json');
        const data = await response.json();
        users = data.users;
        localStorage.users = JSON.stringify(users);

    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function Authenticate(e) {
    e.preventDefault();
    fetchUsers();

    const loogedUser = users.find(user => username.value === user.username && pass.value === user.pass);

    if (loogedUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(loogedUser))
        if (loogedUser.role === 'student') window.location.href = "../Student/main.html";
        else if (loogedUser.role === 'administrator') window.location.href = "../Administrator/admin.html";
        else if (loogedUser.role === 'instructor') window.location.href = "../Instructor/instructor.html";

    }
    else {
        alert("Invalid username or password!");

    }
}


