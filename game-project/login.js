import loginAuth from './loginAuth.js';

document.addEventListener("DOMContentLoaded", function(){

    const loginForm = document.querySelector('.login');
    
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const check = loginAuth(username, password)
        if (check == true){
            localStorage.setItem('appState', JSON.stringify({ logged : username }));
            //show success
            //redirect to game
        } else if (check == false) {
            console.log("wrong password")
        } else if (check == null) {
            console.log("user doesnt exist")
        }
    })



})