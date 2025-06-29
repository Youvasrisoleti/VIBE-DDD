import { useState, useEffect } from 'react';
import { supabase, Profile } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id);

      if (error) throw error;
      
      // Handle case where no profile exists yet
      if (data && data.length > 0) {
        setProfile(data[0]);
      } else {
        setProfile(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const updateProgress = async (
    problemsSolved: number = 0,
    studyMinutes: number = 0,
    xpEarned: number = 0
  ) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase.rpc('update_user_progress', {
        p_user_id: user.id,
        p_problems_solved: problemsSolved,
        p_study_minutes: studyMinutes,
        p_xp_earned: xpEarned,
      });

      if (error) throw error;
      
      // Update local profile state
      if (data?.profile) {
        setProfile(data.profile);
      }
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  const updateStreak = async () => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase.rpc('update_user_streak', {
        p_user_id: user.id,
      });

      if (error) throw error;
      
      // Refresh profile to get updated streak
      await fetchProfile();
      
      return { data, error: null };
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred';
      setError(error);
      return { data: null, error };
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateProgress,
    updateStreak,
  };
};