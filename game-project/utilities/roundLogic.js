// let playListener = null;
// let endListener = null;
let roundActive = false; 

export function startNewRound(audioPlayer1, audioAnalyser, visualizer, levelMelody, addScore) {
    let scoreArray = []; 
    let lastTime = -1; 

    if (roundActive) return; // Prevent a new round from starting if one is in progress
    roundActive = true; // Mark the round as active

    function collectAudioData() {
        const currentTime = audioPlayer1.currentTime;
        audioAnalyser.analyser.getFloatTimeDomainData(audioAnalyser.dataArray);

        const pitch = audioAnalyser.autoCorrelate(audioAnalyser.dataArray, audioAnalyser.audioContext.sampleRate);

        if (pitch !== -1 && currentTime !== lastTime) {
            const roundedPitch = Number(pitch.toFixed(2)); 
            scoreArray.push({ time: currentTime, pitch: roundedPitch });
            lastTime = currentTime; 
        }

        visualizer.update(pitch, currentTime);

        if (!audioPlayer1.paused && !audioPlayer1.ended) {
            requestAnimationFrame(collectAudioData);
        }
    }

    const playListener = () => {
        requestAnimationFrame(collectAudioData);
    };

    const endListener = () => {
        console.log(addScore(scoreArray, levelMelody));
        console.log(scoreArray);
        scoreArray = []; 
        lastTime = -1;
        roundActive = false; 
    };
    
    audioPlayer1.addEventListener('play', playListener, { once: true });
    audioPlayer1.addEventListener('ended', endListener, { once: true });


    audioPlayer1.play();
}

export function addScore(scoreData, levelMelody) {
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
                const maxScorePerNote = 100;
                const score = Math.max(0, maxScorePerNote - pitchDifference);
                noteScore += score;
            });

            const averageNoteScore = noteScore / matchingNotes.length;
            totalScore += averageNoteScore;
            notesEvaluated++;
        }
    });

    if (notesEvaluated > 0) {
        const finalScore = totalScore / notesEvaluated;
        return { score: finalScore.toFixed(2), totalNotes: notesEvaluated };
    } else {
        return { score: 0, totalNotes: 0 };
    }
}