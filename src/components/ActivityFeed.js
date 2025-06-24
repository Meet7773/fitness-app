import React from 'react';
import { Dumbbell } from 'lucide-react';

export default function ActivityFeed({ workouts }) {
    if (!Array.isArray(workouts)) {
        return null;
    }

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
