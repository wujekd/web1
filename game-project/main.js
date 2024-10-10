import PitchDetectionGame from './game.js';
import menu from "./components/menu.js"

const mainContainer = document.querySelector("main");

let debugGame = false;

const state = {}

if (debugGame) {
    loadTemplate("gameTemplate")
    document.addEventListener('DOMContentLoaded', () => {
        const game = new PitchDetectionGame();
        game.initGame();
    });    
} else {
    // loadTemplate("menuTemplate")
    menu(mainContainer, false, false,false)



}


function loadTemplate(tempID) {
    const template = document.getElementById(tempID);
    let element = template.content.cloneNode(true).firstElementChild;
    
    // Start the fade-out transition
    mainContainer.style.opacity = '0';  // Trigger the fade-out

    // Listen for the end of the transition (fade-out complete)
    setTimeout(()=> {
        // Remove the previous content and append the new one
        mainContainer.innerHTML = "";  
        mainContainer.appendChild(element);
        
        // Start the fade-in transition after the content is swapped
        mainContainer.style.opacity = '100%';  

        // Remove the event listener to prevent it from firing multiple times
        mainContainer.removeEventListener('transitionend', onTransitionEnd);
    },450);
}
