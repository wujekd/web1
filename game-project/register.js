document.addEventListener("DOMContentLoaded", ()=>{

    const form = document.querySelector(".registration");
    const registerButton = document.getElementById("registerBtn");
    const messageDiv = document.getElementById('message');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const usernameLengthAlert = document.getElementById('username-length-alert');
    const passwordLengthAlert = document.getElementById('password-length-alert');
    const passwordNumberAlert = document.getElementById('password-number-alert');
    const passwordSpecialAlert = document.getElementById('password-special-alert');
    
    const usernameRegex = /^.{5,}$/;  
    const passwordRegex = {
        length: /^.{6,}$/,                 
        number: /[0-9]/,                   
        special: /[!@#$%^&*]/                
    };

    let usernameOk = false;
    let passwordOk = [false, false, false]; //[length, number, special char]

    usernameInput.addEventListener("input", checkUsername);
    passwordInput.addEventListener("input", checkPassword);

    function checkAll(){
        if (usernameOk && passwordOk[0] && passwordOk[1] && passwordOk[2]){
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
                        checkAll();
                        usernameLengthAlert.classList.remove("valid")
                        usernameLengthAlert.textContent = "This username is already taken!";
                    } else {
                        usernameOk = true;
                        checkAll();
                        usernameLengthAlert.classList.remove("invalid");
                        usernameLengthAlert.textContent = "Username is available!";
                    }
                }
            }, 650);
        } else {
            usernameOk = false;
            checkAll();
            usernameLengthAlert.classList.remove("valid");
            usernameLengthAlert.textContent = "Username needs at least 5 characters";
        }
    }

    function checkPassword(){
        const password = passwordInput.value;

        if (passwordRegex.length.test(password)){
            passwordOk[0] = true;
            checkAll();
            passwordLengthAlert.classList.add("valid");
            const pLength = password.length;
            passwordLengthAlert.textContent = `Password has ${pLength} characters!`;
        } else {
            passwordOk[0] = false;
            checkAll();
            passwordLengthAlert.classList.remove("valid");
            passwordLengthAlert.textContent = "Password has to be at least 6 characters long";
        }

        if (passwordRegex.number.test(password)){
            passwordOk[1] = true;
            checkAll();
            passwordNumberAlert.classList.add("valid");
            passwordNumberAlert.textContent = "Password contains a number."
        }   else {
            passwordOk[1] = false;
            checkAll();
            passwordNumberAlert.classList.remove("valid");
            passwordNumberAlert.textContent = "Password has to include a number";
        }

        if (passwordRegex.special.test(password)){
            passwordOk[2] = true;
            checkAll();
            passwordSpecialAlert.classList.add("valid");
            passwordSpecialAlert.textContent = 'Password contains a special character'
        } else {
            passwordOk[2] = false;
            checkAll();
            passwordSpecialAlert.classList.remove("valid");
            passwordSpecialAlert.textContent = 'Password has to contain a special character';
        }
    }


    form.addEventListener("submit", function(e){
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        // const confirmPwd = documentadfgdfg

        if (userExists(username)){
            console.log("user exists!")
        } else {
            if (password === confirmPwd){
                saveUser(username, password);
            } else {
                // passwords doesnt match
            }
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
            "username" : username,
            "password" : password,
            "created" : new Date().toISOString()
        }
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

    }

})