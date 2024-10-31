import PitchVisualizer from "../utilities/pitch-visualizer.js";
import { gamesHistoryComponent } from "./gamesHistoryComponent.js";
import { lvlsComponent } from "./lvlsComponent.js";
import { displayComponent } from "./displayComponent.js";
import { saveGame } from "../utilities/gamesHistory.js";


document.addEventListener("DOMContentLoaded", ()=>{

    google.charts.load('current', {'packages':['gauge']});


    lvlsComponent.render();
    gamesHistoryComponent.render();
    displayComponent.init();
    

    function setgame(){
        const games = JSON.parse(localStorage.getItem("games"));
        games[2].user = "lolek"
        // games.forEach(element => {
        //     element.player = "Tomek"
        // });

        localStorage.setItem("games", JSON.stringify(games))

    }
    // setgame(); 









    // saveGame("test", 2, 34, {}, [])
})