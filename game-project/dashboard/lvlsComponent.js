import { pubsub } from "../utilities/pubsub.js";
import levels from "../levels/levels.js";

export const lvlsComponent = {
    lvList: levels('all'),

    render: () => {
        let element = document.querySelector(".leveList");
        lvlsComponent.lvList.forEach((lvl, index) => {
            const lvlBtn = document.createElement("button");
            lvlBtn.textContent = `Level ${index + 1}`;
            element.appendChild(lvlBtn);
        });
    }
};
