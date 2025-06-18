import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Dumbbell, Zap, Target, Award, TrendingUp, X, Plus, Star, Footprints, UserCircle, LogOut, Trophy, Pencil, Check, BookOpen, Search, ChevronDown, BarChart3, CalendarCheck2 } from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc, addDoc, collection, updateDoc, serverTimestamp, query } from 'firebase/firestore';


// --- DATA: WORKOUTS & EXERCISES ---
const exerciseLibrary = [
    { 
        id: 'pushup', name: 'Push Up', muscleGroup: 'Chest, Shoulders, Triceps', equipment: 'Bodyweight', 
        description: 'A fundamental bodyweight exercise that builds upper body strength.',
        steps: ['Start in a high plank position with hands slightly wider than your shoulders.', 'Keep your body in a straight line from head to heels.', 'Lower your body until your chest nearly touches the floor.', 'Push explosively back up to the starting position.'],
        tips: ['Keep your core engaged.', 'Don\'t let your hips sag.', 'Tuck your elbows in slightly (45-degree angle).'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Push+Up+Animation'
    },
    { 
        id: 'squat', name: 'Squat', muscleGroup: 'Quads, Glutes, Hamstrings', equipment: 'Bodyweight/Barbell',
        description: 'The king of leg exercises, building lower body strength and stability.',
        steps: ['Stand with feet shoulder-width apart, toes pointing slightly out.', 'Keep your chest up and back straight.', 'Lower your hips back and down as if sitting in a chair.', 'Go as deep as you can comfortably, aiming for thighs parallel to the floor.', 'Drive through your heels to return to the starting position.'],
        tips: ['Keep your knees in line with your toes.', 'Don\'t let your chest fall forward.', 'Engage your core throughout the movement.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Squat+Animation'
    },
    { 
        id: 'pullup', name: 'Pull Up', muscleGroup: 'Back, Biceps', equipment: 'Pull-up Bar',
        description: 'An advanced upper body exercise that builds a wide, strong back.',
        steps: ['Hang from a pull-up bar with an overhand grip, slightly wider than your shoulders.', 'Start from a dead hang with arms fully extended.', 'Pull your body up by squeezing your lats, until your chin is over the bar.', 'Lower back down with control to the starting position.'],
        tips: ['Avoid using momentum or swinging.', 'Keep your shoulders pulled down and back.', 'Imagine pulling your elbows down to your pockets.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Pull+Up+Animation'
    },
    { 
        id: 'lunge', name: 'Lunge', muscleGroup: 'Legs', equipment: 'Bodyweight',
        description: 'A unilateral exercise excellent for leg strength, balance, and stability.',
        steps: ['Stand tall with your feet together.', 'Step forward with one leg.', 'Lower your hips until both knees are bent at a 90-degree angle.', 'Your front knee should be directly above your ankle, and your back knee should hover just off the ground.', 'Push off your front foot to return to the starting position.'],
        tips: ['Keep your torso upright and core engaged.', 'Don\'t let your front knee travel past your toes.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Lunge+Animation'
    },
    { 
        id: 'plank', name: 'Plank', muscleGroup: 'Core', equipment: 'Bodyweight',
        description: 'An isometric core exercise that builds stability in your abs, obliques, and lower back.',
        steps: ['Place your forearms on the ground with elbows aligned below shoulders.', 'Extend your legs back, resting on your toes.', 'Your body should form a straight line from head to heels.', 'Engage your core and glutes.'],
        tips: ['Don\'t let your hips sag or rise too high.', 'Keep your neck in a neutral position, looking at the floor.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Plank+Animation'
    },
    { 
        id: 'deadlift', name: 'Deadlift', muscleGroup: 'Back, Glutes, Hamstrings', equipment: 'Barbell',
        description: 'A full-body strength builder that develops the posterior chain.',
        steps: ['Stand with your mid-foot under the barbell.', 'Hinge at the hips and bend your knees to grip the bar.', 'Keep your back straight, chest up, and shoulders back.', 'Drive through your feet and lift the bar by extending your hips and knees.', 'Lower the bar with control by reversing the motion.'],
        tips: ['Keep the bar close to your body.', 'Maintain a neutral spine at all times.', 'Engage your lats to keep the bar stable.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Deadlift+Animation'
    },
    {
        id: 'benchpress', name: 'Bench Press', muscleGroup: 'Chest, Shoulders, Triceps', equipment: 'Barbell/Dumbbells',
        description: 'The primary upper body lift for building chest size and strength.',
        steps: ['Lie on a flat bench with your feet firmly on the ground.', 'Grip the barbell slightly wider than shoulder-width.', 'Unrack the bar and hold it directly over your chest.', 'Lower the bar to your mid-chest, keeping your elbows tucked.', 'Press the bar back up to the starting position.'],
        tips: ['Keep your shoulder blades retracted and squeezed together.', 'Drive your feet into the floor for stability.', 'Don\'t bounce the bar off your chest.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Bench+Press+Animation'
    },
    { 
        id: 'overheadpress', name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Dumbbells/Barbell',
        description: 'Builds strong, broad shoulders and improves overhead stability.',
        steps: ['Sit or stand with the weight at your shoulders, palms facing forward.', 'Keep your core tight and glutes squeezed.', 'Press the weight directly overhead until your arms are fully extended.', 'Lower the weight back to your shoulders with control.'],
        tips: ['Don\'t use your legs to push the weight (unless doing a Push Press).', 'Keep your wrists straight and aligned with your forearms.', 'Avoid arching your lower back excessively.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Overhead+Press+Animation'
    },
    { 
        id: 'bicepcurl', name: 'Bicep Curl', muscleGroup: 'Arms', equipment: 'Dumbbells',
        description: 'An isolation exercise for building the bicep muscles.',
        steps: ['Stand or sit holding dumbbells at your sides, palms facing forward.', 'Keeping your upper arms stationary, curl the dumbbells up towards your shoulders.', 'Squeeze your biceps at the top of the movement.', 'Lower the dumbbells with control.'],
        tips: ['Avoid swinging your body to lift the weight.', 'Control the eccentric (lowering) phase of the lift.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Bicep+Curl+Animation'
    },
    { 
        id: 'triceppushdown', name: 'Tricep Pushdown', muscleGroup: 'Arms', equipment: 'Cable Machine',
        description: 'An isolation exercise to target the triceps.',
        steps: ['At a cable station, attach a straight bar or rope to the high pulley.', 'Grip the attachment with an overhand grip.', 'Keeping your elbows tucked at your sides, push the bar down until your arms are fully extended.', 'Slowly return to the starting position.'],
        tips: ['Only your forearms should move.', 'Keep your core tight and avoid leaning over the weight.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Tricep+Pushdown+Animation'
    },
    { 
        id: 'latpulldown', name: 'Lat Pulldown', muscleGroup: 'Back', equipment: 'Cable Machine',
        description: 'Simulates a pull-up to build back width and strength.',
        steps: ['Sit at a lat pulldown station, securing your knees under the pads.', 'Grab the bar with a wide, overhand grip.', 'Pull the bar down to your upper chest, squeezing your lats.', 'Focus on pulling with your elbows.', 'Slowly return to the starting position.'],
        tips: ['Avoid leaning back too far.', 'Keep your chest up and shoulders down.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Lat+Pulldown+Animation'
    },
    { 
        id: 'legpress', name: 'Leg Press', muscleGroup: 'Legs', equipment: 'Machine',
        description: 'A machine-based compound exercise for building leg mass.',
        steps: ['Sit in a leg press machine with your feet flat on the platform, shoulder-width apart.', 'Push the platform away by extending your knees.', 'Lower the platform with control until your knees are at a 90-degree angle.', 'Do not lock your knees at the top of the movement.'],
        tips: ['Keep your back and hips flat against the seat.', 'Control the weight throughout the entire range of motion.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Leg+Press+Animation'
    },
    { 
        id: 'burpee', name: 'Burpee', muscleGroup: 'Full Body', equipment: 'Bodyweight',
        description: 'A high-intensity, full-body exercise for conditioning and calorie burning.',
        steps: ['Start in a standing position.', 'Drop into a squat and place your hands on the floor.', 'Kick your feet back into a high plank position.', 'Perform a push-up.', 'Jump your feet back to the squat position.', 'Explode up into a jump, clapping your hands overhead.'],
        tips: ['Maintain a fast but controlled pace.', 'Can be modified by removing the push-up or the jump.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Burpee+Animation'
    },
    { 
        id: 'running', name: 'Running', muscleGroup: 'Cardio', equipment: 'None',
        description: 'A classic cardiovascular exercise to improve heart health and endurance.',
        steps: ['Maintain an upright posture.', 'Land on your mid-foot, not your heel.', 'Keep your arms bent at a 90-degree angle and swing them forward and back, not across your body.'],
        tips: ['Start with a warm-up and end with a cool-down.', 'Listen to your body and avoid overexertion.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Running+Animation'
    },
    { 
        id: 'dips', name: 'Dips', muscleGroup: 'Triceps, Chest, Shoulders', equipment: 'Parallel Bars',
        description: 'A powerful bodyweight exercise for the upper body.',
        steps: ['Hold yourself up on parallel bars with your arms straight.', 'Lower your body by bending your elbows until they are at a 90-degree angle.', 'Keep your torso upright to target the triceps, or lean forward to target the chest.', 'Press back up to the starting position.'],
        tips: ['Keep your shoulders down and away from your ears.', 'Control the descent to protect your shoulder joints.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Dips+Animation'
    },
    { 
        id: 'boxjump', name: 'Box Jump', muscleGroup: 'Legs', equipment: 'Box',
        description: 'An explosive plyometric exercise to develop power.',
        steps: ['Stand in front of a sturdy box or platform.', 'Swing your arms and hinge at the hips to generate momentum.', 'Jump explosively up onto the box.', 'Land softly on the center of the box with your knees bent.', 'Step down, do not jump down.'],
        tips: ['Start with a low box and gradually increase the height.', 'Focus on a soft, quiet landing.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Box+Jump+Animation'
    },
    { 
        id: 'inclinebench', name: 'Incline Bench Press', muscleGroup: 'Upper Chest, Shoulders', equipment: 'Barbell/Dumbbells',
        description: 'Targets the upper portion of the pectoral muscles.',
        steps: ['Lie on a bench set to a 30-45 degree incline.', 'Grip the weight and hold it above your upper chest.', 'Lower the weight with control until it touches your upper chest.', 'Press the weight back up to the starting position.'],
        tips: ['Do not bounce the weight off your chest.', 'Keep your feet flat on the floor for stability.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Incline+Bench+Animation'
    },
     { 
        id: 'barbellrow', name: 'Barbell Row', muscleGroup: 'Back, Biceps', equipment: 'Barbell',
        description: 'A core compound lift for building a thick, strong back.',
        steps: ['Stand with feet shoulder-width apart, with a loaded barbell on the floor.', 'Hinge at your hips until your torso is nearly parallel to the floor, keeping your back straight.', 'Grip the bar with an overhand grip, slightly wider than your shoulders.', 'Pull the bar up towards your lower chest, squeezing your back muscles.', 'Lower the bar with control.'],
        tips: ['Maintain a neutral spine throughout.', 'Avoid using momentum from your lower back to lift the weight.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Barbell+Row+Animation'
    },
    { 
        id: 'tricepextension', name: 'Tricep Extension', muscleGroup: 'Triceps', equipment: 'Dumbbells/Cable',
        description: 'An isolation movement to target all three heads of the triceps.',
        steps: ['Lie on a bench or stand up straight.', 'Hold a dumbbell or cable attachment with both hands and extend it overhead.', 'Keeping your upper arms stationary, lower the weight behind your head by bending your elbows.', 'Extend your arms to lift the weight back to the starting position.'],
        tips: ['Keep your elbows pointed forward, not flared out.', 'Focus on a full stretch and contraction of the tricep.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Tricep+Extension+Animation'
    },
    { 
        id: 'seatedrow', name: 'Seated Cable Row', muscleGroup: 'Back', equipment: 'Cable Machine',
        description: 'Targets the mid-back muscles, improving posture and thickness.',
        steps: ['Sit at a cable row machine with your feet on the platform and knees slightly bent.', 'Grasp the handle with a neutral grip.', 'Keeping your back straight, pull the handle towards your lower abdomen.', 'Squeeze your shoulder blades together at the peak of the contraction.', 'Slowly return to the starting position.'],
        tips: ['Avoid rounding your back.', 'Don\'t use momentum by leaning far back and forward.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Seated+Row+Animation'
    },
    { 
        id: 'hammercurl', name: 'Hammer Curl', muscleGroup: 'Biceps, Forearms', equipment: 'Dumbbells',
        description: 'A bicep curl variation that also heavily engages the brachialis and forearm muscles.',
        steps: ['Stand holding dumbbells with a neutral grip (palms facing each other).', 'Keeping your upper arms stationary, curl the dumbbells up towards your shoulders.', 'Squeeze at the top of the movement.', 'Lower with control.'],
        tips: ['Can be performed alternating arms or both at the same time.', 'Avoid swinging the weights.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Hammer+Curl+Animation'
    },
    { 
        id: 'frontsquat', name: 'Front Squat', muscleGroup: 'Quads, Core', equipment: 'Barbell',
        description: 'A squat variation that places more emphasis on the quads and requires significant core strength.',
        steps: ['Hold a barbell across the front of your shoulders with a "clean" grip or by crossing your arms.', 'Keep your elbows high and chest up.', 'Perform a squat, keeping your torso as upright as possible.', 'Drive through your heels to return to the start.'],
        tips: ['Maintaining an upright torso is critical.', 'Requires good wrist and shoulder mobility.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Front+Squat+Animation'
    },
    { 
        id: 'romanian_deadlift', name: 'Romanian Deadlift (RDL)', muscleGroup: 'Hamstrings, Glutes', equipment: 'Barbell/Dumbbells',
        description: 'An excellent exercise for targeting the hamstrings and glutes.',
        steps: ['Stand holding a barbell or dumbbells in front of your thighs.', 'Keeping your legs almost straight (with a slight bend in the knees), hinge at your hips.', 'Lower the weight by pushing your hips back, keeping your back straight.', 'Lower until you feel a deep stretch in your hamstrings.', 'Return to the starting position by squeezing your glutes.'],
        tips: ['Focus on the hip hinge, not squatting down.', 'Keep the weight close to your legs.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=RDL+Animation'
    },
    { 
        id: 'calfraise', name: 'Calf Raise', muscleGroup: 'Calves', equipment: 'Bodyweight/Machine',
        description: 'An isolation exercise for the calf muscles.',
        steps: ['Stand with the balls of your feet on an elevated surface.', 'Press up through the balls of your feet, raising your heels as high as possible.', 'Hold the peak contraction briefly.', 'Lower your heels until you feel a stretch in your calves.'],
        tips: ['Perform the movement slowly and with control.', 'Can be done with weight for added resistance.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Calf+Raise+Animation'
    },
    { 
        id: 'lightjog', name: 'Light Jog', muscleGroup: 'Cardio', equipment: 'None',
        description: 'Low-intensity cardiovascular exercise for active recovery and warming up.',
        steps: ['Maintain a comfortable, conversational pace.', 'Focus on light, easy strides.', 'Keep your breathing steady and controlled.'],
        tips: ['Ideal for rest days or between high-intensity sets.', 'Helps increase blood flow and aid recovery.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Light+Jog+Animation'
    },
    { 
        id: 'dumbbellfly', name: 'Dumbbell Fly', muscleGroup: 'Chest', equipment: 'Dumbbells',
        description: 'An isolation exercise to stretch and target the chest muscles.',
        steps: ['Lie on a flat or incline bench with a dumbbell in each hand.', 'Press the dumbbells up above your chest with palms facing each other.', 'With a slight bend in your elbows, lower the dumbbells out to your sides in a wide arc.', 'Lower until you feel a stretch in your chest.', 'Return the dumbbells to the starting position using the same arc.'],
        tips: ['Do not go too heavy.', 'Focus on the chest stretch, not just lifting the weight.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Dumbbell+Fly+Animation'
    },
    { 
        id: 'legextension', name: 'Leg Extension', muscleGroup: 'Quads', equipment: 'Machine',
        description: 'An isolation exercise for the quadriceps muscles.',
        steps: ['Sit in a leg extension machine with your shins against the pad.', 'Extend your legs to lift the weight until your legs are straight.', 'Squeeze your quads at the top.', 'Lower the weight with control.'],
        tips: ['Avoid using momentum.', 'This exercise is best used with lighter weight and higher reps.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Leg+Extension+Animation'
    },
    { 
        id: 'legcurl', name: 'Leg Curl', muscleGroup: 'Hamstrings', equipment: 'Machine',
        description: 'An isolation exercise for the hamstring muscles.',
        steps: ['Lie face down on a leg curl machine (or sit in a seated version).', 'Hook your ankles under the pad.', 'Curl your legs up, bringing your heels towards your glutes.', 'Squeeze your hamstrings at the top.', 'Lower the weight with control.'],
        tips: ['Avoid lifting your hips off the bench.', 'Focus on the mind-muscle connection with your hamstrings.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Leg+Curl+Animation'
    },
    { 
        id: 'lateralraise', name: 'Lateral Raise', muscleGroup: 'Shoulders', equipment: 'Dumbbells',
        description: 'Targets the medial (side) deltoid for broader shoulders.',
        steps: ['Stand or sit holding dumbbells at your sides.', 'With a slight bend in your elbows, raise your arms out to your sides until they are parallel with the floor.', 'Lower the dumbbells with control.'],
        tips: ['Lead with your elbows.', 'Avoid using momentum or shrugging your traps.'],
        imageUrl: 'https://placehold.co/600x400/27272a/E4E4E7?text=Lateral+Raise+Animation'
    }
];

const workoutPlans = [
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

// --- Firebase Configuration & Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyCCyd7fVIyu-6MffkvIDqLWXulXqfIqGnc",
  authDomain: "fitness-6b841.firebaseapp.com",
  projectId: "fitness-6b841",
  storageBucket: "fitness-6b841.firebasestorage.app",
  messagingSenderId: "805695162103",
  appId: "1:805695162103:web:c5ce0c5476736c2024b5f2",
  measurementId: "G-7ZD3SW2J49"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const appId = firebaseConfig.appId;

// --- Components ---
const GoogleIcon = () => (
    <svg className="w-5 h-5" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 401.9 0 265.9 0 129.8 110.1 20 244 20c69.1 0 125.3 27.6 172.4 72.4l-66 66C314.6 118.5 282.5 102 244 102c-83.2 0-151.2 67.5-151.2 150.9s68 150.9 151.2 150.9c97.1 0 134.4-65.1 140.1-101.6H244v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
    </svg>
);

function LoginScreen() {
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans p-4">
            <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-xl max-w-sm w-full">
                 <div className="flex items-center gap-3 justify-center mb-4">
                    <Zap className="w-10 h-10 text-cyan-400" />
                    <h1 className="text-3xl font-bold text-white tracking-tight">FitQuest</h1>
                </div>
                <UserCircle className="w-20 h-20 text-gray-600 mx-auto my-6" />
                <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                <p className="text-gray-400 mb-8">Sign in to continue your fitness journey.</p>
                <button 
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white text-gray-800 font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:bg-gray-200"
                >
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentView, setCurrentView] = useState('dashboard');
    const [userData, setUserData] = useState({ level: 1, xp: 0, streak: 0, lastActivityDate: null, name: 'Fitness Warrior', activePlan: null, dailyTaskXp: 0 });
    const [workouts, setWorkouts] = useState([]);
    const [dailyCompletion, setDailyCompletion] = useState({});
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [logError, setLogError] = useState(null);

    useEffect(() => {
        document.title = "FitQuest";
        const favicon = document.querySelector("link[rel~='icon']");
        if (favicon) {
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
            favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setIsAuthReady(true);
            }
        });
        return () => unsubscribe();
    }, []);
    
    useEffect(() => {
        if (!user) {
            setIsAuthReady(true);
            return;
        };

        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData({
                    level: data.level || 1,
                    xp: data.xp || 0,
                    streak: data.streak || 0,
                    lastActivityDate: data.lastActivityDate?.toDate(),
                    name: data.name || user.displayName || 'Fitness Warrior',
                    activePlan: data.activePlan || null,
                    dailyTaskXp: data.dailyTaskXp || 0
                });
            } else {
                setDoc(userDocRef, {
                    level: 1, xp: 0, streak: 0, name: user.displayName || 'Fitness Warrior',
                    createdAt: serverTimestamp(), email: user.email, activePlan: null, dailyTaskXp: 0
                });
            }
            setIsAuthReady(true);
        });

        const workoutsColRef = collection(db, 'artifacts', appId, 'users', user.uid, 'workouts');
        const q = query(workoutsColRef);
        const unsubscribeWorkouts = onSnapshot(q, (querySnapshot) => {
            const workoutsData = [];
            querySnapshot.forEach((doc) => {
                workoutsData.push({ id: doc.id, ...doc.data() });
            });
            workoutsData.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
            setWorkouts(workoutsData);
        });
        
        const today = new Date().toISOString().slice(0, 10);
        const dailyProgressRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyProgress', today);
        const unsubscribeDaily = onSnapshot(dailyProgressRef, (docSnap) => {
            if (docSnap.exists()) {
                setDailyCompletion(docSnap.data());
            } else {
                setDailyCompletion({});
            }
        });

        return () => {
            unsubscribeUser();
            unsubscribeWorkouts();
            unsubscribeDaily();
        };
    }, [user]);

    const xpToNextLevel = useMemo(() => Math.floor(100 * Math.pow(1.5, userData.level - 1)), [userData.level]);
    const xpProgress = useMemo(() => (userData.xp / xpToNextLevel) * 100, [userData.xp, xpToNextLevel]);
    const personalBests = useMemo(() => {
        if (workouts.length === 0) return { longestDuration: 0 };
        const longestDuration = Math.max(...workouts.map(w => w.duration));
        return { longestDuration };
    }, [workouts]);
    
    useEffect(() => {
        if (!userData.lastActivityDate || !user) return;
        const today = new Date();
        const lastDate = new Date(userData.lastActivityDate);
        today.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);
        const diffTime = today - lastDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1 && userData.streak > 0) {
            const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
            updateDoc(userDocRef, { streak: 0 });
        }
        if (diffDays >= 1) {
            const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
            updateDoc(userDocRef, { dailyTaskXp: 0 });
        }
    }, [userData.lastActivityDate, userData.streak, user]);

    const handleUpdateName = async (newName) => {
        if (!user || !newName.trim()) return;
        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        try {
            await updateDoc(userDocRef, { name: newName.trim() });
        } catch (error) {
            console.error("Error updating name:", error);
        }
    };

    const handleLogActivity = async (activity) => {
        if (!user) return;
        setLogError(null);
        
        const cappedDuration = Math.min(activity.duration, 240);
        const baseXP = activityTypes.find(a => a.name === activity.type)?.avgXp || 30;
        const calculatedXp = Math.ceil(baseXP * (cappedDuration / 30));

        let updatedUserData = { ...userData, xp: userData.xp + calculatedXp };
        
        let newLevel = updatedUserData.level;
        let xpForNext = Math.floor(100 * Math.pow(1.5, newLevel - 1));

        while (updatedUserData.xp >= xpForNext) {
            updatedUserData.xp -= xpForNext;
            newLevel += 1;
            xpForNext = Math.floor(100 * Math.pow(1.5, newLevel - 1));
        }
        updatedUserData.level = newLevel;

        let newStreak = userData.streak;
        const today = new Date();
        const lastDate = userData.lastActivityDate ? new Date(userData.lastActivityDate) : null;
        today.setHours(0, 0, 0, 0);
        if (!lastDate) {
            newStreak = 1;
        } else {
            lastDate.setHours(0, 0, 0, 0);
            const isSameDay = today.getTime() === lastDate.getTime();
            if (!isSameDay) {
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const isConsecutiveDay = yesterday.getTime() === lastDate.getTime();
                newStreak = isConsecutiveDay ? userData.streak + 1 : 1;
            }
        }
        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        const workoutsColRef = collection(db, 'artifacts', appId, 'users', user.uid, 'workouts');
        try {
            await addDoc(workoutsColRef, { ...activity, xp: calculatedXp, timestamp: serverTimestamp() });
            await updateDoc(userDocRef, {
                level: updatedUserData.level,
                xp: updatedUserData.xp,
                streak: newStreak,
                lastActivityDate: serverTimestamp(),
            });
            setIsLogModalOpen(false);
        } catch (error) {
            console.error("Error logging activity:", error);
            setLogError("Failed to log activity. Please check permissions in Firebase Console.");
        }
    };
    
    const quests = useMemo(() => [
        { id: 1, icon: Dumbbell, text: "Log any workout", completed: workouts.length > 0 },
        { id: 2, icon: Footprints, text: "Log a 30+ minute activity", completed: workouts.some(w => w.duration >= 30) },
    ], [workouts]);

    const handleSelectPlan = async (planName) => {
        if (!user) return;
        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
        try {
            await updateDoc(userDocRef, { activePlan: planName });
            setCurrentView('dashboard');
        } catch (error) {
            console.error("Error selecting plan:", error);
        }
    };
    
    const handleMarkDone = async (exerciseId) => {
        if (!user || dailyCompletion[exerciseId] || userData.dailyTaskXp >= 50) return;

        const today = new Date().toISOString().slice(0, 10);
        const dailyProgressRef = doc(db, 'artifacts', appId, 'users', user.uid, 'dailyProgress', today);
        
        try {
            await setDoc(dailyProgressRef, { [exerciseId]: true }, { merge: true });

            const xpFromTask = 5;
            const newDailyTaskXp = userData.dailyTaskXp + xpFromTask;

            let updatedUserData = { ...userData, xp: userData.xp + xpFromTask, dailyTaskXp: newDailyTaskXp };
            
            let newLevel = updatedUserData.level;
            let xpForNext = Math.floor(100 * Math.pow(1.5, newLevel - 1));

            while (updatedUserData.xp >= xpForNext) {
                updatedUserData.xp -= xpForNext;
                newLevel += 1;
                xpForNext = Math.floor(100 * Math.pow(1.5, newLevel - 1));
            }
            updatedUserData.level = newLevel;
            
            const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
            await updateDoc(userDocRef, { 
                xp: updatedUserData.xp, 
                level: updatedUserData.level, 
                dailyTaskXp: newDailyTaskXp 
            });

        } catch (error) {
            console.error("Error marking exercise as done:", error);
        }
    };

    if (!isAuthReady) {
        return (
            <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center font-sans">
                <div className="text-center">
                    <Zap className="w-16 h-16 text-cyan-400 mx-auto animate-pulse" />
                    <h1 className="text-2xl font-bold mt-4">Connecting to FitQuest...</h1>
                </div>
            </div>
        );
    }
    
    if (!user) {
        return <LoginScreen />;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Header userData={userData} setCurrentView={setCurrentView} currentView={currentView} />
            <main className="p-4 md:p-8 max-w-7xl mx-auto">
                {currentView === 'dashboard' ? (
                    <div className="space-y-8">
                        <DashboardHeader name={userData.name} onLogActivity={() => setIsLogModalOpen(true)} onUpdateName={handleUpdateName} />
                        <TodaysWorkoutCard activePlanName={userData.activePlan} dailyCompletion={dailyCompletion} onMarkDone={handleMarkDone} />
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <StatsCard userData={userData} xpProgress={xpProgress} xpToNextLevel={xpToNextLevel} />
                            <WeeklyActivityChart workouts={workouts} />
                            <QuestsCard quests={quests} />
                        </div>
                        <ActivityFeed workouts={workouts} />
                    </div>
                ) : (
                    <WorkoutsPage activePlanName={userData.activePlan} onSelectPlan={handleSelectPlan} />
                )}
            </main>
            {isLogModalOpen && <LogActivityModal onClose={() => setIsLogModalOpen(false)} onLog={handleLogActivity} error={logError} />}
            <footer className="text-center p-4 text-gray-500 text-xs">
                FitQuest App | User ID: {user.uid}
            </footer>
        </div>
    );
}

function TodaysWorkoutCard({ activePlanName, dailyCompletion, onMarkDone }) {
    if (!activePlanName) {
        return (
            <div className="bg-cyan-900/50 border-2 border-dashed border-cyan-700 p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold text-white mb-2">No Active Plan</h3>
                <p className="text-cyan-200">Go to the "Workouts" page to select a plan and see your daily workout here!</p>
            </div>
        )
    }

    const plan = workoutPlans.find(p => p.name === activePlanName);
    if (!plan) return <p>Plan not found</p>;

    const dayOfWeek = new Date().toLocaleString('en-us', {  weekday: 'long' });
    const todaysRoutine = plan.week.find(d => d.day === dayOfWeek);
    if (!todaysRoutine) return <p>No workout scheduled for today.</p>;


    return (
         <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarCheck2 className="text-cyan-400" /> Today's Workout: <span className="text-cyan-400">{todaysRoutine.focus}</span></h3>
            <p className="text-sm text-gray-400 mb-4">From your plan: <span className="font-semibold">{activePlanName}</span></p>
             {todaysRoutine.routine.length > 0 ? (
                <ul className="space-y-2">
                    {todaysRoutine.routine.map((item, index) => {
                        const exercise = exerciseLibrary.find(ex => ex.id === item.exerciseId);
                        if (!exercise) return null;
                        const isDone = dailyCompletion[exercise.id];
                        return (
                             <li key={index} className="flex justify-between items-center text-sm p-3 bg-gray-700/50 rounded-md">
                                <div>
                                    <span>{exercise.name}</span>
                                    <span className="font-mono text-gray-400 ml-2">{item.sets} x {item.reps}</span>
                                </div>
                                <button 
                                    onClick={() => onMarkDone(exercise.id)}
                                    disabled={isDone}
                                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                                        isDone 
                                        ? 'bg-green-500 text-white cursor-not-allowed' 
                                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                                    }`}
                                >
                                    {isDone ? <Check className="w-4 h-4" /> : 'Done'}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                 <p className="text-center font-bold text-2xl text-green-400 p-8">It's a Rest Day! Enjoy it.</p>
            )}
        </div>
    )
}

function WeeklyActivityChart({ workouts }) {
    const chartData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = Array(7).fill(0);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        workouts.forEach(w => {
            if (w.timestamp && w.timestamp.toDate) {
                const workoutDate = w.timestamp.toDate();
                if (workoutDate >= sevenDaysAgo && workoutDate <= today) {
                    data[workoutDate.getDay()] += 1;
                }
            }
        });
        
        const todayIndex = new Date().getDay();
        const labels = [];
        const chartValues = [];
        for (let i = 6; i >= 0; i--) {
            const dayIndex = (todayIndex - i + 7) % 7;
            labels.push(days[dayIndex]);
            chartValues.push(data[dayIndex]);
        }
        
        return { labels, chartValues };
    }, [workouts]);

    const maxVal = Math.max(...chartData.chartValues, 1);

    return (
         <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 className="text-green-400" />Weekly Report</h3>
            <div className="flex justify-between items-end h-40 gap-2">
                {chartData.labels.map((label, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end gap-1">
                        <div 
                            className="w-full bg-cyan-500 rounded-t-md transition-all duration-500"
                            style={{ height: `${(chartData.chartValues[index] / maxVal) * 100}%` }}
                        ></div>
                        <span className="text-xs text-gray-400">{label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Header({ userData, setCurrentView, currentView }) {
    const handleSignOut = () => {
        signOut(auth).catch(error => console.error("Sign out error:", error));
    };
    const NavLink = ({ viewName, children }) => (
        <button 
            onClick={() => setCurrentView(viewName)}
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${currentView === viewName ? 'bg-cyan-500 text-white' : 'hover:bg-gray-700'}`}
        >
            {children}
        </button>
    );
    return (
        <header className="bg-gray-800 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8 text-cyan-400" />
                    <h1 className="text-2xl font-bold text-white tracking-tight">FitQuest</h1>
                </div>
                 <nav className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg">
                    <NavLink viewName="dashboard">Dashboard</NavLink>
                    <NavLink viewName="workouts">Workouts</NavLink>
                </nav>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-amber-400">
                        <Flame className="w-5 h-5" />
                        <span className="font-bold text-lg">{userData.streak}</span>
                    </div>
                    <div className="flex items-center gap-2 text-violet-400">
                        <Star className="w-5 h-5" />
                        <span className="font-bold text-lg">Lvl {userData.level}</span>
                    </div>
                    <button onClick={handleSignOut} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

function WorkoutsPage({ activePlanName, onSelectPlan }) {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedExercise, setSelectedExercise] = useState(null);

    const filteredExercises = exerciseLibrary.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in space-y-12">
            <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><BookOpen /> Weekly Workout Plans</h2>
                <div className="space-y-4">
                    {workoutPlans.map(plan => (
                        <div key={plan.name} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                            <button onClick={() => setSelectedPlan(selectedPlan?.name === plan.name ? null : plan)} className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-700/50 transition-colors">
                                <div>
                                    <span className="text-xs font-semibold bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">{plan.category}</span>
                                    <h3 className="text-xl font-bold mt-2">{plan.name}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{plan.description}</p>
                                </div>
                                <ChevronDown className={`transform transition-transform text-gray-500 ${selectedPlan?.name === plan.name ? 'rotate-180' : ''}`} />
                            </button>
                            {selectedPlan?.name === plan.name && (
                                <div className="p-6 border-t border-gray-700 bg-gray-900/50">
                                    <div className="space-y-4 mb-6">
                                        {plan.week.map(dayInfo => (
                                            <div key={dayInfo.day}>
                                                <h4 className="font-bold text-lg text-cyan-400">{dayInfo.day}: <span className="text-white">{dayInfo.focus}</span></h4>
                                                {dayInfo.routine.length > 0 ? (
                                                    <ul className="mt-2 space-y-2 pl-4 border-l-2 border-gray-700">
                                                        {dayInfo.routine.map((item, index) => {
                                                            const exercise = exerciseLibrary.find(ex => ex.id === item.exerciseId);
                                                            if (!exercise) {
                                                              return <li key={index} className="text-red-500">Error: Exercise not found</li>;
                                                            }
                                                            return (
                                                                <li key={`${item.exerciseId}-${index}`} className="flex justify-between items-center text-sm p-2 bg-gray-800 rounded-md">
                                                                    <span>{exercise.name}</span>
                                                                    <span className="font-mono text-gray-300">{item.sets} x {item.reps}</span>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : (
                                                    <p className="pl-4 text-gray-500 italic text-sm mt-1">Rest Day</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => onSelectPlan(plan.name)}
                                        disabled={activePlanName === plan.name}
                                        className="w-full bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-cyan-500"
                                    >
                                        {activePlanName === plan.name ? 'This is your Active Plan' : 'Start this Plan'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                 <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><Dumbbell /> Exercise Guides</h2>
                 <div className="relative mb-6">
                    <input 
                        type="text"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800 p-4 pl-12 rounded-lg border-2 border-gray-700 focus:border-cyan-500 focus:outline-none focus:ring-0"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                 </div>
                 <div className="space-y-3">
                    {filteredExercises.map(ex => (
                         <div key={ex.id} className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            <button onClick={() => setSelectedExercise(selectedExercise?.id === ex.id ? null : ex)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700/50 transition-colors">
                                <div>
                                    <h4 className="font-bold text-lg">{ex.name}</h4>
                                    <p className="text-xs text-gray-400">{ex.muscleGroup} | {ex.equipment}</p>
                                </div>
                                <ChevronDown className={`transform transition-transform text-gray-500 ${selectedExercise?.id === ex.id ? 'rotate-180' : ''}`} />
                            </button>
                            {selectedExercise?.id === ex.id && (
                                <div className="p-4 md:p-6 border-t border-gray-700 bg-gray-900/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-800 rounded-lg overflow-hidden">
                                        <img 
                                            src={ex.imageUrl} 
                                            alt={`${ex.name} animation`} 
                                            className="w-full h-auto object-cover" 
                                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/27272a/E4E4E7?text=Visual+Guide'; }}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h5 className="font-bold text-cyan-400 mb-2">How To:</h5>
                                            <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                                                {ex.steps.map((step, i) => <li key={i}>{step}</li>)}
                                            </ol>
                                        </div>
                                         <div>
                                            <h5 className="font-bold text-amber-400 mb-2">Key Tips:</h5>
                                            <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                                {ex.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                         </div>
                    ))}
                 </div>
            </div>
        </div>
    );
}

function DashboardHeader({ name, onLogActivity, onUpdateName }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);
    useEffect(() => { setTempName(name); }, [name]);
    const handleSave = () => { onUpdateName(tempName); setIsEditing(false); };
    return (
        <div className="bg-gray-800 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} className="bg-gray-700 text-white text-2xl md:text-3xl font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                        <button onClick={handleSave} className="p-2 bg-green-500 rounded-lg hover:bg-green-400"><Check className="w-6 h-6"/></button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                         <h2 className="text-2xl md:text-3xl font-bold">Welcome back, {name}!</h2>
                         <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-cyan-400"><Pencil className="w-5 h-5"/></button>
                    </div>
                )}
                <p className="text-gray-400 mt-1">Ready to crush your goals today?</p>
            </div>
            <button onClick={onLogActivity} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20">
                <Plus className="w-5 h-5" />
                <span>Log Activity</span>
            </button>
        </div>
    );
}

function PersonalBestCard({ personalBests }) {
    return (
        <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Trophy className="text-amber-400" />Personal Bests</h3>
             <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    <span className="font-semibold">Longest Workout</span>
                </div>
                <span className="font-bold text-2xl text-cyan-400">{personalBests.longestDuration} min</span>
            </div>
        </div>
    );
}

function StatsCard({ userData, xpProgress, xpToNextLevel }) {
    return (
        <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-green-400" />Your Progress</h3>
            <div className="space-y-5">
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-violet-400">Level {userData.level}</span>
                        <span className="text-sm text-gray-400">{userData.xp} / {xpToNextLevel} XP</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-violet-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
                    </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                        <Flame className="w-6 h-6 text-amber-400" />
                        <span className="font-semibold">Current Streak</span>
                    </div>
                    <span className="font-bold text-2xl text-amber-400">{userData.streak} days</span>
                </div>
            </div>
        </div>
    );
}

function QuestsCard({ quests }) {
    return (
        <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="text-red-400" />Daily Quests</h3>
            <ul className="space-y-3">
                {quests.map(quest => {
                    const IconComponent = quest.icon;
                    return (
                        <li key={quest.id} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${quest.completed ? 'bg-green-500/20 text-gray-300' : 'bg-gray-700/50'}`}>
                            <div className={`p-2 rounded-full ${quest.completed ? 'bg-green-500' : 'bg-gray-600'}`}>
                                {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                            </div>
                            <span className={`flex-1 ${quest.completed ? 'line-through' : ''}`}>{quest.text}</span>
                            {quest.completed && <Award className="w-6 h-6 text-green-400" />}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

function ActivityFeed({ workouts }) {
    return (
        <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            {workouts.length > 0 ? (
                <ul className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {workouts.map(workout => (
                        <li key={workout.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between gap-4 animate-fade-in">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/20 rounded-lg">
                                    <Dumbbell className="w-6 h-6 text-cyan-400" />
                                </div>
                                <div>
                                    <p className="font-bold">{workout.type}</p>
                                    <p className="text-sm text-gray-400">
                                        {workout.timestamp?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{workout.duration} min</p>
                                <p className="text-sm text-green-400 font-medium">+{workout.xp} XP</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10">
                    <p className="text-gray-400">No activities logged yet.</p>
                    <p className="text-gray-500 text-sm">Time to get moving!</p>
                </div>
            )}
        </div>
    );
}

const activityTypes = [
    { name: 'Running', icon: Footprints, avgXp: 50 },
    { name: 'Weightlifting', icon: Dumbbell, avgXp: 40 },
    { name: 'Yoga', icon: Zap, avgXp: 25 },
    { name: 'Cycling', icon: Zap, avgXp: 45 },
    { name: 'Swimming', icon: Zap, avgXp: 55 },
    { name: 'Walking', icon: Footprints, avgXp: 20 },
];

function LogActivityModal({ onClose, onLog, error }) {
    const [activityType, setActivityType] = useState(activityTypes[0].name);
    const [duration, setDuration] = useState(30);

    const handleSubmit = (e) => {
        e.preventDefault();
        onLog({
            type: activityType,
            duration: Number(duration)
        });
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl transform animate-scale-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Log an Activity</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="activityType" className="block text-sm font-medium text-gray-400 mb-2">Activity Type</label>
                        <select
                            id="activityType"
                            value={activityType}
                            onChange={(e) => setActivityType(e.target.value)}
                            className="w-full bg-gray-700 text-white p-3 rounded-lg border-2 border-transparent focus:border-cyan-500 focus:ring-0 transition"
                        >
                            {activityTypes.map(type => <option key={type.name} value={type.name}>{type.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-2">Duration (minutes)</label>
                        <input
                            type="number"
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(Math.max(1, e.target.value))}
                            min="1"
                            className="w-full bg-gray-700 text-white p-3 rounded-lg border-2 border-transparent focus:border-cyan-500 focus:ring-0 transition"
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                        >
                            <Award className="w-5 h-5" />
                            <span>Add to Log (+{Math.ceil((activityTypes.find(a => a.name === activityType)?.avgXp || 30) * (Math.min(duration, 240) / 30))} XP)</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Minimal CSS for animations (Tailwind handles the rest)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    
    @keyframes fadeInFast { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in-fast { animation: fadeInFast 0.3s ease-out forwards; }

    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }

    /* Custom scrollbar for activity feed */
    .overflow-y-auto::-webkit-scrollbar { width: 8px; }
    .overflow-y-auto::-webkit-scrollbar-track { background: #1f2937; /* gray-800 */ }
    .overflow-y-auto::-webkit-scrollbar-thumb { background: #374151; /* gray-700 */ border-radius: 4px; }
    .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #4b5563; /* gray-600 */ }
`;
document.head.appendChild(style);
