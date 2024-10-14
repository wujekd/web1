import { pubsub } from "../utilities/pubsub.js";
import levels from "../levels/levels.js";
import { state } from "../utilities/state.js";

export const lvlsComponent = {
    lvList: levels('all'),

    render: () => {
        let element = document.querySelector(".leveList");
        lvlsComponent.lvList.forEach((lvl, index) => {
            const lvlBtn = document.createElement("button");
            lvlBtn.addEventListener('click', ()=> lvlsComponent.select(index))
            lvlBtn.textContent = `Level ${index + 1}`
            element.appendChild(lvlBtn);
        });
    },
    select: (index)=> {

        pubsub.publish("levelSelected", lvlsComponent.lvList[index]);

    }
};