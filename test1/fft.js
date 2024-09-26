document.addEventListener("DOMContentLoaded", function(){
    const playBtn = document.getElementById("play-btn");
    const player1 = document.getElementById("player1");

    const audioContext = new AudioContext();
    const audio1 = audioContext.createMediaElementSource(player1);


    const FFTnode = audioContext.createAnalyser();

    FFTnode.fftSize = 2048;
    const fftSize = 2048;

    const bufferLength = FFTnode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    FFTnode.getByteTimeDomainData(dataArray);
    

    audio1.connect(FFTnode).connect(audioContext.destination);
    
    const canvas = document.querySelector("canvas");
    const canvasCtx = canvas.getContext("2d");

    const infoDiv = document.querySelector("div");


    const sampleRate = audioContext.sampleRate;



    function getFundamentalFrequency(frequencyData, sampleRate, fftSize) {
        // Find the index of the highest amplitude (loudest frequency)
        let maxIndex = 0;
        let maxAmplitude = 0;
    
        for (let i = 0; i < frequencyData.length; i++) {
            if (frequencyData[i] > maxAmplitude) {
                maxAmplitude = frequencyData[i];
                maxIndex = i;
            }
        }
    
        // Calculate the corresponding frequency of the highest amplitude bin
        const nyquistFreq = sampleRate / 2; // Nyquist frequency is half the sample rate
        const binFreq = nyquistFreq / (fftSize / 2); // Frequency per bin
    
        // Fundamental frequency is the index of the loudest bin multiplied by bin frequency
        const fundamentalFreq = maxIndex * binFreq;
        
        return fundamentalFreq;
    }




    function draw() {
        requestAnimationFrame(draw);

        console.log(getFundamentalFrequency(dataArray, sampleRate, fftSize))
        infoDiv.innerHTML = dataArray;
        FFTnode.getByteTimeDomainData(dataArray); // this copies current value to the dataArray
    
        canvasCtx.fillStyle = "rgb(200 200 200)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = "rgb(0 0 0)";
    
        canvasCtx.beginPath();
    
        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;
    
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * canvas.height) / 2;
        
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
        
            x += sliceWidth;
        }
    
        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
    }


    draw();



    playBtn.addEventListener("click", function(){
        console.log("testy")
        if (audioContext.state === "suspended"){
            audioContext.resume();
        }

        if(playBtn.dataset.playing == 'false'){
            player1.play();
            playBtn.dataset.playing = "true";
        } else {
            player1.pause();
            playBtn.dataset.playing = "false";
        }
    })


    player1.addEventListener("ended", function(){
        playBtn.dataset.playing = "false";
    })





})