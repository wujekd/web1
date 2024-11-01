
// construct score splash screen
export function showScore(score, scoreSplash){
    scoreSplash.style.display = "flex";
    scoreSplashDisplay.textContent = score.toString();
    scoreSplash.style.opacity = "100%"
    scoreSplashContinueBtn.addEventListener("click", ()=>{
        scoreSplash.style.opacity = "0%";
        scoreSplash.addEventListener("transitionend", ()=>{
            scoreSplash.style.display = "none";
        }, {once:true})
    },{once:true})
}