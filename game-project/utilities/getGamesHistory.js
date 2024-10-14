import {state} from "../utilities/state.js"

export function pullGames(){
    return JSON.parse(localStorage.getItem("games"));
}

export function getUsersGames(){
    user = state.getLogged();
    if (user == null) {window.location.replace("index.html")}
    return pullGames().filter((g)=> g.user == user);
}