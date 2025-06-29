import React from 'react';
import { BookOpen, Play } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const CoursesProgressCard: React.FC = () => {
  const { darkMode } = useTheme();
  const { userCourses, coursesLoading, updateCourseProgress } = useProgress();
  const { updateProgress } = useUser();

  const handleContinueCourse = async (courseId: string, currentProgress: number) => {
    // Simulate continuing a course - increase progress by 10%
    const newProgress = Math.min(100, currentProgress + 10);
    const course = userCourses.find(uc => uc.course_id === courseId);
    
    if (course) {
      const newCompletedLessons = Math.floor((newProgress / 100) * course.course.total_lessons);
      
      // Update course progress
      await updateCourseProgress(courseId, newProgress, newCompletedLessons);
      
      // Update user progress (simulate 30 minutes of study and some XP)
      await updateProgress(0, 30, 50);
    }
  };

  if (coursesLoading) {
    return (
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm h-full flex items-center justify-center`}>
        <LoadingSpinner />
      </div>
    );
  }

  const inProgressCourses = userCourses.filter(uc => !uc.is_completed).slice(0, 3);

  return (
    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm h-full`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Course Progress
        </h2>
        <BookOpen className="text-indigo-500" size={20} />
      </div>
      
      <div className="space-y-4">
        {inProgressCourses.length > 0 ? (
          inProgressCourses.map((userCourse) => (
            <div key={userCourse.id} className="flex items-center">
              <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                <img 
                  src={userCourse.course?.thumbnail_url || 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                  alt={userCourse.course?.title || 'Course'} 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userCourse.course?.title || 'Course Title'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userCourse.course?.category || 'Category'}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleContinueCourse(userCourse.course_id, userCourse.progress_percentage)}
                    className="flex items-center px-2 py-1 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-md transition-colors"
                  >
                    <Play size={12} className="mr-1" />
                    Continue
                  </button>
                </div>
                
                <div className="mt-1 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      userCourse.progress_percentage === 100 
                        ? 'bg-green-500' 
                        : 'bg-indigo-500'
                    }`} 
                    style={{ width: `${userCourse.progress_percentage}%` }}
                  ></div>
                </div>
                
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {userCourse.completed_lessons}/{userCourse.course?.total_lessons || 0} lessons
                  </span>
                  <span className={`font-medium ${
                    userCourse.progress_percentage === 100 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {userCourse.progress_percentage}%
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              No courses in progress
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start a new course to see your progress here.
            </p>
          </div>
        )}
      </div>
      
      <button className="mt-6 w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
        View All Courses
      </button>
    </div>
  );
};

export default CoursesProgressCard;