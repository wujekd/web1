import updateMeter from "./updateMeter.js";

// Function to update the visual volume meter based on audio level
export default function (audioAnalyser, volumeBar) {
    const level = audioAnalyser.getAudioLevel(); // Get current audio level
    const widthPercentage = Math.min(level * 100, 100); // Convert level to percentage
    volumeBar.style.width = `${widthPercentage * 2.5}%`; // Update volume bar width
    
    // Continuously update meter using animation frame
    requestAnimationFrame(() => updateMeter(audioAnalyser, volumeBar));
}
