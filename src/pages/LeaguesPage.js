import React, { useEffect, useRef } from 'react';
import { Dumbbell, Flame, Award, Star, Trophy, Zap, Shield, Users } from 'lucide-react';
import { leagues, getLeagueForXp } from '../data/leagues';

// Import all the necessary sub-components for the dashboard
import DashboardHeader from '../components/DashboardHeader';
import TodaysWorkoutCard from '../components/TodaysWorkoutCard';
import StatsCard from '../components/StatsCard';
import QuestsCard from '../components/QuestsCard';
import ActivityFeed from '../components/ActivityFeed';

// Import the data needed by child components
import { exerciseLibrary } from '../data/exerciseLibrary';
import { workoutPlans } from '../data/workoutPlans';

export default function LeaguesPage({ currentUserId, userData, leagueRoster }) {
    const myLeague = getLeagueForXp(userData.xp);
    const nextLeague = leagues.find(l => l.threshold > myLeague.threshold);
    const xpForNextLeague = nextLeague ? nextLeague.threshold - myLeague.threshold : 0;
    const xpInCurrentLeague = userData.xp - myLeague.threshold;
    const progressToNext = nextLeague ? (xpInCurrentLeague / xpForNextLeague) * 100 : 100;

    // Glow animation on league change
    const cardRef = useRef();
    const prevLeague = useRef(myLeague.name);
    useEffect(() => {
        if (prevLeague.current !== myLeague.name && cardRef.current) {
            cardRef.current.classList.add('animate-league-glow');
            setTimeout(() => {
                cardRef.current.classList.remove('animate-league-glow');
            }, 1200);
            prevLeague.current = myLeague.name;
        }
    }, [myLeague.name]);

    return (
        <div className="animate-fade-in space-y-8">
            {/* My League Card */}
            <div
                ref={cardRef}
                className={`rounded-2xl p-6 border-t-4 ${myLeague.bg} ${myLeague.border} ${myLeague.glow}`}
                style={{ borderTopWidth: '6px' }}
            >
                <div className="flex items-center gap-4 mb-4">
                    <myLeague.Icon className={`w-12 h-12 ${myLeague.color}`} />
                    <div>
                        <h2 className="text-3xl font-bold">{myLeague.name}</h2>
                        <p className="text-gray-400">Your current division</p>
                    </div>
                </div>
                {nextLeague ? (
                    <div>
                        <div className="flex justify-between items-baseline mb-1 text-sm">
                            <span className="font-bold text-gray-300">Progress to {nextLeague.name}</span>
                            <span className="text-gray-400">{xpInCurrentLeague.toLocaleString()} / {xpForNextLeague.toLocaleString()} XP</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-4">
                            <div className={`bg-gradient-to-r from-cyan-500 to-violet-500 h-4 rounded-full transition-all duration-500`} style={{ width: `${progressToNext}%` }}></div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center font-bold text-lg text-amber-400">You are in the highest league!</p>
                )}
            </div>

            {/* League Roster */}
            <div>
                 <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><Users /> {myLeague.name} Roster</h3>
                 <div className="bg-gray-800 rounded-xl overflow-hidden">
                    <ul className="divide-y divide-gray-700">
                        {leagueRoster.map((user, index) => (
                            <li key={user.id} className={`flex items-center p-4 gap-4 ${user.id === currentUserId ? 'bg-cyan-500/10' : ''}`}>
                                <span className="text-lg font-bold text-gray-400 w-8 text-center">{index + 1}</span>
                                <Users className="w-10 h-10 text-gray-500"/>
                                <div className="flex-1">
                                    <p className={`font-bold ${user.id === currentUserId ? 'text-cyan-400' : 'text-white'}`}>{user.name}</p>
                                    <p className="text-xs text-gray-400">Level {user.level} - {user.xp.toLocaleString()} XP</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                 </div>
            </div>

             {/* All Leagues */}
             <div>
                <h3 className="text-2xl font-bold mb-4">All Leagues</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leagues.map(league => (
                        <div key={league.name} className={`p-4 rounded-lg flex items-center gap-4 ${league.name === myLeague.name ? 'bg-gray-700' : 'bg-gray-800'}`}>
                            <league.Icon className={`w-8 h-8 ${league.color}`} />
                            <div>
                                <p className="font-bold">{league.name}</p>
                                <p className="text-xs text-gray-400">Requires {league.threshold.toLocaleString()} XP</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Add animation CSS
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes league-glow {
        0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.0); }
        20% { box-shadow: 0 0 30px 10px rgba(255,255,255,0.5); }
        100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.0); }
    }
    .animate-league-glow {
        animation: league-glow 1.2s cubic-bezier(0.4,0,0.2,1);
    }
    `;
    document.head.appendChild(style);
}
