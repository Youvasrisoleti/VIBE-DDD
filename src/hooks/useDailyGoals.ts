import { useState, useEffect } from 'react';
import { supabase, DailyGoal } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useDailyGoals = () => {
  const { user } = useAuth();
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchDailyGoals();
    }
  }, [user]);

  const fetchDailyGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('goal_date', today)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setDailyGoals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const completeGoal = async (goalId: string) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('daily_goals')
        .update({
          is_completed: true,
          current_value: supabase.rpc('GREATEST', [
            supabase.raw('current_value'),
            supabase.raw('target_value')
          ]),
          completed_at: new Date().toISOString(),
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setDailyGoals(prev =>
        prev.map(goal => (goal.id === goalId ? data : goal))
      );
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const goal = dailyGoals.find(g => g.id === goalId);
      if (!goal) return { error: 'Goal not found' };

      const isCompleted = newValue >= goal.target_value;
      const { data, error } = await supabase
        .from('daily_goals')
        .update({
          current_value: newValue,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Update local state
      setDailyGoals(prev =>
        prev.map(g => (g.id === goalId ? data : g))
      );
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const createGoal = async (title: string, description: string, targetValue: number) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_goals')
        .insert({
          user_id: user.id,
          title,
          description,
          target_value: targetValue,
          goal_date: today,
        })
        .select()
        .single();

      if (error) throw error;
      
      setDailyGoals(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const getCompletedCount = () => {
    return dailyGoals.filter(goal => goal.is_completed).length;
  };

  const getTotalCount = () => {
    return dailyGoals.length;
  };

  return {
    dailyGoals,
    loading,
    error,
    completeGoal,
    updateGoalProgress,
    createGoal,
    getCompletedCount,
    getTotalCount,
    fetchDailyGoals,
  };
};