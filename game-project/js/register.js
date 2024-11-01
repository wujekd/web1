import regAudio from '../utilities/regAudio.js';
import setGoToScoreTable from "../utilities/scoreTableBtn.js";

// Set up the "Score Table" button functionality
setGoToScoreTable(document.getElementById("scoreTableButton"));

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector(".registration");
    const registerButton = document.getElementById("registerBtn");
    const messageDiv = document.getElementById('message');

    // Input elements and validation alert elements
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById("email");
    const emailAlert = document.getElementById("email-regex-alert");
    const phoneInput = document.getElementById("phone");
    const phoneAlert = document.getElementById("phone-regex-alert");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const usernameLengthAlert = document.getElementById('username-length-alert');
    const passwordLengthAlert = document.getElementById('password-length-alert');
    const passwordNumberAlert = document.getElementById('password-number-alert');
    const passwordSpecialAlert = document.getElementById('password-special-alert');
    const confirmPasswordAlert = document.getElementById("password-match");

    // Regex patterns for input validation
    const usernameRegex = /^.{5,}$/;
    const passwordRegex = { length: /^.{6,}$/, number: /[0-9]/, special: /[!@#$%^&*/'|_-`+~?]/ };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneNumberRegex = /^\+?[0-9\s\-()]{7,15}$/;

    // Validation flags for form fields
    let usernameOk = false;
    let passwordOk = [false, false, false, false];
    let emailOk = false;
    let phoneOk = false;

    // Attach event listeners for input validation
    usernameInput.addEventListener("input", checkUsername);
    passwordInput.addEventListener("input", checkPassword);
    confirmPasswordInput.addEventListener("input", checkPassword);
    emailInput.addEventListener("input", checkEmail);
    phoneInput.addEventListener("input", checkPhoneNumber);

    // Enable/disable register button based on all validations
    function checkAll() {
        if (usernameOk && passwordOk.every(v => v) && emailOk && phoneOk) {
            registerButton.classList.remove("disabled");
            registerButton.disabled = false;
        } else {
            registerButton.classList.add("disabled");
            registerButton.disabled = true;
        }
    }

    // Check username validity
    function checkUsername() {
        const username = usernameInput.value;

        if (usernameRegex.test(username)) {
            usernameLengthAlert.classList.add("valid");
            usernameLengthAlert.textContent = "Checking availability...";
            const currentUsername = username;

            setTimeout(() => {
                if (usernameInput.value === currentUsername) {
                    if (userExists(currentUsername)) {
                        usernameOk = false;
                        usernameLengthAlert.classList.remove("valid");
                        usernameLengthAlert.textContent = "This username is already taken!";
                    } else {
                        usernameOk = true;
                        usernameLengthAlert.classList.remove("invalid");
                        usernameLengthAlert.textContent = "Username is available!";
                    }
                    checkAll();
                }
            }, 650);
        } else {
            usernameOk = false;
            usernameLengthAlert.classList.remove("valid");
            usernameLengthAlert.textContent = "Username needs at least 5 characters";
        }
        checkAll();
    }

    // Check email validity
    function checkEmail() {
        const email = emailInput.value;

        setTimeout(() => {
            if (emailRegex.test(email)) {
                emailOk = true;
                emailAlert.classList.remove("invalid");
                emailAlert.classList.add("valid");
                emailAlert.textContent = "Email format is valid!";
            } else {
                emailOk = false;
                emailAlert.classList.remove("valid");
                emailAlert.classList.add("invalid");
                emailAlert.textContent = "Invalid email format";
            }
            checkAll();
        }, 300);
    }

    // Check phone number validity
    function checkPhoneNumber() {
        const phoneNumber = phoneInput.value;

        setTimeout(() => {
            if (phoneNumberRegex.test(phoneNumber)) {
                phoneOk = true;
                phoneAlert.classList.remove("invalid");
                phoneAlert.classList.add("valid");
                phoneAlert.textContent = "Phone number format is valid!";
            } else {
                phoneOk = false;
                phoneAlert.classList.remove("valid");
                phoneAlert.classList.add("invalid");
                phoneAlert.textContent = "Invalid phone number format";
            }
            checkAll();
        }, 300);
    }

    // Check password strength and match
    function checkPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        passwordOk[0] = passwordRegex.length.test(password);
        passwordOk[1] = passwordRegex.number.test(password);
        passwordOk[2] = passwordRegex.special.test(password);
        passwordOk[3] = password === confirmPassword && passwordOk.slice(0, 3).every(v => v);

        passwordLengthAlert.classList.toggle("valid", passwordOk[0]);
        passwordNumberAlert.classList.toggle("valid", passwordOk[1]);
        passwordSpecialAlert.classList.toggle("valid", passwordOk[2]);
        confirmPasswordAlert.classList.toggle("valid", passwordOk[3]);

        passwordLengthAlert.textContent = passwordOk[0] ? `Password has ${password.length} characters!` : "Password has to be at least 6 characters long";
        passwordNumberAlert.textContent = passwordOk[1] ? "Password contains a number." : "Password has to include a number";
        passwordSpecialAlert.textContent = passwordOk[2] ? "Password contains a special character" : "Password has to contain a special character";
        confirmPasswordAlert.textContent = passwordOk[3] ? "The passwords match!" : "The passwords do not match!";

        checkAll();
    }

    // Handle form submission to register user
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;

        if (!userExists(username)) {
            saveUser(username, password, email, phone);
            window.location.href = 'login.html';
        }
    });

    // Check if a username already exists in local storage
    function userExists(username) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.username === username);
    }

    // Save new user data to local storage
    function saveUser(username, password, email, phone) {
        const newUser = { username, password, created: new Date().toISOString(), email, phone };
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
    }

    // Registration animation and audio setup
    const reels = document.querySelector(".registration").querySelectorAll("img");
    const regAlert = document.querySelector(".regAlert");
    const regStartBtn = document.getElementById("regStartBtn");
    regStartBtn.addEventListener("click", () => {
        regAlert.classList.add("down");
        regStartBtn.classList.add("hidden");
        reels.forEach(reel => { reel.style.animation = "spin 3s linear infinite"; });
        audioPlayer1.play();
    });

    // Audio setup for volume bar visualization
    const volumeBar = document.getElementById('volume-bar');
    const audioPlayer1 = document.getElementById('player1');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const regAudioAnalyser = new regAudio(audioContext, volumeBar);
    regAudioAnalyser.init();
});
