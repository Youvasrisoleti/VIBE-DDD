import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Lock, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import VideoPlayer from './VideoPlayer';
import QuizComponent from './QuizComponent';

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration_minutes: number;
  lesson_order: number;
  is_free: boolean;
  quizzes: Array<{
    id: string;
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
    points: number;
  }>;
}

interface CourseViewerProps {
  course: {
    id: string;
    title: string;
    description: string;
    lessons: Lesson[];
  };
  onBack: () => void;
  onLessonComplete?: (lessonId: string, watchTime: number) => void;
  onQuizComplete?: (lessonId: string, score: number, totalPoints: number) => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ 
  course, 
  onBack, 
  onLessonComplete, 
  onQuizComplete 
}) => {
  const { darkMode } = useTheme();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [watchTime, setWatchTime] = useState(0);

  const currentLesson = course.lessons[currentLessonIndex];

  const handleLessonComplete = () => {
    setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
    onLessonComplete?.(currentLesson.id, watchTime);
    
    if (currentLesson.quizzes && currentLesson.quizzes.length > 0) {
      setShowQuiz(true);
    } else {
      // Move to next lesson if no quiz
      if (currentLessonIndex < course.lessons.length - 1) {
        setCurrentLessonIndex(prev => prev + 1);
        setWatchTime(0);
      }
    }
  };

  const handleQuizComplete = (score: number, totalPoints: number) => {
    onQuizComplete?.(currentLesson.id, score, totalPoints);
    setShowQuiz(false);
    
    // Move to next lesson
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setWatchTime(0);
    }
  };

  const handleLessonSelect = (index: number) => {
    const lesson = course.lessons[index];
    if (lesson.is_free || index === 0 || completedLessons.has(course.lessons[index - 1]?.id)) {
      setCurrentLessonIndex(index);
      setShowQuiz(false);
      setWatchTime(0);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Courses
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {course.title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {course.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>Lesson {currentLessonIndex + 1} of {course.lessons.length}</span>
                <span>•</span>
                <span>{currentLesson?.duration_minutes} minutes</span>
              </div>
            </div>

            {showQuiz ? (
              <QuizComponent
                quizzes={currentLesson.quizzes}
                onQuizComplete={handleQuizComplete}
              />
            ) : (
              <VideoPlayer
                videoUrl={currentLesson?.video_url}
                title={currentLesson?.title}
                onComplete={handleLessonComplete}
                onProgress={setWatchTime}
              />
            )}

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentLesson?.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {currentLesson?.description}
              </p>
            </div>
          </div>

          {/* Course Sidebar */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm sticky top-6`}>
              <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Course Content
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {course.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.has(lesson.id);
                  const isCurrent = index === currentLessonIndex;
                  const isLocked = !lesson.is_free && index > 0 && !completedLessons.has(course.lessons[index - 1]?.id);
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonSelect(index)}
                      disabled={isLocked}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800'
                          : isCompleted
                            ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                            : isLocked
                              ? 'bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed opacity-50'
                              : darkMode
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {isCompleted ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : isLocked ? (
                            <Lock className="text-gray-400" size={20} />
                          ) : (
                            <Play className="text-indigo-500" size={20} />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-sm font-medium truncate ${
                            isCurrent
                              ? 'text-indigo-700 dark:text-indigo-300'
                              : isCompleted
                                ? 'text-green-700 dark:text-green-300'
                                : darkMode
                                  ? 'text-white'
                                  : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {lesson.duration_minutes} min
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Progress</span>
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {completedLessons.size}/{course.lessons.length}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedLessons.size / course.lessons.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;