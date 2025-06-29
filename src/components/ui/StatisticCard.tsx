import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface StatisticCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const StatisticCard: React.FC<StatisticCardProps> = ({ icon, label, value }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticCard;