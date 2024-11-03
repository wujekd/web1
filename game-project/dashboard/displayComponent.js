import PitchVisualizer from "../utilities/pitch-visualizer.js";
import { pubsub } from "../utilities/pubsub.js";
import { state } from "../utilities/state.js";
import { lvlsComponent } from "./lvlsComponent.js";
import { gamesHistoryComponent } from "./gamesHistoryComponent.js";

export const displayComponent = {
    visualiser: {},
    infoDash: document.querySelector(".infoDash"),
    logged: state.getLogged(),

    // Initialize the display component and setup subscriptions
    init: () => {
        pubsub.subscribe('gameSelected', displayComponent.gameSelected);
        pubsub.subscribe('levelSelected', displayComponent.levelSelected);
        document.querySelector(".showAccountBtn").addEventListener("click", displayComponent.showAccount);
        displayComponent.visualiser = new PitchVisualizer("pitch-canvas", 3, true);
        displayComponent.showAccount();
    },

    // Display user account information
    showAccount: () => {
        const template = document.querySelector('#userInfoTemplate');
        const div = template.content.cloneNode(true).firstElementChild;
        const gameCount = gamesHistoryComponent.games.length;

        div.querySelector('#userName').textContent = ((displayComponent.logged == "false") ? "Login first!" : displayComponent.logged)
        div.querySelector('#gameCount').textContent = gameCount;
        div.querySelector('#userEmail').textContent = displayComponent.email || "---";
        div.querySelector('#userPhone').textContent = displayComponent.phone || "---";

        displayComponent.infoDash.innerHTML = "";
        displayComponent.infoDash.append(div);
    },

    lastMeterValue: 0,

    // Display selected game details with score and level data
    gameSelected: (game) => {
        displayComponent.infoDash.innerHTML = "";
        const template = document.getElementById("gameDetailsTemplate");
        let div = template.content.cloneNode(true).firstElementChild;

        // Setup score display and level information
        const metersDiv = document.createElement('div');
        metersDiv.innerHTML = `
            <div id="chart_div"></div>
            <div id="scoreMeter" style="margin: 5px; width: 30px; height: 150px; background-color: lightgray; position: relative;">
                <div id="scoreBar" style="width: 100%; height: ${displayComponent.lastMeterValue}%; background-color: green; position: absolute; bottom: 0;"></div>
            </div>`;
        metersDiv.classList.add("metersDiv");
        div.appendChild(metersDiv);

        div.querySelector("#levelInfo").innerHTML = `<p>LEVEL: ${game.level}</p>`;
        div.querySelector("#dateInfo").innerHTML = `date: ${game.date}`;
        div.querySelector("#scoreInfo").innerHTML = `overall score: ${game.overallScore}`;
        displayComponent.infoDash.appendChild(div);

        // Initialize visualizer and animate score path
        displayComponent.visualiser.clear();
        displayComponent.visualiser.setTarget(lvlsComponent.lvList[game.level - 1].levelMelody);
        displayComponent.visualiser.drawTarget();
        displayComponent.animatePathDrawing(game.scoreArray, displayComponent.visualiser, 5);

        // Update score bar and Google gauge chart
        document.getElementById("scoreBar").style.height = `${game.overallScore}%`;
        google.charts.load('current', { 'packages': ['gauge'] });
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable([['', 'Value'], ['Score', displayComponent.lastMeterValue]]);
            var options = { width: 160, height: 160, redFrom: 90, redTo: 100, yellowFrom: 75, yellowTo: 90, minorTicks: 10 };
            var chart = new google.visualization.Gauge(document.getElementById('chart_div'));
            chart.draw(data, options);
            data.setValue(0, 1, game.overallScore);
            chart.draw(data, options);
            displayComponent.lastMeterValue = parseInt(game.overallScore);
        }
    },

    // Display selected level information with play option
    levelSelected: (level) => {
        displayComponent.infoDash.innerHTML = "";
        const template = document.getElementById("levelInfoTemplate");
        const div = template.content.cloneNode(true).firstElementChild;

        div.querySelector("#name").innerHTML = level.name;
        div.querySelector("#tempo").innerHTML = level.tempo.toString();
        div.querySelector("#description").innerHTML = level.info;
        const playLevelBtn = div.querySelector("#play");
        playLevelBtn.innerHTML = `Play level ${level.name}`;
        playLevelBtn.addEventListener("click", () => {
            state.setLevelState(level.id);
            setTimeout(() => { window.location.replace("game.html"); }, 10);
        });

        displayComponent.infoDash.appendChild(div);
        displayComponent.visualiser.clear();
        displayComponent.visualiser.setTarget(lvlsComponent.lvList[level.id - 1].levelMelody);
        displayComponent.visualiser.drawTarget();
    },

    // Animate the path drawing of score data on the visualizer
    animatePathDrawing: (roundData, visualiser, interval = 1) => {
        let index = 0;

        function drawNextPoint() {
            if (index < roundData.length) {
                const element = roundData[index];
                visualiser.addPathPoint(element.time, element.pitch);
                visualiser.drawPath();
                index++;
                setTimeout(drawNextPoint, interval);
            }
        }
        drawNextPoint();
    }
};
