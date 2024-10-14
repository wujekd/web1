import state from "../utilities/state.js"

function pullGames(){
    return JSON.parse(localStorage.getItem("history"));
}

export function getUsersGames(){
    user = state.getLogged();
    if (user == null) {window.location.replace("index.html")}
    return pullGames().filter((g)=> g.user == user);
}