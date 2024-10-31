import { gamesHistoryComponent } from "./gamesHistoryComponent.js";
import { lvlsComponent } from "./lvlsComponent.js";
import { displayComponent } from "./displayComponent.js";
import { resetViewSetting } from "../utilities/scoreTableBtn.js";

import setGoToScoreTable from "../utilities/scoreTableBtn.js";
setGoToScoreTable(document.getElementById("scoreTableNavBarButton"));


document.addEventListener("DOMContentLoaded", ()=>{

    google.charts.load('current', {'packages':['gauge']});

    console.log(document.querySelector("#scoreTableNavBarButton"))

    lvlsComponent.render();
    gamesHistoryComponent.render();
    displayComponent.init();
    

    const viewSetting = JSON.parse(localStorage.getItem("viewSetting"));
    if (viewSetting.view == "scoreTable"){
        gamesHistoryComponent.showScoreTable();
        resetViewSetting();
        

    }


})