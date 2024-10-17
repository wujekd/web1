
import regAudio from './utilities/regAudio.js'
import PitchVisualizer from './utilities/pitch-visualizer.js';
import updateMeter from './utilities/updateMeter.js';

document.addEventListener("DOMContentLoaded", ()=>{

    const form = document.querySelector(".registration");
    const registerButton = document.getElementById("registerBtn");
    const messageDiv = document.getElementById('message');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const usernameLengthAlert = document.getElementById('username-length-alert');
    const passwordLengthAlert = document.getElementById('password-length-alert');
    const passwordNumberAlert = document.getElementById('password-number-alert');
    const passwordSpecialAlert = document.getElementById('password-special-alert');
    const confirmPasswordAlert = document.getElementById("password-match");
    
    const usernameRegex = /^.{5,}$/;  
    const passwordRegex = {
        length: /^.{6,}$/,                 
        number: /[0-9]/,                   
        special: /[!@#$%^&*/'|_-`+~?]/                
    };

    let usernameOk = false;
    let passwordOk = [false, false, false, false]; //[length, number, special char, confirm match]

    usernameInput.addEventListener("input", checkUsername);
    passwordInput.addEventListener("input", checkPassword);
    confirmPasswordInput.addEventListener("input", checkPassword);
    

    function checkAll(){
        if (usernameOk && passwordOk[0] && passwordOk[1] && passwordOk[2] && passwordOk[3]){
            registerButton.classList.remove("disabled");
            registerButton.disabled = false;
        } else {
            registerButton.classList.add("disabled");
            registerButton.disabled = true;
        }
    }

    function checkUsername() {
        const username = usernameInput.value;
    
        if (usernameRegex.test(username)) {
            usernameLengthAlert.classList.add("valid")
            usernameLengthAlert.textContent = "Checking availability...";
    
            const currentUsername = username;
    
            setTimeout(() => {
                if (usernameInput.value === currentUsername) {
                    if (userExists(currentUsername)) {
                        usernameOk = false;
                        usernameLengthAlert.classList.remove("valid")
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

    function checkPassword(){
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (passwordRegex.length.test(password)){
            passwordOk[0] = true;
            passwordLengthAlert.classList.add("valid");
            const pLength = password.length;
            passwordLengthAlert.textContent = `Password has ${pLength} characters!`;
        } else {
            passwordOk[0] = false;
            passwordLengthAlert.classList.remove("valid");
            passwordLengthAlert.textContent = "Password has to be at least 6 characters long";
        }

        if (passwordRegex.number.test(password)){
            passwordOk[1] = true;
            passwordNumberAlert.classList.add("valid");
            passwordNumberAlert.textContent = "Password contains a number."
        }   else {
            passwordOk[1] = false;
            passwordNumberAlert.classList.remove("valid");
            passwordNumberAlert.textContent = "Password has to include a number";
        }

        if (passwordRegex.special.test(password)){
            passwordOk[2] = true;
            passwordSpecialAlert.classList.add("valid");
            passwordSpecialAlert.textContent = 'Password contains a special character'
        } else {
            passwordOk[2] = false;
            passwordSpecialAlert.classList.remove("valid");
            passwordSpecialAlert.textContent = 'Password has to contain a special character';
        }

        if (password == confirmPassword && passwordOk[0] && passwordOk[1] && passwordOk[2]) {
            passwordOk[3] = true;
            confirmPasswordAlert.classList.add("valid");
            confirmPasswordAlert.textContent = "The passwords match!"
            
        } else {
            passwordOk[3] = false;
            confirmPasswordAlert.classList.remove("valid");
            confirmPasswordAlert.textContent = "The passwords do not match!"
            
        }

        checkAll();
    }


    form.addEventListener("submit", function(e){
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword");

        if (userExists(username)){
            console.log("user exists!")
        } else {
                saveUser(username, password);
                window.location.href = 'login.html'
        }
    })

    function userExists(username){
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users == []){
            return false
        } else {
            return users.some(user => user.username === username);
        }
    }

    function saveUser(username, password){
        const newUser = {
            username : username,
            password : password,
            created : new Date().toISOString()
        }
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

    }

    const regAlert = document.querySelector(".regAlert")
    const regStartBtn = document.getElementById("regStartBtn");
    regStartBtn.addEventListener("click", ()=> {
                                                regAlert.classList.add("down");
                                                regStartBtn.classList.add("hidden");
                                            })








//player //player //player //player //player //player //player //player 









const volumeBar = document.getElementById('volume-bar');
const audioPlayer1 = document.getElementById('player1');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();



const regAudioAnalyser = new regAudio(audioContext, volumeBar);



regAudioAnalyser.init()

// updateMeter(audioAnalyser, volumeBar);







// chart ?

google.charts.load('current', {'packages':['gauge']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

    var data = google.visualization.arrayToDataTable([
      ['', 'Value'],
      ['', 80],
      ['', 55],
      ['', 68]
    ]);

    var options = {
      width: 300, height: 120,
      redFrom: 90, redTo: 100,
      yellowFrom:75, yellowTo: 90,
      minorTicks: 5
    };

    var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

    chart.draw(data, options);

    // setInterval(function() {
    //   data.setValue(0, 1, 40 + Math.round(60 * Math.random()));
    //   chart.draw(data, options);
    // }, 13000);
    // setInterval(function() {
    //   data.setValue(1, 1, 40 + Math.round(60 * Math.random()));
    //   chart.draw(data, options);
    // }, 200);
    // setInterval(function() {
    //   data.setValue(2, 1, 60 + Math.round(20 * Math.random()));
    //   chart.draw(data, options);
    // }, 26000);

    setTimeout(()=> {
        data.setValue(0, 1, 40 + Math.round(60 * Math.random()));
    chart.draw(data, options);
}, 1000)

  }



})