import React from 'react';
import { Target, Award } from 'lucide-react';

export default function QuestsCard({ quests }) {
    if (!Array.isArray(quests)) {
        return null;
    }

    return (
        <div className="bg-gray-800 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Target className="text-red-400" />Daily Quests</h3>
            <ul className="space-y-3">
                {quests.map(quest => {
                    const IconComponent = quest.icon;
                    return (
                        <li key={quest.id} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${quest.completed ? 'bg-green-500/20 text-gray-300' : 'bg-gray-700/50'}`}>
                            <div className={`p-2 rounded-full ${quest.completed ? 'bg-green-500' : 'bg-gray-600'}`}>
                                {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                            </div>
                            <span className={`flex-1 ${quest.completed ? 'line-through' : ''}`}>{quest.text}</span>
                            {quest.completed && <Award className="w-6 h-6 text-green-400" />}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}
