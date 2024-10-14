import PitchVisualizer from "../utilities/pitch-visualizer.js";
import { gamesHistoryComponent } from "./gamesHistoryComponent.js";
import { lvlsComponent } from "./lvlsComponent.js";
import { pullGames } from "../utilities/getGamesHistory.js"
import { displayComponent } from "./displayComponent.js";




document.addEventListener("DOMContentLoaded", ()=>{

    const targetMelody = [
        { note: "G#", frequency: 207.65, startTime: 0.341333, endTime: 0.8 },
        { note: "E", frequency: 164.81, startTime: 1.002666, endTime: 1.301333 },
        { note: "C#", frequency: 138.59, startTime: 1.642666, endTime: 2.421333 }
    ]

    const games = pullGames();
    const roundData = games[0].scoreArray
    console.log(roundData)

    const canvas = document.querySelector("canvas");

    const visualiser = new PitchVisualizer("pitch-canvas", 3, true);

    lvlsComponent.render();
    gamesHistoryComponent.render();

    displayComponent.init();

    function animatePathDrawing(roundData, visualiser, interval = 30) {
        let index = 0; 
    
        function drawNextPoint() {
            if (index < roundData.length) {
                const element = roundData[index];
                visualiser.addPathPoint(element.time, element.pitch); 
                visualiser.drawPath(); 
                index++;
                setTimeout(drawNextPoint, interval);
            }
        }
    
        drawNextPoint();
    }

    animatePathDrawing(roundData, visualiser, 10);


    visualiser.setTarget(targetMelody);
    visualiser.drawTarget();




    // function setgame(){
    //     const games = JSON.parse(localStorage.getItem("games"));
    //     games[0].level = 2;
    //     localStorage.setItem("games", JSON.stringify(games))

    // }

    // setgame();


})


