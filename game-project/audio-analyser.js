export default class AudioAnalyser {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.fftSize;
        this.dataArray = new Float32Array(this.bufferLength);
        this.source = null;
        this.scriptProcessorNode = null;
    }

    async init() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.source = this.audioContext.createMediaStreamSource(stream);
            this.scriptProcessorNode = this.audioContext.createScriptProcessor(2048, 1, 1);

            this.source.connect(this.analyser);
            this.analyser.connect(this.scriptProcessorNode);
            this.scriptProcessorNode.connect(this.audioContext.destination);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            throw error;
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

    startPitchDetection(callback) {
        this.scriptProcessorNode.onaudioprocess = () => {
            this.analyser.getFloatTimeDomainData(this.dataArray);
            const pitch = this.autoCorrelate(this.dataArray, this.audioContext.sampleRate);
            callback(pitch);
        };
    }
}
