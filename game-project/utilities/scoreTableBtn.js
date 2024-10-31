export default function(scoreTableBtn){

scoreTableBtn.addEventListener("click", ()=>{
    goToScoreTable();
})
}
export function resetViewSetting(){
    const setting = {view : ""}
    localStorage.setItem("viewSetting", JSON.stringify(setting))
}

const goToScoreTable =  function(){
    //set score table to be selected
    
    const viewSetting = localStorage.getItem("viewSetting") 
        ? JSON.parse(localStorage.getItem("viewSetting"))
        : {};

    viewSetting.view = "scoreTable";
    localStorage.setItem("viewSetting", JSON.stringify(viewSetting));

    //reroute to the dashboard
    document.location.href = "./dash.html";

    //trigger the view in dashboard

}