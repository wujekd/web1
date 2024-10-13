import AudioAnalyser from './utilities/audio-analyser.js';
import PitchVisualizer from './utilities/pitch-visualizer.js';
import updateMeter from './utilities/updateMeter.js';
import { startNewRound } from './utilities/roundLogic.js';
import getLevelData from './levels/levels.js';
import adminEvListeners from './utilities/adminEvListeners.js';
import { state } from "./utilities/state.js"
import { saveGame } from './utilities/gamesHistory.js';
import { showScore } from './utilities/splashScreens.js';
import { pitchDisplayRefresh } from './utilities/pitchDisplayRefresh.js';

const volumeBar = document.getElementById('volume-bar');
const scoreSplash = document.getElementById("scoreSplash");
const scoreSplashDisplay = document.getElementById("scoreSplashDisplay");
const scoreSplashContinueBtn = document.getElementById("scoreSplashContinueBtn");
let roundCount = 0
let scores = []
let bestRound = [0, null];
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

if (!state.getLogged()){ window.location.href = 'index.html'}

const level = state.getLevelState()
const levelData = getLevelData(level)
const levelMelody = levelData.levelMelody


//load audio files based on level data 

visualizer.setTrackLength(audioPlayer1.duration.toFixed(3));
visualizer.setTarget(levelMelody)   


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


updateMeter(audioAnalyser, volumeBar);

function playDemo() {
    backingPlayer.play();
    clickPlayer.play();
    
    clickPlayer.addEventListener('ended', () => {
        audioPlayer1.play();
    });
}


function initRound(){
    backingPlayer.play();
    clickPlayer.play();
    clickPlayer.addEventListener('ended', () => {
        startNewRound(audioPlayer1, audioAnalyser, visualizer, levelMelody, roundEnded)
    });
}

const roundResultSplash = document.getElementById("roundResultSplash");
const finishRoundBtn = document.getElementById("finishRoundBtn");
function showRoundResult(){
    roundResultSplash.style.display = "flex";
    roundResultSplash.style.opacity = "100%";

    finishRoundBtn.addEventListener("click", ()=>{
        window.location.replace("dashboard.html");
    })
    
    // final animations
    // add beat
}


function roundEnded(score, noteScores, scoreArray){
    scores.push([score, noteScores, scoreArray]);
    if (score > bestRound[0]){
        bestRound[0] = score;
        bestRound[1] = roundCount;
    }
    roundCount++;

    if (roundCount > 2){
        saveGame(state.getLogged, level, score, noteScores, scoreArray);
        showRoundResult()

    } else {
        showScore(score, scoreSplash);
    }
}


const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", ()=>{ 
    initRound()
})

listenBtn.addEventListener("click", playDemo)

readyBtn.addEventListener("click", ()=>{
    splash.style.opacity = "0%"
    splash.addEventListener("transitionend", ()=>{
        splash.style.display = "none"
    })
})


adminEvListeners(audioAnalyser)