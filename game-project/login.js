import loginAuth from './utilities/loginAuth.js';
import { state } from "./utilities/state.js"

document.addEventListener("DOMContentLoaded", function(){

    const loginForm = document.querySelector('.login');
    
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const check = loginAuth(username, password)
        if (check == true){
            state.setLogged(username)
            window.location.href = 'index.html';
        } else if (check == false) {
            alert('Incorrect password. Please try again.');
        } else if (check == null) {
            alert('No user found with that username.');
        }
    })
})
