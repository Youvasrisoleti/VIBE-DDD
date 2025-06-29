import { useState, useEffect } from 'react';
import { supabase, Achievement, UserAchievement } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAchievements();
    if (user) {
      fetchUserAchievements();
    }
  }, [user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('is_active', true)
        .order('required_value', { ascending: true });

      if (error) throw error;
      setAchievements(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false, nullsLast: true });

      if (error) throw error;
      setUserAchievements(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRecentAchievements = () => {
    return userAchievements
      .filter(ua => ua.is_earned && ua.earned_at)
      .slice(0, 5)
      .map(ua => ({
        id: ua.achievement?.id || '',
        title: ua.achievement?.title || '',
        description: ua.achievement?.description || '',
        icon: ua.achievement?.icon || 'award',
        earnedAt: new Date(ua.earned_at!).toLocaleDateString(),
      }));
  };

  const getAchievementsByCategory = (category?: string) => {
    if (!category || category === 'all') {
      return userAchievements;
    }
    return userAchievements.filter(ua => ua.achievement?.category === category);
  };

  const getEarnedCount = () => {
    return userAchievements.filter(ua => ua.is_earned).length;
  };

  const getTotalCount = () => {
    return userAchievements.length;
  };

  return {
    achievements,
    userAchievements,
    loading,
    error,
    getRecentAchievements,
    getAchievementsByCategory,
    getEarnedCount,
    getTotalCount,
    fetchUserAchievements,
  };
};