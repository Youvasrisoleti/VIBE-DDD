import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, isPositive, icon }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-transform duration-200 hover:transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {title}
        </span>
        <div className="flex-shrink-0">
          {icon}
        </div>
      </div>
      
      <div className="mt-2">
        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </h3>
        
        <div className="mt-1 flex items-center">
          <span className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {change}
          </span>
          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
            vs. last period
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;