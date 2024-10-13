export default function(audioAnalyser, visualizer){

    document.getElementById('muteMic').addEventListener('click', () => {
        console.log("test mute mic")
        audioAnalyser.mic2analyser(0);  
    });
    document.getElementById('unmuteMic').addEventListener('click', () => {
        console.log("unmute mic triggered")
        audioAnalyser.mic2analyser(1); 
    });

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
}