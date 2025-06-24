import React, { useState } from 'react';
import { Flame, Star, LogOut, Menu, Zap, UserCircle } from 'lucide-react';

const leagueColors = {
    'Iron Division': 'text-gray-400',
    'Bronze Division': 'text-amber-500',
    'Silver Division': 'text-slate-300',
    'Gold Division': 'text-yellow-400',
    'Platinum Division': 'text-cyan-400',
    'Diamond Division': 'text-blue-400',
    'Champion Division': 'text-violet-400',
};

export default function Header({ userData, setCurrentView, currentView, onSignOut }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    if (!userData) {
        return null;
    }
    const handleSignOut = () => {
        if (onSignOut) onSignOut();
    };
    
    const NavLink = ({ viewName, children, isMobile = false }) => (
        <button 
            onClick={() => {
                setCurrentView(viewName);
                if (isMobile) setIsMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-md font-semibold transition-colors ${currentView === viewName ? 'bg-cyan-500 text-white' : 'hover:bg-gray-700'}`}
        >
            {children}
        </button>
    );

    return (
        <header className="bg-gray-800/80 backdrop-blur-sm sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center gap-2">
                             <Zap className="w-8 h-8 text-cyan-400 animate-breath" />
                             <span className="text-xl font-bold text-white tracking-tight">FitQuest</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-2 ml-10">
                            <NavLink viewName="dashboard">Dashboard</NavLink>
                            <NavLink viewName="workouts">Workouts</NavLink>
                            <NavLink viewName="leagues">Leagues</NavLink>
                            <NavLink viewName="analytics">Analytics</NavLink>
                            <NavLink viewName="calculators">Calculators</NavLink>
                        </nav>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className={`font-bold text-lg ${leagueColors[userData.league] || 'text-white'}`}>{userData.name}</div>
                        <div className="flex items-center gap-2 text-amber-400">
                            <Flame className="w-5 h-5" />
                            <span className="font-bold text-lg">{userData.streak}</span>
                        </div>
                        <div className="flex items-center gap-2 text-violet-400">
                            <Star className="w-5 h-5" />
                            <span className="font-bold text-lg">Lvl {userData.level}</span>
                        </div>
                        <button onClick={handleSignOut} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors p-2 rounded-md">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700">
                            <Menu className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         <NavLink viewName="dashboard" isMobile>Dashboard</NavLink>
                         <NavLink viewName="workouts" isMobile>Workouts</NavLink>
                         <NavLink viewName="leagues" isMobile>Leagues</NavLink>
                         <NavLink viewName="analytics" isMobile>Analytics</NavLink>
                         <NavLink viewName="calculators" isMobile>Calculators</NavLink>
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        <div className="flex items-center px-5">
                            <UserCircle className="w-10 h-10 text-gray-400"/>
                            <div className="ml-3">
                                <div className={`text-base font-medium leading-none ${leagueColors[userData.league] || 'text-white'} font-bold`}>{userData.name}</div>
                                <div className="text-sm font-medium leading-none text-gray-400">Level {userData.level}</div>
                            </div>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <button onClick={handleSignOut} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

if (!document.getElementById('fitquest-breath-style')) {
    const style = document.createElement('style');
    style.id = 'fitquest-breath-style';
    style.textContent = `
        @keyframes breath {
            0% { filter: drop-shadow(0 0 0 #22d3ee); opacity: 0.8; }
            50% { filter: drop-shadow(0 0 16px #22d3ee); opacity: 1; }
            100% { filter: drop-shadow(0 0 0 #22d3ee); opacity: 0.8; }
        }
        .animate-breath {
            animation: breath 2.2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}
