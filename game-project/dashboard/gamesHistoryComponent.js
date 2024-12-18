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
                const btn = document.createElement("button");
                btn.textContent = `${lvl.id}`;
                btn.classList.add("historyLvlBtn");
                btn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy(Number(btn.textContent)));
                historyLevelsDiv.appendChild(btn);
            });

        const sortbyScoreBtn = document.getElementById("sortScore");
        // const historyLvlsBtnsDiv = document.getElementById("historyLevels");
        const sortByDateBtn = document.getElementById("sortDate");
        sortbyScoreBtn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy("score"));
        sortByDateBtn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy("date"));

        const historyLevelsBtns = historyLevelsDiv.querySelectorAll("button");
        historyLevelsBtns.forEach((btn)=> {
            btn.addEventListener("click", ()=> gamesHistoryComponent.sortGamesBy(Number(btn.textContent)))
        })

        

        const sortLvlBtn = document.getElementById("sortLvl");


        function expandHistoryLevels() {
            historyLevelsDiv.style.maxHeight = "500px";
            historyLevelsDiv.style.overflow = "visible"; }

        function collapseHistoryLevels() {
            historyLevelsDiv.style.maxHeight = "0";
            historyLevelsDiv.style.overflow = "hidden";
        }

        sortLvlBtn.addEventListener("mouseover", expandHistoryLevels);
        historyLevelsDiv.addEventListener("mouseover", expandHistoryLevels);

        sortLvlBtn.addEventListener("mouseout", (event) => {
            if (!historyLevelsDiv.matches(":hover")) {
                collapseHistoryLevels();
            }
        });

        historyLevelsDiv.addEventListener("mouseout", (event) => {
            if (!sortLvlBtn.matches(":hover")) {
                collapseHistoryLevels();
            }
        });

    },

    setNavbarHighlight: (btn) => {
        const gameNavBarButton = document.getElementById("gameNavBarButton");

        const scoreTableNavBarButton = document.getElementById("scoreTableNavBarButton");
        
    
        if (btn === "scoreTable") {
            // Add activeMenu to scoreTable button and remove from game button
            if (!scoreTableNavBarButton.classList.contains("activeMenu")) {
                scoreTableNavBarButton.classList.add("activeMenu");
            }
            gameNavBarButton.classList.remove("activeMenu");
        } else if (btn === "games") {
            // Add activeMenu to game button and remove from scoreTable button
            if (!gameNavBarButton.classList.contains("activeMenu")) {
                gameNavBarButton.classList.add("activeMenu");
            }
            scoreTableNavBarButton.classList.remove("activeMenu");
        }
    },
    

    showUserGames: ()=>{

        gamesHistoryComponent.setNavbarHighlight("games")

        const historyModeDisplay = document.getElementById("historyModeDisplay")
        historyModeDisplay.textContent = "Your Games:"


        gamesHistoryComponent.displaying = "userGames";
        const element = document.querySelector(".gamesHistory");
        element.innerHTML = "";

        gamesHistoryComponent.games.forEach((game, index) => {
            
            const gameButton = document.createElement("button");
            gameButton.classList.add("game-item");
            
            gameButton.innerHTML = `
            <div class="gameInfo" style="position: relative">
                <div style="width: 100%; text-align: left;">
                    <div id="meter" style="height: 10px; width: 0%; background-color: black; margin: 3px 0; transition: width 0.6s ease;"></div>
                </div>
                
                <div>
                    <h5>Level: ${game.level}</h5>
                    <h5>Score: ${game.overallScore}</h5>
                    <p>Date: ${new Date(game.date).toLocaleDateString()}</p>
                </div>
            </div>
        `;
        
        
            gameButton.addEventListener("click", () => {
                
                gamesHistoryComponent.select(game);
            });
            element.appendChild(gameButton);

            const meter = gameButton.querySelector("#meter");
            setTimeout(() => {
                meter.style.width = `${game.overallScore}%`;
            }, 1);
        });
    },


    showScoreTable: ()=>{
        
        gamesHistoryComponent.setNavbarHighlight("scoreTable")

        const historyModeDisplay = document.getElementById("historyModeDisplay")
        historyModeDisplay.textContent = "Score Table:"


        gamesHistoryComponent.displaying = "scoreTable"
        const element = document.querySelector(".gamesHistory");
        element.innerHTML = "";

        gamesHistoryComponent.allGames.forEach((game, index) => {
            
            const gameButton = document.createElement("button");
            gameButton.classList.add("game-item");
            
            gameButton.innerHTML = `
                <div class="gameInfo">
                <div style="width: 100%; text-align: left;">
                    <div id="meter" style="height: 10px; width: 0%; background-color: black; margin: 3px 0; transition: width 0.6s ease;"></div>
                </div>
                    <h5>Score: ${game.overallScore}</h5>
                    <p>Level: ${game.level}</p>
                    <h5>User: ${game.user}</h5>
                    <p>Date: ${new Date(game.date).toLocaleDateString()}</p>
                    
                </div>
            `;
            gameButton.addEventListener("click", () => {
                
                gamesHistoryComponent.select(game);
            });
            element.appendChild(gameButton); 

            const meter = gameButton.querySelector("#meter");
            setTimeout(() => {
                meter.style.width = `${game.overallScore}%`;
            }, 1);
            
        });
    },

    
    select: (game) => {
        pubsub.publish("gameSelected", game);
    },


    sortGamesBy: (what) => {

        if (gamesHistoryComponent.displaying == "userGames") {
            gamesHistoryComponent.games.sort((a, b) => {
                if (what == "date") {
                    return new Date(b.date).getTime() - new Date(a.date).getTime(); 
                } else if (what == "score") {
                    return b.overallScore - a.overallScore;
                } else if (typeof what == 'number') {
                    gamesHistoryComponent.games = gamesHistoryComponent.games.filter(game => game.level == what);
                    return b.overallScore - a.overallScore;
                }
                return 0;
            });

            gamesHistoryComponent.showUserGames();
            gamesHistoryComponent.games = getUserGames();

        } else if (gamesHistoryComponent.displaying == "scoreTable"){
            gamesHistoryComponent.allGames.sort((a, b) => {
                if (what == "date") {
                    return new Date(b.date).getTime() - new Date(a.date).getTime(); 
                } else if (what == "score") {
                    return b.overallScore - a.overallScore;
                } else if (typeof what == 'number') {
                    gamesHistoryComponent.allGames = gamesHistoryComponent.allGames.filter(game => game.level == what);
                    return b.overallScore - a.overallScore;
                }
                return 0; 
            });
            gamesHistoryComponent.showScoreTable();
            gamesHistoryComponent.allGames = getGames();
        }
    }
};