import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface ProgressChartProps {
  data: Array<{
    date: string;
    problems: number;
    timeSpent: number;
  }>;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const { darkMode } = useTheme();
  
  const [activeDataKey, setActiveDataKey] = React.useState('problems');
  
  return (
    <div>
      <div className="flex items-center justify-start mb-4 space-x-4">
        <button
          onClick={() => setActiveDataKey('problems')}
          className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${
            activeDataKey === 'problems' 
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
          Problems Solved
        </button>
        
        <button
          onClick={() => setActiveDataKey('timeSpent')}
          className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${
            activeDataKey === 'timeSpent' 
              ? 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300' 
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-teal-500 mr-2"></span>
          Time Spent (min)
        </button>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            stroke={darkMode ? '#9ca3af' : '#6b7280'} 
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            stroke={darkMode ? '#9ca3af' : '#6b7280'} 
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              borderColor: darkMode ? '#374151' : '#e5e7eb',
              color: darkMode ? '#f9fafb' : '#111827',
            }}
          />
          {activeDataKey === 'problems' && (
            <Line
              type="monotone"
              dataKey="problems"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }}
            />
          )}
          {activeDataKey === 'timeSpent' && (
            <Line
              type="monotone"
              dataKey="timeSpent"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#14b8a6', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#0d9488', strokeWidth: 0 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;