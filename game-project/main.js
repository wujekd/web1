import Game from './game.js';
// import menu from "./components/menu.js";
import loadTemplate from "./utilities/loadTemplate.js"

const mainContainer = document.querySelector("main");

const state = { 
    logged: "dominik",
    page: "game",    
    debug: false,
};

if (state.debug === false) {
    render(state.page);
} else {
    console.log("test")
    render('debug');
}

function render(page) {
    switch (page) {
        case 'menu':
            // Render the menu and pass the necessary arguments
            // menu(mainContainer, state.logged, "Top Scores", "Game Library");
            break;

        case 'game':
            // Render the game
            const game = new Game();
            game.initGame();  // Assuming Game handles the rendering within itself
            break;

        case 'register':
            // Render the registration page
            // loadTemplate('registerPageTemplate');
            break;

        case 'login':
            // Render the login page
            // loadTemplate('loginPageTemplate');
            break;

        case 'scores':
            // Render the scores page
            // loadTemplate('scoresPageTemplate');
            break;

        case 'account':
            // Render the user account page
            // loadTemplate('accountPageTemplate');
            break;

        default:
            // If no valid page, go to the menu
            // render('menu');
            break;
    }
}

