import React from 'react';
import { Flame, Star, TrendingUp } from 'lucide-react';

export default function StatsCard({ userData, xpProgress, xpToNextLevel }) {
    if (!userData) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><TrendingUp className="text-green-400" />Your Progress</h3>
            <div className="space-y-5">
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-violet-400">Level {userData.level}</span>
                        <span className="text-sm text-gray-400">{userData.xpInLevel || 0} / {userData.xpToNextLevel || 100} XP</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-violet-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${userData.xpProgress || 0}%` }}></div>
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
