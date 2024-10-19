let roundActive = false;

export function startNewRound(audioPlayer1, audioAnalyser, visualizer, levelMelody, onEnded) {
    let scoreArray = []; 
    let lastTime = -1; 

    if (roundActive) return;
    roundActive = true;

    function collectAudioData() {
        const currentTime = audioPlayer1.currentTime;
        audioAnalyser.analyser.getFloatTimeDomainData(audioAnalyser.dataArray);
    
        const pitch = audioAnalyser.autoCorrelate(audioAnalyser.dataArray, audioAnalyser.audioContext.sampleRate);
        
        // Always push a value, even if no pitch is detected
        if (currentTime !== lastTime) {
            const roundedPitch = pitch !== -1 ? Number(pitch.toFixed(2)) : 0; // Use 0 as placeholder for no pitch
            scoreArray.push({ time: currentTime, pitch: roundedPitch });
            lastTime = currentTime;
        }
    
        visualizer.update(pitch, currentTime);
    
        if (!audioPlayer1.paused && !audioPlayer1.ended) {
            requestAnimationFrame(collectAudioData);
        }
    }
    // function collectAudioData() {
    //     const currentTime = audioPlayer1.currentTime;
    //     audioAnalyser.analyser.getFloatTimeDomainData(audioAnalyser.dataArray);

    //     const pitch = audioAnalyser.autoCorrelate(audioAnalyser.dataArray, audioAnalyser.audioContext.sampleRate);
    //     if (pitch !== -1 && currentTime !== lastTime) {
    //         const roundedPitch = Number(pitch.toFixed(2)); 
    //         scoreArray.push({ time: currentTime, pitch: roundedPitch });
    //         lastTime = currentTime; 
    //     }

    //     visualizer.update(pitch, currentTime);

    //     if (!audioPlayer1.paused && !audioPlayer1.ended) {
    //         requestAnimationFrame(collectAudioData);
    //     }
    // }

    const playListener = () => {
        requestAnimationFrame(collectAudioData);
    };
    const endListener = () => {
        
        roundActive = false;
        const { overallScore, noteScores } = addScore(scoreArray, levelMelody);
        onEnded(overallScore, noteScores, scoreArray);
        scoreArray = []; 
        lastTime = -1;
    };
    
    audioPlayer1.addEventListener('play', playListener, { once: true });
    audioPlayer1.addEventListener('ended', endListener, { once: true });
    audioPlayer1.play();
}

function addScore(scoreData, levelMelody) {
    let totalScore = 0;
    let notesEvaluated = 0;
    let noteScores = [];  // Array to store individual note scores

    levelMelody.forEach(targetNote => {
        const matchingNotes = scoreData.filter(
            point => point.time >= targetNote.startTime && point.time <= targetNote.endTime
        );

        if (matchingNotes.length > 0) {
            let noteScore = 0;
            // matchingNotes.forEach(point => {
            //     const pitchDifference = Math.abs(point.pitch - targetNote.frequency);
            //     const maxScorePerNote = 100;
            //     const score = Math.max(0, maxScorePerNote - pitchDifference);
            //     noteScore += score;
            // });

            matchingNotes.forEach(point => {
                let score = 0;
                if (point.pitch > 0) {  // Only calculate score for non-silent periods
                    const pitchDifference = Math.abs(point.pitch - targetNote.frequency);
                    const maxScorePerNote = 100;
                    score = Math.max(0, maxScorePerNote - pitchDifference);
                }
                noteScore += score;
            });
            
            const averageNoteScore = noteScore / matchingNotes.length;
            totalScore += averageNoteScore;
            notesEvaluated++;

            // Store the average score for this note
            noteScores.push({ note: targetNote.note, score: averageNoteScore.toFixed(2) });
        } else {
            // If no matching notes, still add the note with a score of 0
            noteScores.push({ note: targetNote.note, score: "0" });
        }
    });

    let overallScore = 0;
    if (notesEvaluated > 0) {
        overallScore = (totalScore / notesEvaluated).toFixed(2);
    }

    return { overallScore, noteScores };  // Return both overall score and note scores
}
