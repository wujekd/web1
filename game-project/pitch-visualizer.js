export default class PitchVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvasHeight = this.canvas.height;
        this.canvasWidth = this.canvas.width;

        this.arrowX = this.canvasWidth / 2;
        this.arrowY = this.canvasHeight / 2; // Initial arrow position in the middle
        this.pathData = [];  // Array to store the path data (arrowX, arrowY)
        this.trackLength = 1;  // Will be updated with actual track length
    }

    // Set track length (called when the audio is loaded)
    setTrackLength(trackLength) {
        this.trackLength = trackLength;
    }

    // Normalize pitch to fit within the canvas height
    normalizePitch(pitch) {
        const minFreq = 60;  // Lower bound for frequency
        const maxFreq = 700; // Upper bound for frequency
        const clampedPitch = Math.min(Math.max(pitch, minFreq), maxFreq);
        return this.canvasHeight - ((clampedPitch - minFreq) / (maxFreq - minFreq)) * this.canvasHeight;
    }

    // Update playhead position
    updatePlayhead(currentTime) {
        this.arrowX = (currentTime / this.trackLength) * this.canvasWidth;
    }

    // Add the current arrow position to the path array
    addPathPoint(currentTime, pitch) {
        const arrowY = this.normalizePitch(pitch);
        this.pathData.push({ x: (currentTime / this.trackLength) * this.canvasWidth, y: arrowY });
    }

    // Draw the path from the stored pathData array
    drawPath() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';  // Path color (green with transparency)

        // Loop through the stored path points and draw them
        for (let i = 0; i < this.pathData.length - 1; i++) {
            const start = this.pathData[i];
            const end = this.pathData[i + 1];
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
        }

        this.ctx.stroke();
    }

    // Draw the arrow at the current position
    drawArrow() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.arrowX - 10, this.arrowY);
        this.ctx.lineTo(this.arrowX + 10, this.arrowY);
        this.ctx.lineTo(this.arrowX, this.arrowY - 20);
        this.ctx.closePath();
        this.ctx.fillStyle = 'red';  // Arrow color
        this.ctx.fill();
    }

    // Main update function
    update(pitch, currentTime) {
        this.addPathPoint(currentTime, pitch);  // Add current position to the path
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);  // Clear canvas

        this.updatePlayhead(currentTime);  // Update the playhead position
        this.drawPath();  // Draw the path
        this.drawArrow();  // Draw the arrow at the current position
    }
}
