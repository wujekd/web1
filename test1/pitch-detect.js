document.addEventListener("DOMContentLoaded", function(){

    const playBtn = document.getElementById("play-btn");
    const player1 = document.getElementById("player1");
    const audioContext = new AudioContext();
    const audio1 = audioContext.createMediaElementSource(player1);

    MAX_SIZE = Math.max(4,Math.floor(audioContext.sampleRate/5000))


    console.log(MAX_SIZE)


})