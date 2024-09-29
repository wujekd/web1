import AudioAnalyser from './audio-analyser.js';
import PitchVisualizer from './pitch-visualizer.js';

const pitchDisplay = document.getElementById('pitch-display');
const scoreDisplay = document.getElementById('score-display');
const targetPitchDisplay = document.getElementById('target-pitch-display');

// Initialize the visualizer for the canvas with ID 'pitch-canvas'
const visualizer = new PitchVisualizer('pitch-canvas');

// Create a new AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Initialize the AudioAnalyser
const audioAnalyser = new AudioAnalyser(audioContext);

// Game variables
let targetPitch = 440; // Example initial target pitch (A4)
let score = 0;
let round = 1;

// Function to start a new round with a new target pitch
function startNewRound() {
    // Generate a random target pitch between 200Hz and 800Hz
    targetPitch = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
    visualizer.setTargetPitch(targetPitch);
    targetPitchDisplay.textContent = `Target Pitch: ${targetPitch} Hz`;
    scoreDisplay.textContent = `Score: ${score}`;
}

// Initialize the audio analyser and start pitch detection
audioAnalyser.init()
    .then(() => {
        audioAnalyser.startPitchDetection(pitch => {
            // Display the detected pitch
            if (pitch !== -1 && pitch !== Infinity) {
                pitchDisplay.textContent = `Pitch: ${Math.round(pitch)} Hz`;
            } else {
                pitchDisplay.textContent = 'Pitch: -- Hz';
            }

            // Update the visualizer with the current pitch
            visualizer.update(pitch);

            // Calculate the score based on how close the pitch is to the target
            const currentScore = visualizer.getScore(pitch);
            scoreDisplay.textContent = `Score: ${Math.round(currentScore)}`;

            // Optionally, you could set conditions to advance rounds (e.g., reaching a certain score)
        });
    })
    .catch(error => {
        console.error('Error initializing audio analyser:', error);
    });

// Start the first round
startNewRound();
