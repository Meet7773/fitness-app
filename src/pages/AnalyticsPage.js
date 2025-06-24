import React, { useState, useMemo } from 'react';
import { BarChart3, Clock, TrendingUp, Target, Trophy, Dumbbell } from 'lucide-react';

export default function AnalyticsPage({ workouts }) {
    const [timeRange, setTimeRange] = useState('week');
    const [selectedExercise, setSelectedExercise] = useState(null);

    // Calculate analytics data
    const analyticsData = useMemo(() => {
        if (!Array.isArray(workouts) || workouts.length === 0) return {
            weeklyData: [],
            monthlyData: [],
            exerciseStats: {},
            personalRecords: {},
            consistency: 0,
            goalCompletion: 0,
            totalWorkouts: 0,
            totalDuration: 0,
            averageDuration: 0
        };

        const now = new Date();

        // Weekly data (last 7 days)
        const weeklyData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayWorkouts = workouts.filter(w => {
                const workoutDate = w.timestamp?.toDate();
                return workoutDate && workoutDate.toDateString() === date.toDateString();
            });
            weeklyData.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                workouts: dayWorkouts.length,
                duration: dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
                xp: dayWorkouts.reduce((sum, w) => sum + (w.xp || 0), 0)
            });
        }

        // Monthly data (last 30 days)
        const monthlyData = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayWorkouts = workouts.filter(w => {
                const workoutDate = w.timestamp?.toDate();
                return workoutDate && workoutDate.toDateString() === date.toDateString();
            });
            monthlyData.push({
                date: date.getDate(),
                workouts: dayWorkouts.length,
                duration: dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
                xp: dayWorkouts.reduce((sum, w) => sum + (w.xp || 0), 0)
            });
        }

        // Exercise statistics
        const exerciseStats = {};
        workouts.forEach(workout => {
            if (!exerciseStats[workout.type]) {
                exerciseStats[workout.type] = {
                    count: 0,
                    totalDuration: 0,
                    totalXp: 0,
                    averageDuration: 0
                };
            }
            exerciseStats[workout.type].count++;
            exerciseStats[workout.type].totalDuration += workout.duration || 0;
            exerciseStats[workout.type].totalXp += workout.xp || 0;
        });
        Object.keys(exerciseStats).forEach(type => {
            exerciseStats[type].averageDuration = Math.round(exerciseStats[type].totalDuration / exerciseStats[type].count);
        });

        // Personal records
        const personalRecords = {
            longestWorkout: Math.max(...workouts.map(w => w.duration || 0), 0),
            mostXpInDay: Math.max(...weeklyData.map(d => d.xp), 0),
            totalWorkouts: workouts.length,
            totalXp: workouts.reduce((sum, w) => sum + (w.xp || 0), 0),
            averageWorkoutDuration: workouts.length > 0 ? Math.round(workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length) : 0
        };

        // Consistency (percentage of days with workouts in last 30 days)
        const daysWithWorkouts = monthlyData.filter(d => d.workouts > 0).length;
        const consistency = Math.round((daysWithWorkouts / 30) * 100);

        // Goal completion (assuming goal is 3 workouts per week)
        const recentWeekWorkouts = weeklyData.reduce((sum, d) => sum + d.workouts, 0);
        const goalCompletion = Math.min(Math.round((recentWeekWorkouts / 3) * 100), 100);

        return {
            weeklyData,
            monthlyData,
            exerciseStats,
            personalRecords,
            consistency,
            goalCompletion,
            totalWorkouts: workouts.length,
            totalDuration: workouts.reduce((sum, w) => sum + (w.duration || 0), 0),
            averageDuration: workouts.length > 0 ? Math.round(workouts.reduce((sum, w) => sum + (w.duration || 0), 0) / workouts.length) : 0
        };
    }, [workouts]);

    const currentData = timeRange === 'week' ? analyticsData.weeklyData : analyticsData.monthlyData;

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="bg-gray-800 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <BarChart3 className="text-cyan-400" />
                        Analytics Dashboard
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTimeRange('week')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                timeRange === 'week' 
                                    ? 'bg-cyan-500 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setTimeRange('month')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                timeRange === 'month' 
                                    ? 'bg-cyan-500 text-white' 
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Month
                        </button>
                    </div>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Dumbbell className="w-6 h-6 text-cyan-400" />
                        <span className="text-gray-400 text-sm">Total Workouts</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{analyticsData.totalWorkouts}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-6 h-6 text-green-400" />
                        <span className="text-gray-400 text-sm">Total Duration</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{analyticsData.totalDuration} min</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-violet-400" />
                        <span className="text-gray-400 text-sm">Consistency</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{analyticsData.consistency}%</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="w-6 h-6 text-amber-400" />
                        <span className="text-gray-400 text-sm">Goal Completion</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{analyticsData.goalCompletion}%</p>
                </div>
            </div>

            {/* Progress Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Workouts Chart */}
                <div className="bg-gray-800 p-6 rounded-xl w-full">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 whitespace-nowrap">
                        <BarChart3 className="text-cyan-400" />
                        Workouts per Day
                    </h3>
                    <div className="h-64">
                        {timeRange === 'month' ? (
                            <div className="overflow-x-auto md:overflow-x-visible w-full">
                                <div className="flex items-end gap-2 min-w-[1200px] md:min-w-0 h-full">
                                    {currentData.map((day, index) => (
                                        <div key={index} className="w-8 flex flex-col items-center">
                                            <div className="w-full bg-gray-700 rounded-t-sm relative group">
                                                <div 
                                                    className="bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm transition-all duration-300 hover:from-cyan-400 hover:to-cyan-300"
                                                    style={{ height: `${Math.max((day.workouts / Math.max(...currentData.map(d => d.workouts) || [1])) * 200, 4)}px` }}
                                                ></div>
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {day.workouts} workout{day.workouts !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 mt-2">{day.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-end justify-between gap-1 h-full">
                                {currentData.map((day, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full bg-gray-700 rounded-t-sm relative group">
                                            <div 
                                                className="bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-sm transition-all duration-300 hover:from-cyan-400 hover:to-cyan-300"
                                                style={{ height: `${Math.max((day.workouts / Math.max(...currentData.map(d => d.workouts) || [1])) * 200, 4)}px` }}
                                            ></div>
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {day.workouts} workout{day.workouts !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-2">{day.date}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Duration Chart */}
                <div className="bg-gray-800 p-6 rounded-xl w-full">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2 whitespace-nowrap">
                        <Clock className="text-green-400" />
                        Duration per Day
                    </h3>
                    <div className="h-64">
                        {timeRange === 'month' ? (
                            <div className="overflow-x-auto md:overflow-x-visible w-full">
                                <div className="flex items-end gap-2 min-w-[1200px] md:min-w-0 h-full">
                                    {currentData.map((day, index) => (
                                        <div key={index} className="w-8 flex flex-col items-center">
                                            <div className="w-full bg-gray-700 rounded-t-sm relative group">
                                                <div 
                                                    className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-300 hover:from-green-400 hover:to-green-300"
                                                    style={{ height: `${Math.max((day.duration / Math.max(...currentData.map(d => d.duration) || [1])) * 200, 4)}px` }}
                                                ></div>
                                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {day.duration} min
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 mt-2">{day.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-end justify-between gap-1 h-full">
                                {currentData.map((day, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div className="w-full bg-gray-700 rounded-t-sm relative group">
                                            <div 
                                                className="bg-gradient-to-t from-green-500 to-green-400 rounded-t-sm transition-all duration-300 hover:from-green-400 hover:to-green-300"
                                                style={{ height: `${Math.max((day.duration / Math.max(...currentData.map(d => d.duration) || [1])) * 200, 4)}px` }}
                                            ></div>
                                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {day.duration} min
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 mt-2">{day.date}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Personal Records */}
            <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Trophy className="text-amber-400" />
                    Personal Records
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-gray-400 text-sm mb-1">Longest Workout</p>
                        <p className="text-2xl font-bold text-cyan-400">{analyticsData.personalRecords.longestWorkout} min</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-gray-400 text-sm mb-1">Most XP in a Day</p>
                        <p className="text-2xl font-bold text-violet-400">{analyticsData.personalRecords.mostXpInDay} XP</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-gray-400 text-sm mb-1">Total XP Earned</p>
                        <p className="text-2xl font-bold text-green-400">{analyticsData.personalRecords.totalXp?.toLocaleString() || 0} XP</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg text-center">
                        <p className="text-gray-400 text-sm mb-1">Avg Workout Duration</p>
                        <p className="text-2xl font-bold text-amber-400">{analyticsData.personalRecords.averageWorkoutDuration} min</p>
                    </div>
                </div>
            </div>

            {/* Exercise Performance */}
            <div className="bg-gray-800 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Dumbbell className="text-red-400" />
                    Exercise Performance
                </h3>
                <div className="space-y-4">
                    {Object.entries(analyticsData.exerciseStats)
                        .sort(([,a], [,b]) => b.count - a.count)
                        .map(([exerciseType, stats]) => (
                            <div key={exerciseType} className="bg-gray-700/50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-lg">{exerciseType}</h4>
                                    <button
                                        onClick={() => setSelectedExercise(selectedExercise === exerciseType ? null : exerciseType)}
                                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                                    >
                                        {selectedExercise === exerciseType ? 'Hide Details' : 'Show Details'}
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-gray-400 text-sm">Workouts</p>
                                        <p className="text-xl font-bold text-white">{stats.count}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Avg Duration</p>
                                        <p className="text-xl font-bold text-green-400">{stats.averageDuration} min</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Total XP</p>
                                        <p className="text-xl font-bold text-violet-400">{stats.totalXp}</p>
                                    </div>
                                </div>
                                {selectedExercise === exerciseType && (
                                    <div className="mt-4 pt-4 border-t border-gray-600">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Total Duration</p>
                                                <p className="text-lg font-semibold text-white">{stats.totalDuration} min</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">XP per Workout</p>
                                                <p className="text-lg font-semibold text-cyan-400">{Math.round(stats.totalXp / stats.count)} XP</p>
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
