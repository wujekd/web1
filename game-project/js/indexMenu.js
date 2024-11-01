const menuElement = document.querySelector(".menu");
import { state } from "../utilities/state.js";
import setGoToScoreTable from "../utilities/scoreTableBtn.js";

// Set up the "Score Table" button functionality
setGoToScoreTable(document.getElementById("scoreTableButton"));

document.addEventListener("DOMContentLoaded", () => {

    // Renders the menu based on the user's login status
    function renderMenu(logged) {
        const optionsDiv = menuElement.querySelector(".options");
        const infoDiv = menuElement.querySelector(".info");

        // If user is logged in, show play and logout options
        if (logged != "false") {
            infoDiv.innerHTML = `<h3 id="menuHeader">Welcome ${state.getLogged()}!</h3>
                                 <p>Click Play to begin</p>`;
            optionsDiv.innerHTML = `
                <button class="menu-btn" id="playBtn">Play</button>
                <button class="menu-btn" id="logoutBtn">Log Out</button>
            `;

            optionsDiv.querySelector('#playBtn').addEventListener("click", () => {
                window.location.href = "dash.html";
            });

            optionsDiv.querySelector('#logoutBtn').addEventListener("click", () => {
                state.setLogged(false);
                window.location.href = "index.html";
            });

        // If user is not logged in, show register and login options
        } else {
            infoDiv.innerHTML = `<h3 id="menuHeader">Welcome, stranger!</h3><p>You need to log in to play.</p>`;
            optionsDiv.innerHTML = `
                <button class="menu-btn" id="registerBtn">Register</button>
                <button class="menu-btn" id="loginBtn">Login</button>
            `;

            optionsDiv.querySelector('#registerBtn').addEventListener("click", () => {
                window.location.href = "register.html";
            });

            optionsDiv.querySelector('#loginBtn').addEventListener("click", () => {
                window.location.href = "login.html";
            });
        }
    }

    // Initial rendering of the menu
    renderMenu(state.getLogged());

});
