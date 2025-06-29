import React from 'react';
import { Flame, Calendar, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StreakCardProps {
  streak: number;
  longestStreak: number;
  weeklyActivity: number[];
}

const StreakCard: React.FC<StreakCardProps> = ({ streak, longestStreak, weeklyActivity }) => {
  const { darkMode } = useTheme();
  
  const maxActivity = Math.max(...weeklyActivity);
  
  return (
    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Current Streak
        </h2>
        <Flame className="text-orange-500" size={20} />
      </div>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900">
            <Flame className="text-orange-500" size={32} />
          </div>
          <div className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold">
            {streak}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center">
          <Award className="text-amber-500 mr-2" size={16} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Longest: {longestStreak} days
          </span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="text-indigo-500 mr-2" size={16} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            This week
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between space-x-1">
        {weeklyActivity.map((activity, index) => {
          const dayOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index];
          const intensity = activity === 0 ? 0 : Math.ceil((activity / maxActivity) * 4);
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-8 h-12 rounded-md ${
                  intensity === 0 
                    ? darkMode ? 'bg-gray-700' : 'bg-gray-100' 
                    : intensity === 1
                      ? 'bg-green-100 dark:bg-green-900'
                      : intensity === 2
                        ? 'bg-green-200 dark:bg-green-800'
                        : intensity === 3
                          ? 'bg-green-300 dark:bg-green-700'
                          : 'bg-green-500 dark:bg-green-600'
                }`}
              ></div>
              <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{dayOfWeek}</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 px-4 py-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
        <div className="flex items-center">
          <Flame className="text-orange-500 mr-2 flex-shrink-0" size={16} />
          <p className="text-sm text-orange-800 dark:text-orange-300">
            Keep your streak going! Log in tomorrow to continue your learning journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakCard;