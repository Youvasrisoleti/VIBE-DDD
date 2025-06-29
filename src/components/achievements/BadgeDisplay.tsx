import React from 'react';
import { Trophy, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface BadgeDisplayProps {
  achievement: {
    id: number;
    title: string;
    description: string;
    icon: string;
    category: string;
    earned: boolean;
    earnedAt?: string;
    progress?: number;
    requiredProgress?: number;
  };
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ achievement }) => {
  const { darkMode } = useTheme();
  
  const progressPercentage = achievement.progress && achievement.requiredProgress
    ? Math.min(100, Math.round((achievement.progress / achievement.requiredProgress) * 100))
    : 0;
  
  return (
    <div 
      className={`p-6 rounded-xl ${
        achievement.earned
          ? darkMode ? 'bg-indigo-900/20 border border-indigo-800' : 'bg-indigo-50 border border-indigo-100'
          : darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
      } transition-all duration-300 hover:shadow-md ${achievement.earned ? 'hover:transform hover:scale-105' : ''}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          achievement.earned
            ? 'bg-indigo-100 dark:bg-indigo-900/50'
            : 'bg-gray-100 dark:bg-gray-700'
        }`}>
          {achievement.earned ? (
            <Trophy className="text-indigo-600 dark:text-indigo-400\" size={32} />
          ) : (
            <Lock className="text-gray-400 dark:text-gray-500" size={24} />
          )}
        </div>
        
        <h3 className={`mt-4 font-medium ${
          achievement.earned
            ? 'text-indigo-700 dark:text-indigo-300'
            : darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {achievement.title}
        </h3>
        
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {achievement.description}
        </p>
        
        {achievement.earned ? (
          <div className="mt-4 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
            Earned {achievement.earnedAt}
          </div>
        ) : (
          achievement.progress !== undefined && achievement.requiredProgress !== undefined ? (
            <div className="mt-4 w-full">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                <span className="text-gray-700 dark:text-gray-300">{achievement.progress}/{achievement.requiredProgress}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="mt-4 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              Locked
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BadgeDisplay;