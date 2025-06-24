import React, { useState } from 'react';
import { Flame, Dumbbell, Zap, Footprints, Award, X } from 'lucide-react';

export default function LogActivityModal({ activityTypes, onClose, onLog, error }) {
    const [activityType, setActivityType] = useState(Array.isArray(activityTypes) && activityTypes.length > 0 ? activityTypes[0].name : '');
    const [duration, setDuration] = useState(30);
    if (!Array.isArray(activityTypes) || activityTypes.length === 0) {
        return null;
    }

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
