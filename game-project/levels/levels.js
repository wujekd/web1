
    const levels = [
        {
            id: 1,
            name: "Keep Steady!",
            description: "Just a C# arpeggio...",
            points: 45,
            levelMelody: [
            ],
            tempo: 99
        },
        {
            id: 2,
            name: "A Minor Fall",
            description: "A simple challenge for maintaining steady pitch.",
            points: 45,
            levelMelody: [
                { note: "G#", frequency: 207.65, startTime: 0.341333, endTime: 0.8 },
                { note: "E", frequency: 164.81, startTime: 1.002666, endTime: 1.301333 },
                { note: "C#", frequency: 138.59, startTime: 1.642666, endTime: 2.421333 }
            ],
            tempo: 99
        },
        {
            id: 3,
            name: "A Major Lift",
            description: "Puts a smile on your F - A - C - E",
            points: 45,
            levelMelody: [
                
            ],
            tempo: 99
        },
        
    ]


    export default function(level){
        if (level == "all"){
            return levels;
        }
        // const temp = parseInt(level)
        return levels[level - 1];
    }