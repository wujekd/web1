import { pubsub } from "../utilities/pubsub.js";
import levels from "../levels/levels.js";
import { state } from "../utilities/state.js";

export const lvlsComponent = {
    lvList: levels('all'),

    render: () => {
        let element = document.querySelector(".leveList");
        lvlsComponent.lvList.forEach((lvl, index) => {
            const lvlBtn = document.createElement("button");
            lvlBtn.addEventListener('click', ()=>{
                state.setLevelState(index + 1)
            })
            lvlBtn.textContent = `Level ${index + 1}`;
            element.appendChild(lvlBtn);
        });
    }
};