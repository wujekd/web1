import { pubsub } from "../utilities/pubsub.js";
import { state } from "../utilities/state.js";
import { lvlsComponent } from "./lvlsComponent.js";

export const displayComponent = {
    visualiser: {},

    init: (visualiser)=>{
        const infoDash = document.querySelector(".infoDash");
        infoDash.innerHTML = "<h1>Select a level or a past game to see more details..."

        pubsub.subscribe('gameSelected', displayComponent.gameSelected);
        pubsub.subscribe('levelSelected', displayComponent.levelSelected);


        displayComponent.visualiser = visualiser
    },

    gameSelected: (game)=>{
        const infoDash = document.querySelector(".infoDash");
        infoDash.innerHTML = "";
        const template = document.getElementById("gameInfoTemplate");
        let div = template.content.cloneNode(true).firstElementChild

        const levelInfo = div.querySelector("#levelInfo");
        const dateInfo = div.querySelector("#dateInfo");
        const scoreInfo = div.querySelector("#scoreInfo");

        levelInfo.innerHTML = `LEVEL: ${ game.level }`
        dateInfo.innerHTML = `date: ${ game.date }`
        scoreInfo.innerHTML = `overall score: ${ game.overallScore }`

        infoDash.appendChild(div);

        displayComponent.visualiser.clear();
        displayComponent.visualiser.setTarget(lvlsComponent.lvList[game.level-1].levelMelody);
        displayComponent.visualiser.drawTarget();
        displayComponent.animatePathDrawing(game.scoreArray, displayComponent.visualiser, 10);
    },


    levelSelected: (level) => {
        const infoDash = document.querySelector(".infoDash");
        infoDash.innerHTML = ""
        const template = document.getElementById("levelInfoTemplate");
        const div = template.content.cloneNode(true).firstElementChild;
        

        const nameInfo = div.querySelector("#name")
        const tempoInfo = div.querySelector("#tempo");
        const descriptionInfo = div.querySelector("#description");
        const playLevelBtn = div.querySelector("#play")

        nameInfo.innerHTML = level.name;
        tempoInfo.innerHTML = level.tempo,toString();
        descriptionInfo.innerHTML = level.info;
        playLevelBtn.innerHTML = `Play level ${ level.name }`
        playLevelBtn.addEventListener("click", ()=>{
            state.setLevelState(level.id)
            setTimeout(()=>{window.location.replace("../game.html")}, 10)
        })

        infoDash.appendChild(div);
    },



    animatePathDrawing: (roundData, visualiser, interval = 30) => {
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
}