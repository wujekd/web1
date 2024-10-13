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
    getLevelState: ()=> {
        const levelData = JSON.parse(localStorage.getItem('gameState'))
        return levelData.level;
    }
};
