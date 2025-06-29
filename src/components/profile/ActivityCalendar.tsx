import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ActivityCalendarProps {
  activityData: Array<{
    date: string;
    count: number;
  }>;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({ activityData }) => {
  const { darkMode } = useTheme();
  
  // Group by week
  const weeks = [];
  const weekCount = 12; // Last 12 weeks
  const cellsPerWeek = 7;
  
  // Find max count for intensity calculation
  const maxCount = Math.max(...activityData.map(d => d.count));
  
  // Process activity data into week format
  const today = new Date();
  const calendar = Array(weekCount * cellsPerWeek).fill(null).map((_, index) => {
    // Calculate date for this cell (going backwards from today)
    const date = new Date(today);
    date.setDate(today.getDate() - ((weekCount * cellsPerWeek) - index - 1));
    
    // Format date as string for lookup
    const dateStr = date.toISOString().split('T')[0];
    
    // Find matching activity data
    const activity = activityData.find(d => d.date === dateStr);
    
    return {
      date: dateStr,
      count: activity ? activity.count : 0,
      dayOfWeek: date.getDay(), // 0 = Sunday, 6 = Saturday
    };
  });
  
  // Group by week
  for (let i = 0; i < weekCount; i++) {
    weeks.push(calendar.slice(i * cellsPerWeek, (i + 1) * cellsPerWeek));
  }
  
  // Get intensity color
  const getIntensityColor = (count: number) => {
    if (count === 0) return darkMode ? '#374151' : '#f3f4f6';
    
    const intensity = Math.ceil((count / maxCount) * 4);
    
    if (darkMode) {
      if (intensity === 1) return '#4f46e5';
      if (intensity === 2) return '#4338ca';
      if (intensity === 3) return '#3730a3';
      return '#312e81';
    } else {
      if (intensity === 1) return '#e0e7ff';
      if (intensity === 2) return '#c7d2fe';
      if (intensity === 3) return '#a5b4fc';
      return '#6366f1';
    }
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-2 text-xs text-gray-500 dark:text-gray-400">
        <span>12 weeks ago</span>
        <span>Today</span>
      </div>
      
      <div className="flex">
        <div className="mr-2 flex flex-col justify-between h-32 text-xs text-gray-500 dark:text-gray-400">
          <span>Sun</span>
          <span>Tue</span>
          <span>Thu</span>
          <span>Sat</span>
        </div>
        
        <div className="flex-1 grid grid-cols-12 gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div 
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: getIntensityColor(day.count) }}
                  title={`${day.date}: ${day.count} activities`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-end">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span className="mr-1">Less</span>
          {[0, 1, 2, 3, 4].map(intensity => (
            <div 
              key={intensity}
              className="w-3 h-3 mx-0.5 rounded-sm"
              style={{ backgroundColor: getIntensityColor(intensity === 0 ? 0 : (intensity * maxCount) / 4) }}
            ></div>
          ))}
          <span className="ml-1">More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;