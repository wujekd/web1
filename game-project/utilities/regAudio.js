

export default class regAudio {
    constructor(audioContext, meter1) {
        this.audioContext = audioContext;
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.fftSize;


        
        this.levelDataArray1 = new Float32Array(this.bufferLength)



        this.audioPlayer1 = document.getElementById("player1");


        const source1 = audioContext.createMediaElementSource(this.audioPlayer1)




        source1.connect(this.analyser)
        this.analyser.connect(audioContext.destination);

        this.init = this.init.bind(this);
        this.volumebar1 = meter1
    }

    init(){
        
        const level = this.getAudioLevel();
    const widthPercentage = Math.min(level * 100, 100);
    this.volumebar1.style.width = `${widthPercentage * 2.5}%`;
        
    requestAnimationFrame(this.init)
    }




    getAudioLevel(){
        this.analyser.getFloatTimeDomainData(this.levelDataArray1);
        this.sum = 0;
        for (let i=0; i < this.bufferLength; i++) {
            this.sum += this.levelDataArray1[i] * this.levelDataArray1[i];
        }

        this.rms = Math.sqrt(this.sum / this.bufferLength);
        return this.rms;
    }
}