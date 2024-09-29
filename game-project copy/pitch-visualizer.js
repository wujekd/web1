export default class PitchVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvasHeight = this.canvas.height;
        this.canvasWidth = this.canvas.width;

        // Arrow settings (fixed horizontally at center)
        this.arrowX = this.canvasWidth / 2;
        this.arrowY = this.canvasHeight / 2; // Initial arrow position in the middle

        // Target pitch
        this.targetY = this.arrowY; // Initialize target pitch in the middle
    }

    // Normalize the pitch to fit within the canvas height
    normalizePitch(pitch) {
        const minFreq = 60;  // Lower bound for the frequency
        const maxFreq = 1000; // Upper bound for the frequency
        // Clamp pitch between minFreq and maxFreq
        const clampedPitch = Math.min(Math.max(pitch, minFreq), maxFreq);
        // Normalize the pitch to fit within canvas height
        return this.canvasHeight - ((clampedPitch - minFreq) / (maxFreq - minFreq)) * this.canvasHeight;
    }

    // Set the target pitch
    setTargetPitch(targetPitch) {
        this.targetY = this.normalizePitch(targetPitch);
    }

    // Function to draw the arrow at the current position
    drawArrow(y) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.arrowX - 10, y);
        this.ctx.lineTo(this.arrowX + 10, y);
        this.ctx.lineTo(this.arrowX, y - 20);
        this.ctx.closePath();
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
    }

    // Draw the target pitch line
    drawTargetLine() {
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.targetY);
        this.ctx.lineTo(this.canvasWidth, this.targetY);
        this.ctx.strokeStyle = 'green'; // Green line for target pitch
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    // Update the visualizer (draw arrow and target line)
    update(pitch) {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // Clear canvas

        // Update the arrow's y position based on the pitch
        if (pitch !== -1 && pitch !== Infinity) {
            this.arrowY = this.normalizePitch(pitch);
        }

        // Draw the target line
        this.drawTargetLine();

        // Draw the arrow representing the current pitch
        this.drawArrow(this.arrowY);
    }

    // Function to check how close the player is to the target pitch
    getScore(pitch) {
        if (pitch === -1 || pitch === Infinity) return 0;
        const normalizedPitchY = this.normalizePitch(pitch);
        const distance = Math.abs(this.targetY - normalizedPitchY);
        // The closer the distance, the higher the score (inverse relation)
        return Math.max(0, 100 - distance);
    }
}
