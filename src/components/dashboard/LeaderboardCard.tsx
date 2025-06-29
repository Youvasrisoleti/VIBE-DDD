import React from 'react';
import { Trophy, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';

interface LeaderboardCardProps {
  leaders: Array<{
    id: number;
    name: string;
    avatar: string;
    score: number;
    rank: number;
  }>;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ leaders }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm h-full`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Leaderboard
        </h2>
        <Users className="text-indigo-500" size={20} />
      </div>
      
      <div className="space-y-4">
        {leaders.map((leader) => (
          <div 
            key={leader.id} 
            className={`flex items-center p-3 rounded-lg ${
              leader.rank === 1
                ? 'bg-amber-50 dark:bg-amber-900/30'
                : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            } transition-colors`}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300">
              {leader.rank}
            </div>
            
            <div className="ml-3 flex-1 flex items-center">
              <Avatar src={leader.avatar} alt={leader.name} size="sm" />
              <span className={`ml-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {leader.name}
              </span>
            </div>
            
            <div className="flex items-center">
              {leader.rank === 1 && <Trophy className="mr-1 text-amber-500\" size={14} />}
              <span className={`text-sm font-semibold ${
                leader.rank === 1
                  ? 'text-amber-600 dark:text-amber-400'
                  : darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {leader.score}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
        View Full Leaderboard
      </button>
    </div>
  );
};

export default LeaderboardCard;