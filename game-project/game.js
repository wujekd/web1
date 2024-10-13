import AudioAnalyser from './utilities/audio-analyser.js';
import PitchVisualizer from './utilities/pitch-visualizer.js';
import updateMeter from './utilities/updateMeter.js';
import { startNewRound } from './utilities/roundLogic.js';
import getLevelData from './levels/levels.js';
import adminEvListeners from './utilities/adminEvListeners.js';
import { state } from "./utilities/state.js"
import { saveGame } from './utilities/gamesHistory.js';

const dataDisplay = document.querySelector(".data");
const pitchDisplay = document.getElementById('pitch-display');
const scoreDisplay = document.getElementById('score-display');
const targetPitchDisplay = document.getElementById('target-pitch-display');
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
            if (pitch !== -1 && pitch !== Infinity) {
                pitchDisplay.textContent = `Pitch: ${Math.round(pitch)} Hz`;
            } else {
                pitchDisplay.textContent = 'Pitch: -- Hz';
            }

            visualizer.update(pitch);
        });
    })
    .catch(error => {
        console.error('Error initializing audio analyser:', error);
    });

    
const volumeBar = document.getElementById('volume-bar');
updateMeter(audioAnalyser, volumeBar);


const listenBtn = document.getElementById('listenBtn');
const readyBtn = document.getElementById("readyBtn");
const splash = document.querySelector(".splash")

listenBtn.addEventListener("click", playDemo)
readyBtn.addEventListener("click", ()=>{
    splash.style.opacity = "0%"
    splash.addEventListener("transitionend", ()=>{
        splash.style.display = "none"
    })
})




function playDemo() {
    backingPlayer.play();
    clickPlayer.play();
    
    clickPlayer.addEventListener('ended', () => {
        audioPlayer1.play();
    });
}

let roundCount = 0


function initRound(){
    backingPlayer.play();
    clickPlayer.play();
   
    
    clickPlayer.addEventListener('ended', () => {
        startNewRound(audioPlayer1, audioAnalyser, visualizer, levelMelody, roundEnded)
    });
}

const scoreSplash = document.getElementById("scoreSplash");
const scoreSplashContinueBtn = document.getElementById("scoreSplashContinueBtn");

function roundEnded(score, noteScores, scoreArray){
    showScore(score);

    console.log(noteScores)
    saveGame(state.getLogged, level, score, noteScores, scoreArray);

    if (roundCount > 2){
        //save the game 
        //show game score => continue
        //redirect to your games 
    }
}

function showScore(score){
    console.log(score)
}



const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", ()=>{ 
    initRound()
})



    const testBtn = document.getElementById("testyBtn");
    testBtn.addEventListener("click", ()=>{
        playDemo();
    })

adminEvListeners(audioAnalyser)