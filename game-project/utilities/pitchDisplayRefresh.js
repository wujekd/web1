//update pitch display
export function pitchDisplayRefresh(pitch, pitchDisplay){
    if (pitch !== -1 && pitch !== Infinity) {
        pitchDisplay.textContent = `Pitch: ${Math.round(pitch)} Hz`;
    } else {
        pitchDisplay.textContent = 'Pitch: -- Hz';
    }
}