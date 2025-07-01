import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, BookOpen, User, Gamepad2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import Avatar from '../ui/Avatar';

const Sidebar = () => {
  const { darkMode } = useTheme();
  const { user } = useUser();

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/learning', icon: <BookOpen size={20} />, label: 'Learning' },
    { path: '/achievements', icon: <Trophy size={20} />, label: 'Achievements' },
    { path: '/gamify', icon: <Gamepad2 size={20} />, label: 'Gamify' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <aside 
      className={`w-full md:w-64 md:flex-shrink-0 md:flex md:flex-col 
      ${darkMode ? 'bg-gray-800' : 'bg-white'} 
      border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} 
      transition-all duration-300 ease-in-out`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-center md:justify-start mb-8 mt-2">
          <span className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold flex items-center">
            <Trophy className="mr-2" />
            LearnPulse
          </span>
        </div>
        
        {user && (
          <div className="hidden md:flex items-center space-x-3 mb-8 p-3 rounded-lg bg-indigo-50 dark:bg-gray-700">
            <Avatar 
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=6366f1&color=fff`} 
              alt={user.full_name} 
            />
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.full_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Level {user.level}</p>
            </div>
          </div>
        )}
        
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                ${isActive 
                  ? 'bg-indigo-100 text-indigo-600 dark:bg-gray-700 dark:text-indigo-400 font-medium' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
