import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { BarChart, BookOpen, CheckCircle, ChevronRight, Clock, Filter, Search, Star, Play, MapPin, ArrowRight } from 'lucide-react';
import CourseViewer from '../components/learning/CourseViewer';
import { useCourses } from '../hooks/useCourses';

const Learning = () => {
  const { userCourses, getRecommendedCourses } = useProgress();
  const { fetchCourseWithLessons, completeLesson, submitQuizAnswer } = useCourses();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('inProgress');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showCourseViewer, setShowCourseViewer] = useState(false);
  
  const tabs = [
    { id: 'inProgress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'paths', label: 'Learning Paths' },
  ];
  
  const filteredCourses = activeTab === 'inProgress'
    ? userCourses.filter(userCourse => (userCourse.progress_percentage || 0) < 100)
    : activeTab === 'completed'
      ? userCourses.filter(userCourse => (userCourse.progress_percentage || 0) === 100)
      : [];
  
  const learningPaths = [
    {
      id: 1,
      title: 'Full Stack Web Development',
      description: 'Master frontend and backend development with modern technologies',
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
      totalCourses: 5,
      completedCourses: 1,
      difficulty: 'Intermediate',
      estimatedTime: '120 hours'
    },
    {
      id: 2,
      title: 'AI & Machine Learning Path',
      description: 'Learn artificial intelligence and machine learning from scratch',
      thumbnail: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
      totalCourses: 4,
      completedCourses: 0,
      difficulty: 'Advanced',
      estimatedTime: '80 hours'
    },
    {
      id: 3,
      title: 'Data Science Mastery',
      description: 'Complete data science workflow with Python and analytics',
      thumbnail: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
      totalCourses: 3,
      completedCourses: 0,
      difficulty: 'Intermediate',
      estimatedTime: '60 hours'
    }
  ];
  
  const recommendedCourses = getRecommendedCourses();

  const handleCourseClick = async (courseId: string) => {
    const courseWithLessons = await fetchCourseWithLessons(courseId);
    if (courseWithLessons) {
      setSelectedCourse(courseWithLessons);
      setShowCourseViewer(true);
    }
  };

  const handleLessonComplete = async (lessonId: string, watchTime: number) => {
    await completeLesson(lessonId, watchTime);
  };

  const handleQuizComplete = async (lessonId: string, score: number, totalPoints: number) => {
    console.log(`Lesson ${lessonId} quiz completed with score ${score}/${totalPoints}`);
  };

  const filteredRecommended = recommendedCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewAllCourses = () => {
    console.log('View all courses clicked');
  };

  const handleViewPath = (pathId: number) => {
    console.log(`View learning path ${pathId} clicked`);
  };

  if (showCourseViewer && selectedCourse) {
    return (
      <CourseViewer
        course={selectedCourse}
        onBack={() => setShowCourseViewer(false)}
        onLessonComplete={handleLessonComplete}
        onQuizComplete={handleQuizComplete}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Learning Center
        </h1>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} w-full max-w-xs`}>
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`ml-2 flex-1 outline-none border-none text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
            />
          </div>
          
          <button className={`p-2 rounded-md transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Filter size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className={`mb-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' 
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab === 'paths' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div key={path.id} className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-md hover:transform hover:scale-105`}>
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
                      style={{ width: `${Math.round((path.completedCourses / path.totalCourses) * 100)}%` }}
                    ></div>
                  </div>
                  
                  <button 
                    onClick={() => handleViewPath(path.id)}
                    className="mt-4 w-full flex items-center justify-between px-4 py-2 border border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-medium rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                  >
                    <span>View Path</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((userCourse) => (
                <div key={userCourse.id} onClick={() => handleCourseClick(userCourse.course_id)} className="cursor-pointer">
                  <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-md hover:transform hover:scale-105`}>
                    <div className="h-40 relative">
                      <img 
                        src={userCourse.course?.thumbnail_url || 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                        alt={userCourse.course?.title || 'Course'} 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-md">
                          {userCourse.course?.category}
                        </span>
                        <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-md">
                          {userCourse.progress_percentage}% Complete
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {userCourse.course?.title || 'Unknown Course'}
                      </h3>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircle size={14} className="mr-1" />
                          <span>{userCourse.completed_lessons}/{userCourse.course?.total_lessons || 0} lessons</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock size={14} className="mr-1" />
                          <span>{userCourse.course?.estimated_hours || 0}h</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${userCourse.progress_percentage}%` }}
                        ></div>
                      </div>
                      
                      <button className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors">
                        <Play size={16} className="mr-2" />
                        {userCourse.progress_percentage > 0 ? 'Continue Learning' : 'Start Course'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`p-8 rounded-lg text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className={`mt-2 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No {activeTab === 'inProgress' ? 'in-progress' : 'completed'} courses
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'inProgress' 
                  ? 'Start a new course to see it here.' 
                  : 'Complete courses to see them here.'}
              </p>
            </div>
          )}
          
          {activeTab === 'inProgress' && (
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recommended for You
                </h2>
                <button 
                  onClick={handleViewAllCourses}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center hover:underline"
                >
                  View all <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecommended.slice(0, 6).map((course) => (
                  <div key={course.id} onClick={() => handleCourseClick(course.id)} className="cursor-pointer">
                    <div className={`rounded-xl overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-md hover:transform hover:scale-105`}>
                      <div className="h-40 relative">
                        <img 
                          src={course.thumbnail_url || 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                          alt={course.title} 
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-md">
                          {course.difficulty}
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center px-2 py-1 bg-amber-500 text-white text-xs rounded-md">
                          <Star size={12} className="mr-1" />
                          <span>{Number(course.rating).toFixed(1)}</span>
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
                            <span>{course.total_lessons} lessons</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{course.estimated_hours}h</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{course.student_count.toLocaleString()} students</span>
                          </div>
                          
                          <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-md transition-colors">
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Learning;