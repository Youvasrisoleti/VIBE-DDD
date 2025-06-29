import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { BarChart3, BookOpen, Calendar, Clock, Edit, Medal, Target, Trophy, User, Save, X } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import SkillsRadarChart from '../components/profile/SkillsRadarChart';
import ActivityCalendar from '../components/profile/ActivityCalendar';
import StatisticCard from '../components/ui/StatisticCard';

const Profile = () => {
  const { user, updateProfile } = useUser();
  const { getEarnedCount, getActivityCalendarData } = useProgress();
  const { darkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || '',
    timezone: user?.timezone || 'UTC'
  });
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const stats = [
    { 
      id: 1, 
      label: 'Problems Solved', 
      value: (user?.problems_solved || 0).toString(),
      icon: <Target className="text-indigo-600 dark:text-indigo-400" size={18} />
    },
    { 
      id: 2, 
      label: 'Courses Completed', 
      value: (user?.courses_completed || 0).toString(),
      icon: <BookOpen className="text-teal-600 dark:text-teal-400" size={18} />
    },
    { 
      id: 3, 
      label: 'Streak', 
      value: `${user?.current_streak || 0} days`,
      icon: <Trophy className="text-amber-600 dark:text-amber-400" size={18} />
    },
    { 
      id: 4, 
      label: 'Time Studied', 
      value: formatTime(user?.total_study_time || 0),
      icon: <Clock className="text-emerald-600 dark:text-emerald-400" size={18} />
    },
  ];

  // Sample skills data
  const skills = [
    { name: 'JavaScript', value: 75 },
    { name: 'React', value: 60 },
    { name: 'CSS', value: 80 },
    { name: 'HTML', value: 90 },
    { name: 'Node.js', value: 45 },
    { name: 'Python', value: 30 }
  ];

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      full_name: user?.full_name || '',
      timezone: user?.timezone || 'UTC'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <Avatar 
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=6366f1&color=fff`} 
              alt={user?.full_name || 'User'} 
              size="xl" 
            />
            <button className="absolute bottom-0 right-0 p-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              <Edit size={14} />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {user?.full_name || 'User'}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
              
              <div className="flex items-center">
                <div className={`flex items-center px-3 py-1 rounded-full ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
                  <Medal className="mr-1" size={14} />
                  <span className="text-sm font-medium">Level {user?.level || 1}</span>
                </div>
                
                <div className={`ml-2 flex items-center px-3 py-1 rounded-full ${darkMode ? 'bg-amber-900 text-amber-300' : 'bg-amber-100 text-amber-700'}`}>
                  <Trophy className="mr-1" size={14} />
                  <span className="text-sm font-medium">{getEarnedCount()} Achievements</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <StatisticCard 
                  key={stat.id}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="inline-block mr-2" size={18} />
              Skills Proficiency
            </h2>
          </div>
          <SkillsRadarChart skills={skills} />
        </div>
        
        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Calendar className="inline-block mr-2" size={18} />
              Activity Calendar
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last 12 weeks
            </div>
          </div>
          <ActivityCalendar activityData={getActivityCalendarData()} />
        </div>
      </div>
      
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <User className="inline-block mr-2" size={18} />
            Account Information
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
            >
              <Edit size={16} className="mr-2" />
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.full_name}
                onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              />
            ) : (
              <input
                type="text"
                value={user?.full_name || ''}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                readOnly
              />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Joined
            </label>
            <input
              type="text"
              value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
              className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Time Zone
            </label>
            {isEditing ? (
              <select
                value={editForm.timezone}
                onChange={(e) => setEditForm(prev => ({ ...prev, timezone: e.target.value }))}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Paris">Paris</option>
                <option value="Asia/Tokyo">Tokyo</option>
                <option value="Asia/Kolkata">India</option>
              </select>
            ) : (
              <input
                type="text"
                value={user?.timezone || 'UTC'}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                readOnly
              />
            )}
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancelEdit}
              className={`flex items-center px-4 py-2 border rounded-md font-medium transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;