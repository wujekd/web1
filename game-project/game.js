import AudioAnalyser from './utilities/audio-analyser.js';
import PitchVisualizer from './utilities/pitch-visualizer.js';
import updateMeter from './utilities/updateMeter.js';
import { startNewRound, addScore } from './utilities/roundLogic.js';
import getLevelData from './levels/levels.js';
import adminEvListeners from './utilities/adminEvListeners.js';
const dataDisplay = document.querySelector(".data");
const pitchDisplay = document.getElementById('pitch-display');
const scoreDisplay = document.getElementById('score-display');
const targetPitchDisplay = document.getElementById('target-pitch-display');
const audioPlayer1 = document.getElementById('player1')
const visualizer = new PitchVisualizer('pitch-canvas', audioPlayer1.length);
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioAnalyser = new AudioAnalyser(audioContext);

let logged = false;
let score = 0;


const levelData = getLevelData(0)
const levelMelody = levelData.levelMelody

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

            // const currentScore = visualizer.getScore(pitch);
            // scoreDisplay.textContent = `Score: ${Math.round(currentScore)}`;

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



listenBtn.addEventListener("click", ()=> audioPlayer1.play())

readyBtn.addEventListener("click", ()=>{
    splash.style.opacity = "0%"
    splash.addEventListener("transitionend", ()=>{
        splash.style.display = "none"
    })
})



const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", ()=> startNewRound(audioPlayer1, audioAnalyser, visualizer, levelMelody, addScore))





adminEvListeners(audioAnalyser, visualizer)
