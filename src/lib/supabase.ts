import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  total_study_time: number;
  problems_solved: number;
  courses_completed: number;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  category: string;
  thumbnail_url?: string;
  total_lessons: number;
  estimated_hours: number;
  difficulty: string;
  rating: number;
  student_count: number;
  is_active: boolean;
  created_at: string;
}

export interface UserCourse {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  completed_lessons: number;
  is_completed: boolean;
  enrolled_at: string;
  completed_at?: string;
  last_accessed_at: string;
  course?: Course;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  required_value: number;
  xp_reward: number;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  is_earned: boolean;
  earned_at?: string;
  created_at: string;
  achievement?: Achievement;
}

export interface DailyGoal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  is_completed: boolean;
  goal_date: string;
  completed_at?: string;
  created_at: string;
}

export interface LearningSession {
  id: string;
  user_id: string;
  course_id?: string;
  session_type: string;
  duration_minutes: number;
  problems_solved: number;
  xp_earned: number;
  session_date: string;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_date: string;
  activity_count: number;
  study_minutes: number;
  problems_solved: number;
  created_at: string;
}