import React, { useState } from 'react';
import { Bell, Sun, Moon, Search, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';

const Header = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useUser();
  const { signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  if (!user) return null;

  return (
    <header className={`px-4 py-2 border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} flex items-center justify-between`}>
      <div className="flex items-center md:hidden">
        <span className="text-indigo-600 dark:text-indigo-400 text-xl font-bold">LearnPulse</span>
      </div>
      
      <div className="hidden md:flex items-center flex-1 mx-4">
        <div className={`flex items-center px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} w-full max-w-md`}>
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search courses, topics..."
            className={`ml-2 flex-1 outline-none border-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <Bell size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? (
            <Sun size={20} className="text-gray-300" />
          ) : (
            <Moon size={20} className="text-gray-600" />
          )}
        </button>
        
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="hidden md:block text-right">
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user.full_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Level {user.level} • {user.current_streak} day streak
              </p>
            </div>
            <Avatar 
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=random`} 
              alt={user.full_name} 
            />
          </button>

          {showUserMenu && (
            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} z-50`}>
              <div className="py-1">
                <button
                  onClick={handleSignOut}
                  className={`flex items-center w-full px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-colors`}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;