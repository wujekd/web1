import { pubsub } from "../utilities/pubsub.js";
import { getGames, getUserGames } from "../utilities/gamesHistory.js";
import { lvlsComponent } from "./lvlsComponent.js";

export const gamesHistoryComponent = {
    games: {},
    allGames: getGames(),
    displaying: "",


    render: () => {

        gamesHistoryComponent.games = getUserGames();
        gamesHistoryComponent.showUserGames();



        const yourGamesBtn = document.getElementById("urGamesbtn")
        const scoreTableBtn = document.getElementById("scoreTableBtn");
        yourGamesBtn.addEventListener("click", gamesHistoryComponent.showUserGames);
        scoreTableBtn.addEventListener("click", gamesHistoryComponent.showScoreTable);

        const sortbyScoreBtn = document.getElementById("sortScore");
        const sortByLvlBtn = document.getElementById("sortLvl");
        const sortByDateBtn = document.getElementById("sortDate");
        sortbyScoreBtn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy("score"));
        sortByDateBtn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy("date"));


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
        gamesHistoryComponent.displaying = "userGames";
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
        console.log("show score table ")
        gamesHistoryComponent.displaying = "scoreTable"
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
    },


    sortGamesBy: (what) => {

        if (gamesHistoryComponent.displaying == "userGames") {
            console.log('testy')
            gamesHistoryComponent.games.sort((a, b) => {
                if (what == "date") {
                    return new Date(a.date).getTime() - new Date(b.date).getTime(); 
                } else if (what == "score") {
                    return a.overallScore - b.overallScore;
                } else if (typeof what == number) {
                    return b.level - a.level; 
                }
                return 0;
            });
            gamesHistoryComponent.showUserGames();

        } else if (gamesHistoryComponent.displaying == "scoreTable"){
            gamesHistoryComponent.allGames.sort((a, b) => {
                if (what == "date") {
                    console.log("date")
                    return new Date(a.date).getTime() - new Date(b.date).getTime(); 
                } else if (what == "score") {
                    console.log("score")
                    return a.overallScore - b.overallScore;
                } else if (typeof what == number) {
                    return b.level - a.level;  
                }
                return 0; 
            });
            gamesHistoryComponent.showScoreTable();
        }
    }
};