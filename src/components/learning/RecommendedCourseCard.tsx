import React from 'react';
import { Star, BookOpen, Clock, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface RecommendedCourseCardProps {
  course: {
    id: number;
    title: string;
    category: string;
    thumbnail: string;
    rating: number;
    totalLessons: number;
    estimatedTime: string;
    students: number;
    level: string;
  };
}

const RecommendedCourseCard: React.FC<RecommendedCourseCardProps> = ({ course }) => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-md hover:transform hover:scale-105`}>
      <div className="h-40 relative">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-md">
          {course.level}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center px-2 py-1 bg-amber-500 text-white text-xs rounded-md">
          <Star size={12} className="mr-1" />
          <span>{course.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          {course.category}
        </div>
        
        <h3 className={`font-medium line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {course.title}
        </h3>
        
        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{course.totalLessons} lessons</span>
          </div>
          
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{course.estimatedTime}</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Users size={14} className="mr-1" />
            <span>{course.students.toLocaleString()} students</span>
          </div>
          
          <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-md transition-colors">
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedCourseCard;