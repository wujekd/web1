import { pubsub } from "../utilities/pubsub.js";

export const displayComponent = {

    init: ()=>{
        const infoDash = document.querySelector(".infoDash");
        infoDash.innerHTML = "<h1>Select a level or a past game to see more details..."

        pubsub.subscribe('gameSelected', displayComponent.gameSelected);
        pubsub.subscribe('levelSelected', displayComponent.levelSelected);
    },

    gameSelected: (game)=>{
        console.log(game);
    },


    levelSelected: (level) => {
        console.log(level)
    }
}