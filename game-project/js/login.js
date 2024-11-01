import loginAuth from '../utilities/loginAuth.js';
import { state } from "../utilities/state.js";
import setGoToScoreTable from "../utilities/scoreTableBtn.js";

// Set up the "Score Table" button functionality
setGoToScoreTable(document.getElementById("scoreTableButton"));

document.addEventListener("DOMContentLoaded", function() {

    const loginForm = document.querySelector('.login');
    
    // Handle login form submission
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Authenticate user credentials
        const check = loginAuth(username, password);
        if (check === true) {
            state.setLogged(username); // Set user as logged in
            window.location.href = 'index.html'; // Redirect to home page
        } else if (check === false) {
            alert('Incorrect password. Please try again.');
        } else if (check === null) {
            alert('No user found with that username.');
        }
    });
});
