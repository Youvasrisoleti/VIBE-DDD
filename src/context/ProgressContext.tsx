import React, { createContext, useContext } from 'react';
import { useCourses } from '../hooks/useCourses';
import { useAchievements } from '../hooks/useAchievements';
import { useDailyGoals } from '../hooks/useDailyGoals';
import { useLearningData } from '../hooks/useLearningData';

interface ProgressContextType {
  // Courses
  courses: any[];
  userCourses: any[];
  enrollInCourse: (courseId: string) => Promise<any>;
  updateCourseProgress: (courseId: string, progress: number, lessons: number) => Promise<any>;
  getRecommendedCourses: () => any[];
  
  // Achievements
  achievements: any[];
  userAchievements: any[];
  getRecentAchievements: () => any[];
  getAchievementsByCategory: (category?: string) => any[];
  getEarnedCount: () => number;
  getTotalCount: () => number;
  
  // Daily Goals
  dailyGoals: any[];
  completeGoal: (goalId: string) => Promise<any>;
  updateGoalProgress: (goalId: string, value: number) => Promise<any>;
  createGoal: (title: string, description: string, target: number) => Promise<any>;
  getCompletedGoalsCount: () => number;
  getTotalGoalsCount: () => number;
  
  // Learning Data
  getChartData: () => any[];
  getWeeklyActivity: () => number[];
  getActivityCalendarData: () => any[];
  createLearningSession: (courseId: string | null, type: string, duration: number, problems?: number, xp?: number) => Promise<any>;
  
  // Loading states
  coursesLoading: boolean;
  achievementsLoading: boolean;
  goalsLoading: boolean;
  learningLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    courses,
    userCourses,
    loading: coursesLoading,
    enrollInCourse,
    updateCourseProgress,
    getRecommendedCourses,
  } = useCourses();

  const {
    achievements,
    userAchievements,
    loading: achievementsLoading,
    getRecentAchievements,
    getAchievementsByCategory,
    getEarnedCount,
    getTotalCount,
  } = useAchievements();

  const {
    dailyGoals,
    loading: goalsLoading,
    completeGoal,
    updateGoalProgress,
    createGoal,
    getCompletedCount,
    getTotalCount: getTotalGoalsCount,
  } = useDailyGoals();

  const {
    loading: learningLoading,
    getChartData,
    getWeeklyActivity,
    getActivityCalendarData,
    createLearningSession,
  } = useLearningData();

  return (
    <ProgressContext.Provider value={{
      courses,
      userCourses,
      enrollInCourse,
      updateCourseProgress,
      getRecommendedCourses,
      
      achievements,
      userAchievements,
      getRecentAchievements,
      getAchievementsByCategory,
      getEarnedCount,
      getTotalCount,
      
      dailyGoals,
      completeGoal,
      updateGoalProgress,
      createGoal,
      getCompletedGoalsCount: getCompletedCount,
      getTotalGoalsCount,
      
      getChartData,
      getWeeklyActivity,
      getActivityCalendarData,
      createLearningSession,
      
      coursesLoading,
      achievementsLoading,
      goalsLoading,
      learningLoading,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};