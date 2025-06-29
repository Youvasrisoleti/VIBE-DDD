import React from 'react';
import { MapPin, BookOpen, Award, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LearningPathCardProps {
  path: {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    totalCourses: number;
    completedCourses: number;
    difficulty: string;
    estimatedTime: string;
  };
}

const LearningPathCard: React.FC<LearningPathCardProps> = ({ path }) => {
  const { darkMode } = useTheme();
  
  const progress = Math.round((path.completedCourses / path.totalCourses) * 100);
  
  return (
    <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-md hover:transform hover:scale-105`}>
      <div className="h-40 relative">
        <img 
          src={path.thumbnail} 
          alt={path.title} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 right-3 px-2 py-1 bg-indigo-600 text-white text-xs rounded-md">
          {path.difficulty}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <MapPin className="text-indigo-500 mr-2" size={16} />
          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {path.title}
          </h3>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {path.description}
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center">
              <BookOpen className="text-indigo-500 mr-2" size={14} />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Courses</p>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {path.totalCourses}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center">
              <Clock className="text-indigo-500 mr-2" size={14} />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {path.estimatedTime}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Progress
          </span>
          <span className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {path.completedCourses}/{path.totalCourses}
          </span>
        </div>
        
        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <button className="mt-4 w-full flex items-center justify-between px-4 py-2 border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-medium rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
          <span>View Path</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default LearningPathCard;

import { Clock } from 'lucide-react';