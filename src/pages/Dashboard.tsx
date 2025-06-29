import React, { useState } from 'react';
import { Zap, Trophy, Calendar, Clock, BookOpen, Target, PieChart, Flame } from 'lucide-react';
import ProgressChart from '../components/dashboard/ProgressChart';
import StreakCard from '../components/dashboard/StreakCard';
import LeaderboardCard from '../components/dashboard/LeaderboardCard';
import AchievementCard from '../components/dashboard/AchievementCard';
import DailyGoalCard from '../components/dashboard/DailyGoalCard';
import CoursesProgressCard from '../components/dashboard/CoursesProgressCard';
import StatsCard from '../components/ui/StatsCard';
import { useProgress } from '../context/ProgressContext';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { getChartData, getWeeklyActivity, getRecentAchievements } = useProgress();
  const { user } = useUser();
  const { darkMode } = useTheme();
  const [chartPeriod, setChartPeriod] = useState('month');
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  // Calculate completion rate compared to previous day
  const calculateCompletionRate = () => {
    const today = user?.problems_solved || 0;
    const yesterday = Math.max(0, today - 1); // Simulated previous day data
    const change = today - yesterday;
    return {
      rate: Math.min(100, Math.round((today / Math.max(1, today + 2)) * 100)), // Simulated completion rate
      change: change > 0 ? `+${change}` : change.toString(),
      isPositive: change >= 0
    };
  };

  const completionData = calculateCompletionRate();
  
  const stats = [
    { 
      id: 1, 
      title: 'Study Time', 
      value: formatTime(user?.total_study_time || 0), 
      change: '+15m', 
      isPositive: true, 
      icon: <Clock className="text-indigo-600 dark:text-indigo-400" /> 
    },
    { 
      id: 2, 
      title: 'Problems Solved', 
      value: (user?.problems_solved || 0).toString(), 
      change: '+1', 
      isPositive: true, 
      icon: <Target className="text-teal-600 dark:text-teal-400" /> 
    },
    { 
      id: 3, 
      title: 'Completion Rate', 
      value: `${completionData.rate}%`, 
      change: `${completionData.change}%`, 
      isPositive: completionData.isPositive, 
      icon: <PieChart className="text-amber-600 dark:text-amber-400" /> 
    },
    { 
      id: 4, 
      title: 'Courses', 
      value: '1', // Currently enrolled in 1 course
      change: '+1', 
      isPositive: true, 
      icon: <BookOpen className="text-emerald-600 dark:text-emerald-400" /> 
    },
  ];

  // Mock leaderboard data with current user
  const leaderboardData = [
    {
      id: 1,
      name: user?.full_name || 'Soleti Youvasri',
      avatar: user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'Soleti Youvasri')}&background=6366f1&color=fff`,
      score: user?.total_xp || 250,
      rank: 1
    }
  ];

  const handlePeriodChange = (period: string) => {
    setChartPeriod(period);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Dashboard
        </h1>
        <div className="flex items-center space-x-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
          <Calendar size={16} />
          <span>Last 30 Days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard 
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Learning Progress</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handlePeriodChange('week')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    chartPeriod === 'week' 
                      ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
                      : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Week
                </button>
                <button 
                  onClick={() => handlePeriodChange('month')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    chartPeriod === 'month' 
                      ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
                      : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Month
                </button>
                <button 
                  onClick={() => handlePeriodChange('year')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    chartPeriod === 'year' 
                      ? darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
                      : darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>
            <ProgressChart data={getChartData()} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CoursesProgressCard />
            <LeaderboardCard leaders={leaderboardData} />
          </div>
        </div>
        
        <div className="space-y-6">
          <StreakCard 
            streak={user?.current_streak || 1}
            longestStreak={user?.longest_streak || 3} 
            weeklyActivity={getWeeklyActivity()}
          />
          
          <DailyGoalCard />
          
          <AchievementCard recentAchievements={getRecentAchievements()} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;