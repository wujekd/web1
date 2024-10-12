import AudioAnalyser from './utilities/audio-analyser.js';
import PitchVisualizer from './utilities/pitch-visualizer.js';
import getLevelData from './utilities/getLevelData.js';
import updateMeter from './utilities/updateMeter.js';
import { startNewRound, addScore } from './utilities/roundLogic.js';
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

const levelMelody = [
    { note: "G#", frequency: 207.65, startTime: 0.341333, endTime: 0.8 },
    { note: "E", frequency: 164.81, startTime: 1.002666, endTime: 1.301333 },
    { note: "C#", frequency: 138.59, startTime: 1.642666, endTime: 2.421333 }
];
    const trackLength = audioPlayer1.duration.toFixed(3);
    console.log(trackLength)  // Duration of the audio file in seconds
    visualizer.setTrackLength(trackLength);
    visualizer.setTarget(levelMelody)   

// getLevelData();



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



function init(){
    // display listen
}



// setupEventListeners(audioAnalyser, visualizer, startNewRound, levelMelody, addScore, audioPlayer1);



const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", ()=> startNewRound(audioPlayer1, audioAnalyser, visualizer, levelMelody, addScore))

document.getElementById('muteMic').addEventListener('click', () => {
    console.log("test mute mic")
    audioAnalyser.mic2analyser(0);  
});
document.getElementById('unmuteMic').addEventListener('click', () => {
    console.log("unmute mic triggered")
    audioAnalyser.mic2analyser(1); 
});

// Mute/Unmute Audio Player
document.getElementById('muteAudio').addEventListener('click', () => {
    audioAnalyser.player2analyser(0); 
});
document.getElementById('unmuteAudio').addEventListener('click', () => {
    audioAnalyser.player2analyser(1);
});

const testBtn = document.getElementById("testyBtn");
testBtn.addEventListener("click", ()=>{
    visualizer.log();
})

const logFreqBtn = document.getElementById("log-freq");
logFreqBtn.addEventListener("click", ()=> {
    console.log(audioAnalyser.lowPassFilter.frequency)
})