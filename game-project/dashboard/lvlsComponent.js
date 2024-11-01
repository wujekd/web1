import { pubsub } from "../utilities/pubsub.js";
import levels from "../levels/levels.js";

export const lvlsComponent = {
    // Retrieve all levels
    lvList: levels('all'),

    // Render level buttons in the level list
    render: () => {
        let element = document.querySelector(".leveList");
        lvlsComponent.lvList.forEach((lvl, index) => {
            const lvlBtn = document.createElement("button");
            lvlBtn.addEventListener('click', () => lvlsComponent.select(index));
            lvlBtn.textContent = `Level ${index + 1}`;
            element.appendChild(lvlBtn);
        });
    },

    // Publish the selected level event
    select: (index) => {
        pubsub.publish("levelSelected", lvlsComponent.lvList[index]);
    }
};
