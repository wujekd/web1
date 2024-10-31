import { gamesHistoryComponent } from "./gamesHistoryComponent.js";
import { lvlsComponent } from "./lvlsComponent.js";
import { displayComponent } from "./displayComponent.js";


document.addEventListener("DOMContentLoaded", ()=>{

    google.charts.load('current', {'packages':['gauge']});

    lvlsComponent.render();
    gamesHistoryComponent.render();
    displayComponent.init();
    

    const viewSetting = JSON.parse(localStorage.getItem("viewSetting"));
    if (viewSetting.view == "scoreTable"){

        gamesHistoryComponent.showScoreTable();

    }


})