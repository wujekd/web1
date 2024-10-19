import { pubsub } from "../utilities/pubsub.js";
import { getGames, getUserGames } from "../utilities/gamesHistory.js";
import { lvlsComponent } from "./lvlsComponent.js";

export const gamesHistoryComponent = {
    games: getUserGames(),
    allGames: getGames(),
    displaying: "",


    render: () => {

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
                btn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy(Number(btn.textContent)))
                historyLevelsDiv.appendChild(btn)
            });

        const sortbyScoreBtn = document.getElementById("sortScore");
        const historyLvlsBtnsDiv = document.getElementById("historyLevels");
        const sortByDateBtn = document.getElementById("sortDate");
        sortbyScoreBtn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy("score"));
        sortByDateBtn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy("date"));

        const historyLevelsBtns = historyLevelsDiv.querySelectorAll("button");
        historyLevelsBtns.forEach((btn)=> {
            btn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy(Number(btn.textContent)))
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
                } else if (typeof what == 'number') {
                    gamesHistoryComponent.games = gamesHistoryComponent.games.filter(game => game.level == what);
                    return a.overallScore - b.overallScore;
                }
                return 0;
            });
            gamesHistoryComponent.showUserGames();
            gamesHistoryComponent.games = getUserGames();

        } else if (gamesHistoryComponent.displaying == "scoreTable"){
            gamesHistoryComponent.allGames.sort((a, b) => {
                if (what == "date") {
                    return new Date(a.date).getTime() - new Date(b.date).getTime(); 
                } else if (what == "score") {
                    return a.overallScore - b.overallScore;
                } else if (typeof what == 'number') {
                    gamesHistoryComponent.allGames = gamesHistoryComponent.allGames.filter(game => game.level == what);
                    return a.overallScore - b.overallScore;
                }
                return 0; 
            });
            gamesHistoryComponent.showScoreTable();
            gamesHistoryComponent.allGames = getGames();
        }
    }
};