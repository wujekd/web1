import AudioAnalyser from '../utilities/audio-analyser.js';
import PitchVisualizer from '../utilities/pitch-visualizer.js';
import updateMeter from '../utilities/updateMeter.js';
import { startNewRound } from '../utilities/roundLogic.js';
import getCurrentLevel from '../levels/levels.js';
import adminEvListeners from '../utilities/adminEvListeners.js';
import { state } from "../utilities/state.js"
import { saveGame } from '../utilities/gamesHistory.js';
import { showScore } from '../utilities/splashScreens.js';
import { pitchDisplayRefresh } from '../utilities/pitchDisplayRefresh.js';
import setGoToScoreTable from "../utilities/scoreTableBtn.js";
setGoToScoreTable(document.getElementById("scoreTableButton"));

const logged = state.getLogged();
console.log(logged);
if (logged == "false"){ window.location.href = 'login.html'}

const volumeBar = document.getElementById('volume-bar');
const scoreSplash = document.getElementById("scoreSplash");
const scoreSplashDisplay = document.getElementById("scoreSplashDisplay");
const scoreSplashContinueBtn = document.getElementById("scoreSplashContinueBtn");
let roundCount = 0
let scores = []
let bestRound = [Infinity, null];
const listenBtn = document.getElementById('listenBtn');
const readyBtn = document.getElementById("readyBtn");
const splash = document.querySelector(".splash")

const pitchDisplay = document.getElementById('pitch-display');
const audioPlayer1 = document.getElementById('player1')
const backingPlayer = document.getElementById("backingPlayer");
const clickPlayer = document.getElementById("clickPlayer");
const visualizer = new PitchVisualizer('pitch-canvas', audioPlayer1.length);
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioAnalyser = new AudioAnalyser(audioContext);

const level = state.getCurrentLevel();
const levelData = state.getCurrentLevel();
const levelMelody = levelData.levelMelody;

//load audio files based on level data 

visualizer.setTrackLength(audioPlayer1.duration.toFixed(3));
visualizer.setTarget(levelMelody)   

//async audio engine initialisation
audioAnalyser.init()
    .then(() => {
        audioAnalyser.startPitchDetection(pitch => {
            pitchDisplayRefresh(pitch, pitchDisplay)
            visualizer.update(pitch);
        });
    })
    .catch(error => {
        console.error('Error initializing audio analyser:', error);
    });

//update audio meter
updateMeter(audioAnalyser, volumeBar);

//plays demo and triggers main file playback when it ends
function playDemo() {
    backingPlayer.play();
    clickPlayer.play();
    
    clickPlayer.addEventListener('ended', () => {
        audioPlayer1.play();
    });
}

//starts a new round
function initRound(){
    backingPlayer.play();
    clickPlayer.play();
    clickPlayer.addEventListener('ended', () => {
        startNewRound(audioPlayer1, audioAnalyser, visualizer, levelMelody, roundEnded)
    });
}

//displaying the splash after the first round
const roundResultSplash = document.getElementById("roundResultSplash");
const finishRoundBtn = document.getElementById("finishRoundBtn");
function showRoundResult(){
    roundResultSplash.style.display = "flex";
    roundResultSplash.style.opacity = "100%";
    const round1score = document.getElementById("round1score");
    const round2score = document.getElementById("round2score");
    const winningRoundDisplay = document.getElementById("betterRound");
    round1score.textContent = `scores ${scores[0][0]}`;
    round2score.textContent = `scores ${scores[1][0]}`;
    console.log(scores)


    if (scores[0][0] > scores[1][0]) {
        winningRoundDisplay.textContent = '1';
    } else {
        winningRoundDisplay.textContent = '2';
    }


    finishRoundBtn.addEventListener("click", ()=>{
        window.location.replace("dash.html");
    })
    

}


function roundEnded(score, noteScores, scoreArray){

    scores.push([score, noteScores, scoreArray]);
    if (score < bestRound[0]){
        bestRound[0] = score;
        bestRound[1] = roundCount;
    }
    roundCount++;

    // save game and show final result after second round
    if (roundCount > 1){
        saveGame(state.getLogged(), level.id, score, noteScores, scoreArray);
        showRoundResult()

    } else {
        showScore(score, scoreSplash);
    }
}

// setting up the start button
const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", ()=>{ 
    initRound()
})

listenBtn.addEventListener("click", playDemo)

readyBtn.addEventListener("click", ()=>{

    audioAnalyser.demo2output(0);
    audioAnalyser.mic2analyser(1);

    splash.style.opacity = "0%"
    splash.addEventListener("transitionend", ()=>{
        splash.style.display = "none"
    })
})

adminEvListeners(audioAnalyser)