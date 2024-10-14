import getLevel from "../levels/levels.js";

export const state = {
    init: () => {
        if (!localStorage.getItem('gameState')) {
            const initialState = {
                logged: false,
            };
            localStorage.setItem('gameState', JSON.stringify(initialState));
        }
    },

    setLogged: (user) => {
        let currentState = JSON.parse(localStorage.getItem('gameState'));
        currentState.logged = user;
        localStorage.setItem('gameState', JSON.stringify(currentState));
    },

    getLogged: () => {
        let currentState = JSON.parse(localStorage.getItem('gameState'));
        if (!currentState) {
            state.init();
            currentState = JSON.parse(localStorage.getItem('gameState'));
        }
        return currentState.logged;
    },
    getCurrentLevel: ()=> {
        const gameState = JSON.parse(localStorage.getItem('gameState'))
        const level = gameState.level;
        console.log(level)
        return getLevel(level);
    },

    setLevelState: (lvl)=> {
        const levelData = JSON.parse(localStorage.getItem('gameState'));
        const newLvl = parseInt(lvl);
        levelData.level = newLvl.toString();
        localStorage.setItem("gameState", JSON.stringify(levelData));

        setTimeout(()=>{
            window.location.href ="../game.html"
        }, 100)

        
    }
};
