import {state} from "../utilities/state.js"


// Save a new game record to local storage
export function saveGame(user, level, overallScore, noteScores, scoreArray) {
    const games = JSON.parse(localStorage.getItem('games')) || [];

    
    const newGame = {
        user: user,
        level: level,
        date: new Date().toISOString(),
        overallScore: overallScore,
        noteScores: noteScores,
        scoreArray: scoreArray
    };

    games.push(newGame);
    localStorage.setItem('games', JSON.stringify(games));
}

// Retrieve all games from local storage
export function getGames() {
    return JSON.parse(localStorage.getItem('games')) || [];
}

// Retrieve games for the currently logged-in user
export function getUserGames(){
    const user = state.getLogged()
    const games = getGames();
    return games.filter(game => game.user === user);
}