import AudioAnalyser from './audio-analyser.js';
import PitchVisualizer from './pitch-visualizer.js';
import getLevel from './levels.js';

export default class Game {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioAnalyser = new AudioAnalyser(this.audioContext);
        this.visualizer = new PitchVisualizer('pitch-canvas');
        this.audioPlayer1 = document.getElementById('player1');
        this.score = 0;
        this.levelMelody = [
            { note: "G#", frequency: 207.65, startTime: 0.341333, endTime: 0.8 },
            { note: "E", frequency: 164.81, startTime: 1.002666, endTime: 1.301333 },
            { note: "C#", frequency: 138.59, startTime: 1.642666, endTime: 2.421333 }
        ];
        this.initEventListeners();
    }

    initGame() {
        this.audioAnalyser.init()
            .then(() => {
                this.audioAnalyser.startPitchDetection(pitch => {
                    this.updatePitch(pitch);
                });
            })
            .catch(error => {
                console.error('Error initializing audio analyser:', error);
            });

        this.updateMeter(); // Start audio level meter
    }

    startNewRound() {
        const scoreArray = [];
        let lastTime = -1;

        const collectAudioData = () => {
            const currentTime = this.audioPlayer1.currentTime;
            this.audioAnalyser.analyser.getFloatTimeDomainData(this.audioAnalyser.dataArray);
            const pitch = this.audioAnalyser.autoCorrelate(this.audioAnalyser.dataArray, this.audioAnalyser.audioContext.sampleRate);

            if (pitch !== -1 && currentTime !== lastTime) {
                const roundedPitch = Number(pitch.toFixed(2));
                scoreArray.push({ time: currentTime, pitch: roundedPitch });
                lastTime = currentTime;
            }

            if (!this.audioPlayer1.paused && !this.audioPlayer1.ended) {
                requestAnimationFrame(collectAudioData);
            }
        };

        this.audioPlayer1.addEventListener('play', () => {
            requestAnimationFrame(collectAudioData);
        });

        this.audioPlayer1.addEventListener('ended', () => {
            console.log(this.addScore(scoreArray, this.levelMelody));
        });

        this.audioPlayer1.play();
    }

    addScore(scoreData, levelMelody) {
        let totalScore = 0;
        let notesEvaluated = 0;

        levelMelody.forEach(targetNote => {
            const matchingNotes = scoreData.filter(
                point => point.time >= targetNote.startTime && point.time <= targetNote.endTime
            );

            if (matchingNotes.length > 0) {
                let noteScore = 0;
                matchingNotes.forEach(point => {
                    const pitchDifference = Math.abs(point.pitch - targetNote.frequency);
                    const score = Math.max(0, 100 - pitchDifference); // Max score is 100, reduces with pitch difference
                    noteScore += score;
                });

                totalScore += noteScore / matchingNotes.length;
                notesEvaluated++;
            }
        });

        return { score: (totalScore / notesEvaluated).toFixed(2), totalNotes: notesEvaluated };
    }

    updatePitch(pitch) {
        const pitchDisplay = document.getElementById('pitch-display');
        const scoreDisplay = document.getElementById('score-display');

        if (pitch !== -1 && pitch !== Infinity) {
            pitchDisplay.textContent = `Pitch: ${Math.round(pitch)} Hz`;
        } else {
            pitchDisplay.textContent = 'Pitch: -- Hz';
        }

        this.visualizer.update(pitch);
        const currentScore = this.visualizer.getScore(pitch);
        scoreDisplay.textContent = `Score: ${Math.round(currentScore)}`;
    }

    updateMeter() {
        const volumeBar = document.getElementById('volume-bar');
        const level = this.audioAnalyser.getAudioLevel();
        const widthPercentage = Math.min(level * 100, 100);
        volumeBar.style.width = `${widthPercentage * 2.5}%`;

        requestAnimationFrame(this.updateMeter.bind(this)); // Continuously update the meter
    }

    initEventListeners() {
        document.getElementById("start-btn").addEventListener("click", () => this.startNewRound());

        document.getElementById('muteMic').addEventListener('click', () => {
            this.audioAnalyser.mic2analyser(0);
        });

        document.getElementById('unmuteMic').addEventListener('click', () => {
            this.audioAnalyser.mic2analyser(1);
        });

        document.getElementById('muteAudio').addEventListener('click', () => {
            this.audioAnalyser.player2analyser(0);
        });

        document.getElementById('unmuteAudio').addEventListener('click', () => {
            this.audioAnalyser.player2analyser(1);
        });
    }
}
