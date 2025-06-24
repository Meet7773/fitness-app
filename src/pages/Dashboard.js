import React from 'react';

// Import all the necessary sub-components for the dashboard
import DashboardHeader from '../components/DashboardHeader';
import TodaysWorkoutCard from '../components/TodaysWorkoutCard';
import StatsCard from '../components/StatsCard';
import QuestsCard from '../components/QuestsCard';
import ActivityFeed from '../components/ActivityFeed';

// Import the data needed by child components
import { exerciseLibrary } from '../data/exerciseLibrary';
import { workoutPlans } from '../data/workoutPlans';

export default function Dashboard({
    userData,
    xpProgress,
    xpToNextLevel,
    quests,
    workouts,
    dailyCompletion,
    onMarkDone,
    setIsLogModalOpen,
    onUpdateName
}) {
    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <DashboardHeader 
                name={userData.name} 
                league={userData.league} 
                onLogActivity={() => setIsLogModalOpen(true)} 
                onUpdateName={onUpdateName} 
            />
            <TodaysWorkoutCard 
                activePlanName={userData.activePlan} 
                dailyCompletion={dailyCompletion} 
                onMarkDone={onMarkDone}
                workoutPlans={workoutPlans}
                exerciseLibrary={exerciseLibrary}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <StatsCard 
                    userData={userData} 
                    xpProgress={xpProgress} 
                    xpToNextLevel={xpToNextLevel} 
                />
                <QuestsCard quests={quests} />
            </div>
            <ActivityFeed workouts={workouts} />
        </div>
    );
}
