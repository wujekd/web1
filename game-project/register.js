document.addEventListener("DOMContentLoaded", ()=>{

    const form = document.querySelector(".registration")
    const messageDiv = document.getElementById('message');
    

    form.addEventListener("submit", function(e){
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (userExists(username)){
            console.log("user exists!")
        } else {
            saveUser(username, password);
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