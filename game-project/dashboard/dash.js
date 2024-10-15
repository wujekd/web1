import PitchVisualizer from "../utilities/pitch-visualizer.js";
import { gamesHistoryComponent } from "./gamesHistoryComponent.js";
import { lvlsComponent } from "./lvlsComponent.js";
import { displayComponent } from "./displayComponent.js";


document.addEventListener("DOMContentLoaded", ()=>{

    const visualiser = new PitchVisualizer("pitch-canvas", 3, true);


    lvlsComponent.render();
    gamesHistoryComponent.render();
    displayComponent.init(visualiser);
    

    function setgame(){
        const games = JSON.parse(localStorage.getItem("games"));
        games[2].player = "Tomek"
        // games.forEach(element => {
        //     element.player = "admin"
        // });

        localStorage.setItem("games", JSON.stringify(games))

    }
    // setgame();
})