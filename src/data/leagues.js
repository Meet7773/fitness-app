import { Flame, Dumbbell, Zap, Award, Star, Trophy, Shield } from 'lucide-react';

export const leagues = [
    { name: 'Iron Division', threshold: 0, Icon: Dumbbell, color: 'text-gray-300', bg: 'bg-gray-800', border: 'border-gray-400', glow: 'shadow-[0_0_20px_2px_rgba(156,163,175,0.7)]' },
    { name: 'Steel Division', threshold: 1000, Icon: Flame, color: 'text-blue-400', bg: 'bg-blue-900', border: 'border-blue-400', glow: 'shadow-[0_0_20px_2px_rgba(96,165,250,0.7)]' },
    { name: 'Bronze Division', threshold: 5000, Icon: Award, color: 'text-amber-500', bg: 'bg-amber-900', border: 'border-amber-500', glow: 'shadow-[0_0_20px_2px_rgba(245,158,11,0.7)]' },
    { name: 'Silver Division', threshold: 15000, Icon: Star, color: 'text-slate-100', bg: 'bg-slate-700', border: 'border-slate-100', glow: 'shadow-[0_0_20px_2px_rgba(241,245,249,0.7)]' },
    { name: 'Gold Division', threshold: 30000, Icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-900', border: 'border-yellow-400', glow: 'shadow-[0_0_20px_2px_rgba(250,204,21,0.7)]' },
    { name: 'Titan Division', threshold: 75000, Icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-900', border: 'border-cyan-400', glow: 'shadow-[0_0_20px_2px_rgba(34,211,238,0.7)]' },
    { name: 'Olympian Division', threshold: 150000, Icon: Shield, color: 'text-violet-400', bg: 'bg-violet-900', border: 'border-violet-400', glow: 'shadow-[0_0_20px_2px_rgba(167,139,250,0.7)]' }
];

export const getLeagueForXp = (xp) => {
    let currentLeague = leagues[0];
    for (const league of leagues) {
        if (xp >= league.threshold) {
            currentLeague = league;
        } else {
            break;
        }
    }
    return currentLeague;
};
