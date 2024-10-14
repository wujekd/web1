import { pubsub } from "../utilities/pubsub.js";
import { state } from "../utilities/state.js";

export const displayComponent = {

    init: ()=>{
        const infoDash = document.querySelector(".infoDash");
        infoDash.innerHTML = "<h1>Select a level or a past game to see more details..."

        pubsub.subscribe('gameSelected', displayComponent.gameSelected);
        pubsub.subscribe('levelSelected', displayComponent.levelSelected);
    },

    gameSelected: (game)=>{
        const infoDash = document.querySelector(".infoDash");
        infoDash.innerHTML = "";
        const template = document.getElementById("gameInfoTemplate");
        console.log(template)
        let div = template.content.cloneNode(true).firstElementChild

        const levelInfo = div.querySelector("#levelInfo");
        const dateInfo = div.querySelector("#dateInfo");
        const scoreInfo = div.querySelector("#scoreInfo");

        levelInfo.innerHTML = `LEVEL: ${ game.level }`
        dateInfo.innerHTML = `date: ${ game.date }`
        scoreInfo.innerHTML = `overall score: ${ game.overallScore }`

        infoDash.appendChild(div);
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
    }
}