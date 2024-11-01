import { gamesHistoryComponent } from "./gamesHistoryComponent.js";
import { lvlsComponent } from "./lvlsComponent.js";
import { displayComponent } from "./displayComponent.js";
import { resetViewSetting } from "../utilities/scoreTableBtn.js";

import setGoToScoreTable from "../utilities/scoreTableBtn.js";

// Set up the "Score Table" button functionality
setGoToScoreTable(document.getElementById("scoreTableNavBarButton"));

// Initialize components when the document is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // Load Google Charts library for displaying gauges
    google.charts.load('current', { 'packages': ['gauge'] });

    lvlsComponent.render(); // Render levels component
    gamesHistoryComponent.render(); // Render games history component
    displayComponent.init(); // Initialize display component

    // Check saved view setting and adjust view if set to "scoreTable"
    const viewSetting = JSON.parse(localStorage.getItem("viewSetting"));
    if (viewSetting.view == "scoreTable") {
        gamesHistoryComponent.showScoreTable(); // Show score table
        gamesHistoryComponent.sortGamesBy("score"); // Sort games by score
        resetViewSetting(); // Reset view setting in storage
    }
});
