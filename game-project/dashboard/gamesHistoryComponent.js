import { pubsub } from "../utilities/pubsub.js";
import { getUserGames } from "../utilities/gamesHistory.js";


export const gamesHistoryComponent = {
    games: getUserGames(),

    render: ()=>{
        const element = document.querySelector(".gamesHistory")
        gamesHistoryComponent.games.forEach(element => {
            console.log(element)
        });
    }

}