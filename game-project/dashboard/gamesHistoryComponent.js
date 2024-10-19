import { pubsub } from "../utilities/pubsub.js";
import { getGames, getUserGames } from "../utilities/gamesHistory.js";
import { lvlsComponent } from "./lvlsComponent.js";

export const gamesHistoryComponent = {
    games: {},
    allGames: getGames(),


    render: () => {

        gamesHistoryComponent.games = getUserGames();
        gamesHistoryComponent.showUserGames();



        const yourGamesBtn = document.getElementById("urGamesbtn")
        const scoreTableBtn = document.getElementById("scoreTableBtn");
        yourGamesBtn.addEventListener("click", gamesHistoryComponent.showUserGames);
        scoreTableBtn.addEventListener("click", gamesHistoryComponent.showScoreTable);


        const historyLevelsDiv = document.querySelector(".historyLevels");
        lvlsComponent.lvList.forEach((lvl, index)=>{
                                                    const btn = document.createElement("button")
                                                    btn.textContent = `${lvl.id}`
                                                    btn.classList.add("historyLvlBtn")
                                                    btn.addEventListener("click", ()=>{ console.log(`hey ${lvl.id}`)})
                                                    historyLevelsDiv.appendChild(btn)
        })



    },


    showUserGames: ()=>{
        const element = document.querySelector(".gamesHistory");
        element.innerHTML = "";

        gamesHistoryComponent.games.forEach((game, index) => {
            
            const gameButton = document.createElement("button");
            gameButton.classList.add("game-item");
            
            gameButton.innerHTML = `
                <div class="gameInfo">
                    <h3>Level: ${game.level}</h3>
                    <p>Date: ${new Date(game.date).toLocaleDateString()}</p>
                    <p>Score: ${game.overallScore}</p>
                </div>
            `;
            gameButton.addEventListener("click", () => {
                
                gamesHistoryComponent.select(index);
            });
            element.appendChild(gameButton); 
            
        });
    },


    showScoreTable: ()=>{
        const element = document.querySelector(".gamesHistory");
        element.innerHTML = "";

        gamesHistoryComponent.allGames.forEach((game, index) => {
            
            const gameButton = document.createElement("button");
            gameButton.classList.add("game-item");
            
            gameButton.innerHTML = `
                <div class="gameInfo">
                    <h3>Score: ${game.overallScore}</h3>
                    <p>Date: ${new Date(game.date).toLocaleDateString()}</p>
                    <p>Level: ${game.level}</p>
                </div>
            `;
            gameButton.addEventListener("click", () => {
                
                gamesHistoryComponent.select(index);
            });
            element.appendChild(gameButton); 
            
        });
    },


    select: (index)=>{
        pubsub.publish("gameSelected", gamesHistoryComponent.allGames[index]);
    }
};