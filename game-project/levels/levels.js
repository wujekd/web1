
    const levels = [
        {
            name: "Mic Check",
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
            name: "Minor Nostalgia",
            description: "Just a C# arpeggio...",
            points: 45
        },
    ]


    export default function(level){
        if (level == "all"){
            return levels;
        }
        
        return levels[level]
    }