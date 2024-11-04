export default class AudioAnalyser {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.fftSize;
        this.dataArray = new Float32Array(this.bufferLength);
        this.source = null;
        this.scriptProcessorNode = null;
        this.lowPassFilter = null;  // Low-pass filter
        this.audioPlayer1 = document.getElementById("player1");
        this.audioLevelData = new Float32Array(this.bufferLength)

        this.demoPlayerGain = this.audioContext.createGain();

        this.LPFreq = 190;

    }

    async init() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            this.source = this.audioContext.createMediaStreamSource(stream);
            this.demo2output(1);

            // the filter preventing analyser octave jumps
            this.lowPassFilter = this.audioContext.createBiquadFilter();
            this.lowPassFilter.type = "lowpass";
            this.lowPassFilter.frequency.setValueAtTime(190, this.audioContext.currentTime); // init cutoff frequency

            //creating gain nodes to adjust volume
            this.micGain = this.audioContext.createGain();
            this.playerGain = this.audioContext.createGain();
            this.micGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.playerGain.gain.setValueAtTime(0, this.audioContext.currentTime);

            this.mixer1 = this.audioContext.createGain();
            this.mixer1.gain.setValueAtTime(1, this.audioContext.currentTime);

            this.player1source = this.audioContext.createMediaElementSource(this.audioPlayer1);
            this.player1source.connect(this.playerGain)
            this.playerGain.connect(this.mixer1)
            this.micGain.connect(this.mixer1)

            this.player1source.connect(this.demoPlayerGain);
            
            this.demoPlayerGain.connect(this.audioContext.destination);

            // Create the script processor node for real-time audio processing
            this.scriptProcessorNode = this.audioContext.createScriptProcessor(2048, 1, 1);

            // Connecting the audio graph
            // this.source.connect(this.lowPassFilter);       
            this.source.connect(this.micGain)
            this.mixer1.connect(this.lowPassFilter);
            this.lowPassFilter.connect(this.analyser);      
            this.analyser.connect(this.scriptProcessorNode); 
            // this.mixer1.connect(this.audioContext.destination); 

        } catch (error) {
            console.error('Error accessing microphone:', error);
            throw error;
        }
    }

    setLpfFreq() {

            if (this.lowPassFilter) {
                this.lowPassFilter.frequency.setValueAtTime(this.LPFreq, this.audioContext.currentTime);
            }
    }

    autoCorrelate(buffer, sampleRate) {
        let SIZE = buffer.length;
        let MAX_SAMPLES = Math.floor(SIZE / 2);
        let bestOffset = -1;
        let bestCorrelation = 0;
        let rms = 0;
        let foundGoodCorrelation = false;
        let correlations = new Array(MAX_SAMPLES);

        for (let i = 0; i < SIZE; i++) {
            let val = buffer[i];
            rms += val * val;
        }
        rms = Math.sqrt(rms / SIZE);

        if (rms < 0.01) return -1;

        let lastCorrelation = 1;

        for (let offset = 0; offset < MAX_SAMPLES; offset++) {
            let correlation = 0;

            for (let i = 0; i < MAX_SAMPLES; i++) {
                correlation += Math.abs(buffer[i] - buffer[i + offset]);
            }

            correlation = 1 - (correlation / MAX_SAMPLES);
            correlations[offset] = correlation;

            if (correlation > 0.9 && correlation > lastCorrelation) {
                foundGoodCorrelation = true;
                if (correlation > bestCorrelation) {
                    bestCorrelation = correlation;
                    bestOffset = offset;
                }
            } else if (foundGoodCorrelation && correlation < 0.9) {
                break;
            }

            lastCorrelation = correlation;
        }

        if (bestCorrelation > 0.01) {
            let fundamentalFreq = sampleRate / bestOffset;
            return fundamentalFreq;
        }

        return -1;
    }

    // Start 
    startPitchDetection(callback) {
        this.scriptProcessorNode.onaudioprocess = () => {
            this.analyser.getFloatTimeDomainData(this.dataArray);
            const pitch = this.autoCorrelate(this.dataArray, this.audioContext.sampleRate);
            callback(pitch);
        };
    }

    getAudioLevel(){
        this.analyser.getFloatTimeDomainData(this.audioLevelData);
        this.sum = 0;
        for (let i=0; i < this.bufferLength; i++) {
            this.sum += this.audioLevelData[i] * this.audioLevelData[i];
        }

        this.rms = Math.sqrt(this.sum / this.bufferLength);
        return this.rms;
    }



    demo2output(x) {
        if (x === 1) {
            // Set demo player gain to on
            this.demoPlayerGain.gain.setValueAtTime(1, this.audioContext.currentTime);
        } else {
            // Set demo player gain to off
            this.demoPlayerGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        }
    }

    mic2analyser(x){
        if (x == 1){
            //mic gain on
            this.micGain.gain.setValueAtTime(2, this.audioContext.currentTime);
        } else {
            this.micGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        }
    }

    player2analyser(x){
        if (x == 1){
            this.playerGain.gain.setValueAtTime(1, this.audioContext.currentTime);
        } else {
            
            this.playerGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        }
    }
}