export const workoutPlans = [
    { 
        name: '5-Day Bodybuilding Split', 
        category: 'Bulk / Strength',
        description: 'A classic 5-day split focusing on one major muscle group per day to maximize hypertrophy and strength.',
        week: [
            { day: 'Monday', focus: 'Chest', routine: [{ exerciseId: 'benchpress', sets: 4, reps: '6-8' }, { exerciseId: 'pushup', sets: 3, reps: '10-12' }, { exerciseId: 'dips', sets: 3, reps: '8-12' }] },
            { day: 'Tuesday', focus: 'Back', routine: [{ exerciseId: 'deadlift', sets: 3, reps: '5-8' }, { exerciseId: 'pullup', sets: 4, reps: 'As many as possible' }, { exerciseId: 'latpulldown', sets: 3, reps: '8-12' }] },
            { day: 'Wednesday', focus: 'Legs', routine: [{ exerciseId: 'squat', sets: 4, reps: '6-8' }, { exerciseId: 'legpress', sets: 3, reps: '10-15' }, { exerciseId: 'lunge', sets: 3, reps: '10 per leg' }] },
            { day: 'Thursday', focus: 'Shoulders', routine: [{ exerciseId: 'overheadpress', sets: 4, reps: '8-10' }, { exerciseId: 'bicepcurl', sets: 3, reps: '10-12' }] },
            { day: 'Friday', focus: 'Arms', routine: [{ exerciseId: 'bicepcurl', sets: 4, reps: '10-12' }, { exerciseId: 'triceppushdown', sets: 4, reps: '10-12' }, { exerciseId: 'dips', sets: 3, reps: '8-12' }] },
            { day: 'Saturday', focus: 'Rest', routine: [] },
            { day: 'Sunday', focus: 'Rest', routine: [] },
        ]
    },
    {
        name: '3-Day Full Body Foundation',
        category: 'Beginner / Strength',
        description: 'Perfect for beginners, hitting all major muscle groups three times a week to build a solid foundation.',
        week: [
            { day: 'Monday', focus: 'Full Body A', routine: [{ exerciseId: 'squat', sets: 3, reps: '8-12' }, { exerciseId: 'benchpress', sets: 3, reps: '8-12' }, { exerciseId: 'latpulldown', sets: 3, reps: '8-12' }] },
            { day: 'Tuesday', focus: 'Rest', routine: [] },
            { day: 'Wednesday', focus: 'Full Body B', routine: [{ exerciseId: 'deadlift', sets: 3, reps: '5-8' }, { exerciseId: 'overheadpress', sets: 3, reps: '8-12' }, { exerciseId: 'pullup', sets: 3, reps: 'As many as possible' }] },
            { day: 'Thursday', focus: 'Rest', routine: [] },
            { day: 'Friday', focus: 'Full Body A', routine: [{ exerciseId: 'squat', sets: 3, reps: '8-12' }, { exerciseId: 'benchpress', sets: 3, reps: '8-12' }, { exerciseId: 'latpulldown', sets: 3, reps: '8-12' }] },
            { day: 'Saturday', focus: 'Rest', routine: [] },
            { day: 'Sunday', focus: 'Light Cardio', routine: [{ exerciseId: 'lightjog', sets: 1, reps: '20-30 minutes'}] },
        ]
    },
    {
        name: 'Calisthenics & Shred',
        category: 'Calisthenics / Shredded',
        description: 'Use your bodyweight to build functional strength and achieve a lean physique. High intensity.',
        week: [
             { day: 'Monday', focus: 'Upper Body', routine: [{ exerciseId: 'pullup', sets: 5, reps: 'AMRAP' }, { exerciseId: 'pushup', sets: 5, reps: 'AMRAP' }, { exerciseId: 'dips', sets: 5, reps: 'AMRAP' }] },
             { day: 'Tuesday', focus: 'Lower Body & Core', routine: [{ exerciseId: 'squat', sets: 4, reps: '20-25' }, { exerciseId: 'lunge', sets: 4, reps: '15 per leg' }, { exerciseId: 'plank', sets: 4, reps: '60s hold' }] },
             { day: 'Wednesday', focus: 'HIIT Cardio', routine: [{ exerciseId: 'burpee', sets: 5, reps: '15' }, { exerciseId: 'running', sets: 1, reps: 'Sprints: 8x 100m' }] },
             { day: 'Thursday', focus: 'Upper Body', routine: [{ exerciseId: 'pullup', sets: 5, reps: 'AMRAP' }, { exerciseId: 'pushup', sets: 5, reps: 'AMRAP' }, { exerciseId: 'dips', sets: 5, reps: 'AMRAP' }] },
             { day: 'Friday', focus: 'Lower Body & Core', routine: [{ exerciseId: 'squat', sets: 4, reps: '20-25' }, { exerciseId: 'lunge', sets: 4, reps: '15 per leg' }, { exerciseId: 'plank', sets: 4, reps: '60s hold' }] },
             { day: 'Saturday', focus: 'Active Recovery', routine: [{ exerciseId: 'lightjog', sets: 1, reps: '30 min light jog'}] },
             { day: 'Sunday', focus: 'Rest', routine: [] },
        ]
    },
    {
        name: 'Athletic Performance',
        category: 'Sports Specific / Endurance',
        description: 'Develop explosive power, speed, and cardiovascular endurance for sports.',
        week: [
            { day: 'Monday', focus: 'Power', routine: [{ exerciseId: 'deadlift', sets: 5, reps: '3-5' }, { exerciseId: 'boxjump', sets: 5, reps: '5' }] },
            { day: 'Tuesday', focus: 'Conditioning', routine: [{ exerciseId: 'running', sets: 1, reps: 'Sprints: 10x 200m' }, { exerciseId: 'burpee', sets: 3, reps: '10' }] },
            { day: 'Wednesday', focus: 'Active Recovery', routine: [] },
            { day: 'Thursday', focus: 'Power', routine: [{ exerciseId: 'squat', sets: 5, reps: '3-5' }, { exerciseId: 'overheadpress', sets: 5, reps: '5' }] },
            { day: 'Friday', focus: 'Conditioning', routine: [{ exerciseId: 'burpee', sets: 10, reps: '10 (every minute)' }, { exerciseId: 'plank', sets: 3, reps: '60s' }] },
            { day: 'Saturday', focus: 'Game Day / Rest', routine: [] },
            { day: 'Sunday', focus: 'Rest', routine: [] },
        ]
    },
    {
        name: '4-Day Upper/Lower Split',
        category: 'Strength / Balanced',
        description: 'Alternate upper- and lower-body workouts twice a week: optimal balance of volume and recovery, ideal for hypertrophy and strength gains.',
        week: [
          { day: 'Monday', focus: 'Upper A', routine: [ { exerciseId: 'benchpress', sets: 3, reps: '6-8' }, { exerciseId: 'barbellrow', sets: 3, reps: '6-8' }, { exerciseId: 'overheadpress', sets: 3, reps: '8-10' }, { exerciseId: 'pullup', sets: 3, reps: 'AMRAP' }, { exerciseId: 'bicepcurl', sets: 2, reps: '10-12' }, { exerciseId: 'tricepextension', sets: 2, reps: '10-12' }, ] },
          { day: 'Tuesday', focus: 'Lower A', routine: [ { exerciseId: 'squat', sets: 3, reps: '6-8' }, { exerciseId: 'deadlift', sets: 2, reps: '5-8' }, { exerciseId: 'legpress', sets: 3, reps: '10-12' }, { exerciseId: 'calfraise', sets: 3, reps: '12-15' }, ] },
          { day: 'Wednesday', focus: 'Rest', routine: [] },
          { day: 'Thursday', focus: 'Upper B', routine: [ { exerciseId: 'inclinebench', sets: 3, reps: '8-10' }, { exerciseId: 'seatedrow', sets: 3, reps: '8-10' }, { exerciseId: 'overheadpress', sets: 3, reps: '8-10' }, { exerciseId: 'latpulldown', sets: 3, reps: '8-12' }, { exerciseId: 'hammercurl', sets: 2, reps: '10-12' }, { exerciseId: 'triceppushdown', sets: 2, reps: '10-12' }, ] },
          { day: 'Friday', focus: 'Lower B', routine: [ { exerciseId: 'frontsquat', sets: 3, reps: '6-8' }, { exerciseId: 'romanian_deadlift', sets: 3, reps: '8-10' }, { exerciseId: 'lunge', sets: 3, reps: '10 per leg' }, { exerciseId: 'plank', sets: 3, reps: '60s hold' }, ] },
          { day: 'Saturday', focus: 'Optional: Core/Conditioning', routine: [] },
          { day: 'Sunday', focus: 'Rest', routine: [] },
        ]
    },
    {
        name: 'Arnold 6-Day Split',
        category: 'Intermediate / Hypertrophy',
        description: 'High-volume: repeat a 3-day split twice per week with one rest day.',
        week: [
          { day: 'Monday', focus: 'Chest & Back', routine: [ { exerciseId: 'benchpress', sets: 4, reps: '8-12' }, { exerciseId: 'barbellrow', sets: 4, reps: '8-12' }, { exerciseId: 'inclinebench', sets: 3, reps: '8-12' }, { exerciseId: 'latpulldown', sets: 3, reps: '8-12' }, ]},
          { day: 'Tuesday', focus: 'Shoulders & Arms', routine: [ { exerciseId: 'overheadpress', sets: 4, reps: '8-10' }, { exerciseId: 'lateralraise', sets: 3, reps: '10-12' }, { exerciseId: 'bicepcurl', sets: 4, reps: '10-12' }, { exerciseId: 'dips', sets: 4, reps: '10-12' }, ]},
          { day: 'Wednesday', focus: 'Legs & Core', routine: [ { exerciseId: 'squat', sets: 4, reps: '8-12' }, { exerciseId: 'legpress', sets: 3, reps: '10-15' }, { exerciseId: 'legcurl', sets: 3, reps: '10-15' }, { exerciseId: 'plank', sets: 3, reps: '60s' }, ]},
          { day: 'Thursday', focus: 'Chest & Back', routine: [ { exerciseId: 'benchpress', sets: 4, reps: '8-12' }, { exerciseId: 'barbellrow', sets: 4, reps: '8-12' }, { exerciseId: 'inclinebench', sets: 3, reps: '8-12' }, { exerciseId: 'latpulldown', sets: 3, reps: '8-12' }, ]},
          { day: 'Friday', focus: 'Shoulders & Arms', routine: [ { exerciseId: 'overheadpress', sets: 4, reps: '8-10' }, { exerciseId: 'lateralraise', sets: 3, reps: '10-12' }, { exerciseId: 'bicepcurl', sets: 4, reps: '10-12' }, { exerciseId: 'dips', sets: 4, reps: '10-12' }, ]},
          { day: 'Saturday', focus: 'Legs & Core', routine: [ { exerciseId: 'squat', sets: 4, reps: '8-12' }, { exerciseId: 'legpress', sets: 3, reps: '10-15' }, { exerciseId: 'legcurl', sets: 3, reps: '10-15' }, { exerciseId: 'plank', sets: 3, reps: '60s' }, ]},
          { day: 'Sunday', focus: 'Rest', routine: [] },
        ]
    },
];
