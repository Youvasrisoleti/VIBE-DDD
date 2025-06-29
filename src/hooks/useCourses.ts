import { useState, useEffect } from 'react';
import { supabase, Course, UserCourse } from '../lib/supabase';
import { useAuth } from './useAuth';

interface CourseLesson {
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

interface CourseWithLessons extends Course {
  lessons: CourseLesson[];
}

export const useCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [userCourses, setUserCourses] = useState<UserCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    if (user) {
      fetchUserCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchUserCourses = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_courses')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', user.id)
        .order('last_accessed_at', { ascending: false });

      if (error) throw error;
      setUserCourses(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseWithLessons = async (courseId: string): Promise<CourseWithLessons | null> => {
    try {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_lessons')
        .select(`
          *,
          quizzes:lesson_quizzes(*)
        `)
        .eq('course_id', courseId)
        .order('lesson_order', { ascending: true });

      if (lessonsError) throw lessonsError;

      const lessons = lessonsData?.map(lesson => ({
        ...lesson,
        quizzes: lesson.quizzes?.map((quiz: any) => ({
          ...quiz,
          options: Array.isArray(quiz.options) ? quiz.options : JSON.parse(quiz.options || '[]')
        })) || []
      })) || [];

      return {
        ...courseData,
        lessons
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('user_courses')
        .insert({
          user_id: user.id,
          course_id: courseId,
        })
        .select(`
          *,
          course:courses(*)
        `)
        .single();

      if (error) throw error;
      
      setUserCourses(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const updateCourseProgress = async (
    courseId: string,
    progressPercentage: number,
    completedLessons: number
  ) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const isCompleted = progressPercentage >= 100;
      const { data, error } = await supabase
        .from('user_courses')
        .update({
          progress_percentage: progressPercentage,
          completed_lessons: completedLessons,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
          last_accessed_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .select(`
          *,
          course:courses(*)
        `)
        .single();

      if (error) throw error;
      
      // Update local state
      setUserCourses(prev =>
        prev.map(uc => (uc.course_id === courseId ? data : uc))
      );
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const completeLesson = async (lessonId: string, watchTimeMinutes: number = 0) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase.rpc('complete_lesson', {
        p_user_id: user.id,
        p_lesson_id: lessonId,
        p_watch_time_minutes: watchTimeMinutes
      });

      if (error) throw error;
      
      // Refresh user courses to get updated progress
      await fetchUserCourses();
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const submitQuizAnswer = async (quizId: string, selectedAnswer: number) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase.rpc('complete_quiz_question', {
        p_user_id: user.id,
        p_quiz_id: quizId,
        p_selected_answer: selectedAnswer
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const getRecommendedCourses = () => {
    // Simple recommendation logic - exclude enrolled courses
    const enrolledCourseIds = userCourses.map(uc => uc.course_id);
    return courses.filter(course => !enrolledCourseIds.includes(course.id));
  };

  return {
    courses,
    userCourses,
    loading,
    error,
    enrollInCourse,
    updateCourseProgress,
    completeLesson,
    submitQuizAnswer,
    fetchCourseWithLessons,
    getRecommendedCourses,
    fetchUserCourses,
  };
};