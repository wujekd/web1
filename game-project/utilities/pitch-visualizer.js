export default class PitchVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvasHeight = this.canvas.height;
        this.canvasWidth = this.canvas.width;

        this.arrowX = this.canvasWidth / 2;
        this.arrowY = this.canvasHeight / 2; 

        this.pathData = []; 
        this.targetData = [];
        this.trackLength = 1; 
    }

    
    setTrackLength(trackLength) {
        this.trackLength = trackLength;
    }

    
    setTarget(targetMelody) {
        this.targetData = targetMelody.map(note => {
            const startX = (note.startTime / this.trackLength) * this.canvasWidth;
            const endX = (note.endTime / this.trackLength) * this.canvasWidth;
            const targetY = this.normalizePitch(note.frequency);
            return { startX, endX, targetY, note: note.note };  
        });
    }

    normalizePitch(pitch) {
        const minFreq = 110;  // Lower bound for frequency
        const maxFreq = 250; // Upper bound for frequency
        const clampedPitch = Math.min(Math.max(pitch, minFreq), maxFreq);
        return this.canvasHeight - ((clampedPitch - minFreq) / (maxFreq - minFreq)) * this.canvasHeight;
    }

    // Update playhead position
    updatePlayhead(currentTime, pitch) {
        this.arrowX = (currentTime / this.trackLength) * this.canvasWidth;
        this.arrowY = this.normalizePitch(pitch);
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
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.9)'; 

        for (let i = 0; i < this.pathData.length - 1; i++) {
            const start = this.pathData[i];
            const end = this.pathData[i + 1];
            this.ctx.moveTo(start.x, start.y);
            this.ctx.lineTo(end.x, end.y);
        }

        this.ctx.stroke();
    }

    
    drawTarget() {
        this.ctx.lineWidth = 8;
    
     
        this.targetData.forEach(target => {
            this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
            this.ctx.beginPath();
            this.ctx.moveTo(target.startX, target.targetY);
            this.ctx.lineTo(target.endX, target.targetY);
            this.ctx.stroke();
    
         
            this.ctx.fillStyle = 'white';
            this.ctx.font = '38px Monospace';
            this.ctx.fillText(target.note, target.startX + 5, target.targetY - 5);
        });
    }
    drawPlayhead(currentTime) {
     
        let position = (currentTime / this.trackLength) * this.canvasWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(position, 0);
        this.ctx.lineTo(position, this.canvas.height);
        this.ctx.strokeStyle = 'blue';  // Playhead color
        this.ctx.lineWidth = 3;  // Thicker playhead line (set to 3px)
        this.ctx.stroke();
    }

   
    drawArrow() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.arrowX - 10, this.arrowY);
        this.ctx.lineTo(this.arrowX + 10, this.arrowY);
        this.ctx.lineTo(this.arrowX, this.arrowY - 20);
        this.ctx.closePath();
        this.ctx.fillStyle = 'red';  // Arrow color
        this.ctx.fill();
    }

  
    update(pitch, currentTime) {
        this.addPathPoint(currentTime, pitch); 
        this.updatePlayhead(currentTime, pitch);
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); 

        this.drawPlayhead(currentTime);  
        this.drawTarget(); 
        this.drawPath();
        this.drawArrow();  
    }
}
