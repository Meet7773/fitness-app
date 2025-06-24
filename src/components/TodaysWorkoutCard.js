import React from 'react';
import { CalendarCheck2, Check } from 'lucide-react';

// This component assumes it receives the full exerciseLibrary and workoutPlans as props.
// In a real-world app, you might use React Context or a state management library
// to provide this data without passing it down through every component.
export default function TodaysWorkoutCard({ activePlanName, dailyCompletion, onMarkDone, exerciseLibrary, workoutPlans }) {
    console.log('TodaysWorkoutCard:', { activePlanName, dailyCompletion, exerciseLibrary, workoutPlans });
    exerciseLibrary = Array.isArray(exerciseLibrary) ? exerciseLibrary : [];
    workoutPlans = Array.isArray(workoutPlans) ? workoutPlans : [];
    if (!activePlanName || !workoutPlans) {
        return <div>Loading...</div>;
    }

    if (!activePlanName) {
        return (
            <div className="bg-cyan-900/50 border-2 border-dashed border-cyan-700 p-8 rounded-xl text-center">
                <h3 className="text-2xl font-bold text-white mb-2">No Active Plan</h3>
                <p className="text-cyan-200">Go to the "Workouts" page to select a plan and see your daily workout here!</p>
            </div>
        )
    }

    const plan = workoutPlans.find(p => p.name === activePlanName);
    console.log('Selected plan:', plan);
    if (!plan) return <div className="bg-gray-800 p-6 rounded-xl"><p>Plan not found. Please select a new one.</p></div>;

    const dayOfWeek = new Date().toLocaleString('en-us', {  weekday: 'long' });
    const todaysRoutine = plan.week.find(d => d.day === dayOfWeek);
    console.log('Today\'s routine:', todaysRoutine);
    
    if (!todaysRoutine || !Array.isArray(todaysRoutine.routine)) {
        return <div>Loading...</div>;
    }

    return (
         <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarCheck2 className="text-cyan-400" /> Today's Workout: <span className="text-cyan-400">{todaysRoutine.focus}</span></h3>
            <p className="text-sm text-gray-400 mb-4">From your plan: <span className="font-semibold">{activePlanName}</span></p>
             {todaysRoutine.routine.length > 0 ? (
                <ul className="space-y-2">
                    {todaysRoutine.routine.map((item, index) => {
                        const exercise = exerciseLibrary.find(ex => ex.id === item.exerciseId);
                        if (!exercise) {
                            console.warn('Exercise not found in library:', item.exerciseId);
                            return (
                                <li key={index} className="flex justify-between items-center text-sm p-3 bg-gray-700/50 rounded-md">
                                    <div>
                                        <span>Unknown Exercise</span>
                                        <span className="font-mono text-gray-400 ml-2">{item.sets} x {item.reps}</span>
                                    </div>
                                    <button disabled className="px-3 py-1 text-xs font-bold rounded-full bg-gray-500 text-white cursor-not-allowed">N/A</button>
                                </li>
                            );
                        }
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
