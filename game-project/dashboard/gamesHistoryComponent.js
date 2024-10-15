import { pubsub } from "../utilities/pubsub.js";
import { getUserGames } from "../utilities/gamesHistory.js";

export const gamesHistoryComponent = {
    games: {},

    render: () => {

        gamesHistoryComponent.games = getUserGames();

        const element = document.querySelector(".gamesHistory");
        // element.innerHTML = "";

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


    select: (index)=>{
        pubsub.publish("gameSelected", gamesHistoryComponent.games[index]);
    }
};