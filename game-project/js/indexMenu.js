const menuElement = document.querySelector(".menu");
import { state } from "../utilities/state.js";

function renderMenu(logged, top, games) {
    const optionsDiv = menuElement.querySelector(".options");
    const infoDiv = menuElement.querySelector(".info");

    
    if (logged) {
        
        infoDiv.innerHTML = `<h3>Welcome ${state.getLogged()}!</h3>`;
        optionsDiv.innerHTML = `
            <button class="menu-btn" id="playBtn">Play</button>
            <button class="menu-btn" id="scoresBtn">Scores</button>
            <button class="menu-btn" id="logoutBtn">Log Out</button>
        `;

        optionsDiv.querySelector('#playBtn').addEventListener("click", () => {
            window.location.href = "dashboard/dash.html";
        });

        optionsDiv.querySelector('#scoresBtn').addEventListener("click", () => {
            window.location.href = "scores.html"; 
        });

        optionsDiv.querySelector('#logoutBtn').addEventListener("click", () => {
            state.setLogged(false)
            window.location.href = "index.html";
        });

    } else {

        infoDiv.innerHTML = `<h3>Welcome!</h3><p>You need to log in to play.</p>`;
        optionsDiv.innerHTML = `
            <button class="menu-btn" id="registerBtn">Register</button>
            <button class="menu-btn" id="loginBtn">Login</button>
            <button class="menu-btn" id="scoresBtn">Scores</button>
        `;

        optionsDiv.querySelector('#registerBtn').addEventListener("click", () => {
            window.location.href = "register.html";
        });

        optionsDiv.querySelector('#loginBtn').addEventListener("click", () => {
            window.location.href = "login.html";
        });

        optionsDiv.querySelector('#scoresBtn').addEventListener("click", () => {
            window.location.href = "scores.html";
        });
    }
}

renderMenu(state.getLogged());