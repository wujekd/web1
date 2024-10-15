import PitchVisualizer from "../utilities/pitch-visualizer.js";
import { gamesHistoryComponent } from "./gamesHistoryComponent.js";
import { lvlsComponent } from "./lvlsComponent.js";
import { pullGames } from "../utilities/getGamesHistory.js"
import { displayComponent } from "./displayComponent.js";


document.addEventListener("DOMContentLoaded", ()=>{

    const visualiser = new PitchVisualizer("pitch-canvas", 3, true);
    

    lvlsComponent.render();
    gamesHistoryComponent.render();
    displayComponent.init(visualiser);
    

    function setgame(){
        const games = JSON.parse(localStorage.getItem("games"));
    //     games[0].level = 2;
        games.forEach(element => {
            element.player = "tomek"
        });

        localStorage.setItem("games", JSON.stringify(games))

    }
    // setgame();
})