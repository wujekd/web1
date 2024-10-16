import PitchVisualizer from "../utilities/pitch-visualizer.js";
import { pubsub } from "../utilities/pubsub.js";
import { state } from "../utilities/state.js";
import { lvlsComponent } from "./lvlsComponent.js";
import { gamesHistoryComponent } from "./gamesHistoryComponent.js";


export const displayComponent = {

    visualiser: {},
    infoDash: document.querySelector(".infoDash"),
    logged: state.getLogged(),

    init: ()=>{

        pubsub.subscribe('gameSelected', displayComponent.gameSelected);
        pubsub.subscribe('levelSelected', displayComponent.levelSelected);

        document.querySelector(".showAccountBtn").addEventListener("click", displayComponent.showAccount)

        displayComponent.visualiser = new PitchVisualizer("pitch-canvas", 3, true);

        displayComponent.showAccount();
    },

    showAccount: ()=> {
        const template = document.querySelector('#userInfoTemplate');
        const div = template.content.cloneNode(true).firstElementChild;
        const gameCount = gamesHistoryComponent.games.length;

        console.log("logged: ", displayComponent.logged);
        console.log("gamecount: ", gameCount);

    
        div.querySelector('#userName').textContent = displayComponent.logged;
        div.querySelector('#gameCount').textContent = gameCount;
    

        displayComponent.infoDash.innerHTML = "";
        displayComponent.infoDash.append(div);
    },
  
    gameSelected: (game)=>{
        displayComponent.infoDash.innerHTML = "";
        const template = document.getElementById("gameInfoTemplate");
        let div = template.content.cloneNode(true).firstElementChild

        const levelInfo = div.querySelector("#levelInfo");
        const dateInfo = div.querySelector("#dateInfo");
        const scoreInfo = div.querySelector("#scoreInfo");

        levelInfo.innerHTML = `LEVEL: ${ game.level }`
        dateInfo.innerHTML = `date: ${ game.date }`
        scoreInfo.innerHTML = `overall score: ${ game.overallScore }`

        displayComponent.infoDash.appendChild(div);

        displayComponent.visualiser.clear();
        displayComponent.visualiser.setTarget(lvlsComponent.lvList[game.level-1].levelMelody);
        displayComponent.visualiser.drawTarget();
        displayComponent.animatePathDrawing(game.scoreArray, displayComponent.visualiser, 10);
    },


    levelSelected: (level) => {
        displayComponent.infoDash.innerHTML = ""
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

        displayComponent.infoDash.appendChild(div);

        displayComponent.visualiser.clear();
        displayComponent.visualiser.setTarget(lvlsComponent.lvList[level.id-1].levelMelody);
        displayComponent.visualiser.drawTarget();
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