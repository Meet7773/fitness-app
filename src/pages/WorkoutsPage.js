import React, { useState } from 'react';
import { workoutPlans } from '../data/workoutPlans';
import { exerciseLibrary } from '../data/exerciseLibrary';
import { BookOpen, ChevronDown, Dumbbell, Search } from 'lucide-react';

export default function WorkoutsPage({ activePlanName, onSelectPlan }) {
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
