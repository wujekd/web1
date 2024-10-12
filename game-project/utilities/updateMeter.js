import updateMeter from "./updateMeter.js"

export default function (audioAnalyser, volumeBar) {
    const level = audioAnalyser.getAudioLevel();
    const widthPercentage = Math.min(level * 100, 100);
    volumeBar.style.width = `${widthPercentage * 2.5}%`;
    
    requestAnimationFrame(() => updateMeter(audioAnalyser, volumeBar));
}