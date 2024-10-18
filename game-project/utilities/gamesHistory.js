import {state} from "../utilities/state.js"


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

export function getGames() {
    return JSON.parse(localStorage.getItem('games')) || [];
}

export function getUserGames(){
    const user = state.getLogged()
    const games = getGames();
    return games.filter(game => game.user === user);
}