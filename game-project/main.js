import AudioAnalyser from './audio-analyser.js';
import PitchVisualizer from './pitch-visualizer.js';
const dataDisplay = document.querySelector(".data")
const pitchDisplay = document.getElementById('pitch-display');
const scoreDisplay = document.getElementById('score-display');
const targetPitchDisplay = document.getElementById('target-pitch-display');

const visualizer = new PitchVisualizer('pitch-canvas');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioAnalyser = new AudioAnalyser(audioContext);
const audioPlayer1 = document.getElementById('player1')

let userName = 'admin';
let score = 0;

const levelMelody = [
    { note: "G#", frequency: 207.65, startTime: 0.341333, endTime: 0.8 },
    { note: "E", frequency: 164.81, startTime: 1.002666, endTime: 1.301333 },
    { note: "C#", frequency: 138.59, startTime: 1.642666, endTime: 2.421333 }
];

function startNewRound() {
    // const targetPitch = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
    // visualizer.setTargetPitch(targetPitch);
    // audioAnalyser.setLpfFreq(targetPitch * 1.6); 
    // targetPitchDisplay.textContent = `Target Pitch: ${targetPitch} Hz`;
    // scoreDisplay.textContent = `Score: ${score}`;

    const scoreArray = []; 
    let lastTime = -1; 

 
    function collectAudioData() {
        const currentTime = audioPlayer1.currentTime;
        audioAnalyser.analyser.getFloatTimeDomainData(audioAnalyser.dataArray);

      
        const pitch = audioAnalyser.autoCorrelate(audioAnalyser.dataArray, audioAnalyser.audioContext.sampleRate);

        if (pitch !== -1 && currentTime !== lastTime) {
            const roundedPitch = Number(pitch.toFixed(2)); 
            scoreArray.push({ time: currentTime, pitch: roundedPitch });
            lastTime = currentTime; 
        }

        if (!audioPlayer1.paused && !audioPlayer1.ended) {
            requestAnimationFrame(collectAudioData);
        }
    }

    audioPlayer1.addEventListener('play', () => {
        // scoreArray = [];
        requestAnimationFrame(collectAudioData);
    });
    
    audioPlayer1.addEventListener('ended', () => {
        console.log(addScore(scoreArray, levelMelody));
    });

   
    audioPlayer1.play();
}

function addScore(scoreData, levelM) {
    let totalScore = 0;
    let notesEvaluated = 0;
    console.log(scoreData, levelM)

    levelMelody.forEach(targetNote => {
        // Filter the score data to find sung pitches that fall within the time range of this note
        const matchingNotes = scoreData.filter(
            point => point.time >= targetNote.startTime && point.time <= targetNote.endTime
        );

        if (matchingNotes.length > 0) {
            let noteScore = 0;
            matchingNotes.forEach(point => {
                // Calculate the pitch difference between sung pitch and target pitch
                const pitchDifference = Math.abs(point.pitch - targetNote.frequency);
                
                // perfect match (0 difference) is 100 points, and reduce score as difference increases
                const maxScorePerNote = 100;
                const score = Math.max(0, maxScorePerNote - pitchDifference);

                noteScore += score;
            });

         
            const averageNoteScore = noteScore / matchingNotes.length;
            totalScore += averageNoteScore;
            notesEvaluated++;
        }
    });

    // If notes were evaluated, return the final score (average score per note)
    if (notesEvaluated > 0) {
        const finalScore = totalScore / notesEvaluated;
        return { score: finalScore.toFixed(2), totalNotes: notesEvaluated };
    } else {
        return { score: 0, totalNotes: 0 };
    }
}



audioAnalyser.init()
    .then(() => {
        audioAnalyser.startPitchDetection(pitch => {
            if (pitch !== -1 && pitch !== Infinity) {
                pitchDisplay.textContent = `Pitch: ${Math.round(pitch)} Hz`;
            } else {
                pitchDisplay.textContent = 'Pitch: -- Hz';
            }

            visualizer.update(pitch);

            const currentScore = visualizer.getScore(pitch);
            scoreDisplay.textContent = `Score: ${Math.round(currentScore)}`;

        });
    })
    .catch(error => {
        console.error('Error initializing audio analyser:', error);
    });





    const volumeBar = document.getElementById('volume-bar');

function updateMeter() {
    const level = audioAnalyser.getAudioLevel();
    const widthPercentage = Math.min(level * 100, 100);
    volumeBar.style.width = `${widthPercentage * 2.5}%`;
    
    requestAnimationFrame(updateMeter);
}

updateMeter();






const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", ()=> startNewRound())

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



import getLevel from './levels.js';  
const level1 = getLevel(0); 
console.log(level1)



const logFreqBtn = document.getElementById("log-freq");
logFreqBtn.addEventListener("click", ()=> {
    console.log(audioAnalyser.lowPassFilter.frequency)
})