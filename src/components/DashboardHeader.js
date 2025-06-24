import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Check, Zap } from 'lucide-react';
import { leagues } from '../data/leagues';

export default function DashboardHeader({ name, league, onLogActivity, onUpdateName }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(name);

    useEffect(() => {
        setTempName(name);
    }, [name]);

    // Get the vibrant color class from leagues data
    const leagueObj = leagues.find(l => l.name === league);
    const colorClass = leagueObj ? leagueObj.color : 'text-white';

    const handleSave = () => {
        onUpdateName(tempName);
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            value={tempName} 
                            onChange={(e) => setTempName(e.target.value)} 
                            className="bg-gray-700 text-white text-2xl md:text-3xl font-bold p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button onClick={handleSave} className="p-2 bg-green-500 rounded-lg hover:bg-green-400">
                            <Check className="w-6 h-6"/>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Zap className="w-7 h-7 animate-breath text-cyan-400" />
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Welcome back, <span className={`${colorClass}`}>{name}</span> <span className="ml-2 text-xs font-semibold px-2 py-1 rounded bg-gray-700/50 text-white">{league || 'No League'}</span>
                        </h2>
                        <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-cyan-400">
                            <Pencil className="w-5 h-5"/>
                        </button>
                    </div>
                )}
                <p className="text-gray-400 mt-1">Ready to crush your goals today?</p>
            </div>
            <button 
                onClick={onLogActivity} 
                className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
                <Plus className="w-5 h-5" />
                <span>Log Activity</span>
            </button>
        </div>
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
