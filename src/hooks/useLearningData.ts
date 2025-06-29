import { useState, useEffect } from 'react';
import { supabase, LearningSession, UserActivity } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useLearningData = () => {
  const { user } = useAuth();
  const [learningSessions, setLearningSessions] = useState<LearningSession[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchLearningData();
    }
  }, [user]);

  const fetchLearningData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch learning sessions for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: sessions, error: sessionsError } = await supabase
        .from('learning_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('session_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('session_date', { ascending: true });

      if (sessionsError) throw sessionsError;
      
      // Fetch user activity for the last 84 days (12 weeks)
      const eightyFourDaysAgo = new Date();
      eightyFourDaysAgo.setDate(eightyFourDaysAgo.getDate() - 84);
      
      const { data: activity, error: activityError } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .gte('activity_date', eightyFourDaysAgo.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });

      if (activityError) throw activityError;
      
      setLearningSessions(sessions || []);
      setUserActivity(activity || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createLearningSession = async (
    courseId: string | null,
    sessionType: string,
    durationMinutes: number,
    problemsSolved: number = 0,
    xpEarned: number = 0
  ) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('learning_sessions')
        .insert({
          user_id: user.id,
          course_id: courseId,
          session_type: sessionType,
          duration_minutes: durationMinutes,
          problems_solved: problemsSolved,
          xp_earned: xpEarned,
          session_date: today,
        })
        .select()
        .single();

      if (error) throw error;
      
      setLearningSessions(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const getChartData = () => {
    // Group sessions by date and aggregate data
    const sessionsByDate = learningSessions.reduce((acc, session) => {
      const date = session.session_date;
      if (!acc[date]) {
        acc[date] = {
          date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          problems: 0,
          timeSpent: 0,
        };
      }
      acc[date].problems += session.problems_solved;
      acc[date].timeSpent += session.duration_minutes;
      return acc;
    }, {} as Record<string, { date: string; problems: number; timeSpent: number }>);

    return Object.values(sessionsByDate);
  };

  const getWeeklyActivity = () => {
    // Get activity for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const activity = userActivity.find(a => a.activity_date === date);
      return activity ? activity.activity_count : 0;
    });
  };

  const getActivityCalendarData = () => {
    return userActivity.map(activity => ({
      date: activity.activity_date,
      count: activity.activity_count,
    }));
  };

  return {
    learningSessions,
    userActivity,
    loading,
    error,
    createLearningSession,
    getChartData,
    getWeeklyActivity,
    getActivityCalendarData,
    fetchLearningData,
  };
};