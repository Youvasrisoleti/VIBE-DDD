/*
  # Complete Dopamine Dashboard Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `courses` - Available courses
    - `user_courses` - User course enrollments and progress
    - `achievements` - Available achievements
    - `user_achievements` - User earned achievements
    - `daily_goals` - User daily goals
    - `learning_sessions` - Learning activity tracking
    - `user_activity` - Daily activity calendar data
    - `leaderboard_entries` - Leaderboard scores

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access patterns

  3. Functions
    - Update user progress
    - Calculate streaks
    - Award achievements
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  level integer DEFAULT 1,
  total_xp integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_study_time integer DEFAULT 0, -- in minutes
  problems_solved integer DEFAULT 0,
  courses_completed integer DEFAULT 0,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  thumbnail_url text,
  total_lessons integer DEFAULT 0,
  estimated_hours integer DEFAULT 0,
  difficulty text DEFAULT 'Beginner',
  rating numeric(3,2) DEFAULT 0.0,
  student_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User course enrollments and progress
CREATE TABLE IF NOT EXISTS user_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_accessed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL,
  required_value integer DEFAULT 1,
  xp_reward integer DEFAULT 100,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievements(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  is_earned boolean DEFAULT false,
  earned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Daily goals
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_value integer DEFAULT 1,
  current_value integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  goal_date date DEFAULT CURRENT_DATE,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Learning sessions
CREATE TABLE IF NOT EXISTS learning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES courses(id) ON DELETE SET NULL,
  session_type text DEFAULT 'study', -- study, practice, review
  duration_minutes integer NOT NULL,
  problems_solved integer DEFAULT 0,
  xp_earned integer DEFAULT 0,
  session_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- User activity calendar
CREATE TABLE IF NOT EXISTS user_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  activity_date date NOT NULL,
  activity_count integer DEFAULT 0,
  study_minutes integer DEFAULT 0,
  problems_solved integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, activity_date)
);

-- Leaderboard entries
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  rank_position integer,
  period_type text DEFAULT 'monthly', -- daily, weekly, monthly, all_time
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, period_type, period_start)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses policies (public read)
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (is_active = true);

-- User courses policies
CREATE POLICY "Users can view own course enrollments" ON user_courses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own course enrollments" ON user_courses
  FOR ALL USING (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (is_active = true);

-- User achievements policies
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own achievements" ON user_achievements
  FOR ALL USING (auth.uid() = user_id);

-- Daily goals policies
CREATE POLICY "Users can manage own daily goals" ON daily_goals
  FOR ALL USING (auth.uid() = user_id);

-- Learning sessions policies
CREATE POLICY "Users can manage own learning sessions" ON learning_sessions
  FOR ALL USING (auth.uid() = user_id);

-- User activity policies
CREATE POLICY "Users can manage own activity" ON user_activity
  FOR ALL USING (auth.uid() = user_id);

-- Leaderboard policies
CREATE POLICY "Users can view leaderboard" ON leaderboard_entries
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own leaderboard entries" ON leaderboard_entries
  FOR ALL USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO courses (title, description, category, thumbnail_url, total_lessons, estimated_hours, difficulty, rating, student_count) VALUES
('Data Structures Masterclass', 'Master fundamental data structures and algorithms', 'Algorithms', 'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=600', 24, 12, 'Intermediate', 4.8, 3542),
('System Design Interview Prep', 'Prepare for system design interviews at top tech companies', 'System Design', 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600', 18, 10, 'Advanced', 4.6, 2865),
('Dynamic Programming Deep Dive', 'Master dynamic programming concepts and patterns', 'Algorithms', 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=600', 16, 8, 'Advanced', 4.9, 4721),
('Database Design Fundamentals', 'Learn database design principles and best practices', 'Databases', 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=600', 14, 7, 'Beginner', 4.5, 1892),
('Frontend Development Bootcamp', 'Complete frontend development with React and modern tools', 'Web Development', 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600', 32, 16, 'Intermediate', 4.7, 5234);

INSERT INTO achievements (title, description, category, icon, required_value, xp_reward) VALUES
('First Steps', 'Complete your first learning session', 'milestone', 'target', 1, 50),
('Problem Solver', 'Solve 10 coding problems', 'problem', 'target', 10, 100),
('Streak Starter', 'Maintain a 7-day learning streak', 'streak', 'flame', 7, 150),
('Course Completer', 'Complete your first course', 'course', 'book', 1, 200),
('Study Marathon', 'Study for 10 hours total', 'time', 'clock', 600, 100),
('Problem Master', 'Solve 50 coding problems', 'problem', 'target', 50, 300),
('Streak Champion', 'Maintain a 30-day learning streak', 'streak', 'flame', 30, 500),
('Learning Enthusiast', 'Complete 5 courses', 'course', 'book', 5, 750),
('Time Warrior', 'Study for 100 hours total', 'time', 'clock', 6000, 1000);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create initial daily goals
  INSERT INTO public.daily_goals (user_id, title, description, target_value) VALUES
  (new.id, 'Solve 3 Problems', 'Complete 3 coding problems today', 3),
  (new.id, 'Study 30 Minutes', 'Spend 30 minutes learning today', 30),
  (new.id, 'Complete 1 Lesson', 'Finish one course lesson', 1);
  
  -- Initialize user achievements
  INSERT INTO public.user_achievements (user_id, achievement_id, progress)
  SELECT new.id, id, 0 FROM public.achievements WHERE is_active = true;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update user progress
CREATE OR REPLACE FUNCTION update_user_progress(
  p_user_id uuid,
  p_problems_solved integer DEFAULT 0,
  p_study_minutes integer DEFAULT 0,
  p_xp_earned integer DEFAULT 0
)
RETURNS json AS $$
DECLARE
  v_profile profiles%ROWTYPE;
  v_activity_date date := CURRENT_DATE;
  v_new_achievements json[];
BEGIN
  -- Update profile stats
  UPDATE profiles SET
    problems_solved = problems_solved + p_problems_solved,
    total_study_time = total_study_time + p_study_minutes,
    total_xp = total_xp + p_xp_earned,
    level = GREATEST(1, (total_xp + p_xp_earned) / 1000 + 1),
    updated_at = now()
  WHERE id = p_user_id
  RETURNING * INTO v_profile;
  
  -- Update or insert daily activity
  INSERT INTO user_activity (user_id, activity_date, activity_count, study_minutes, problems_solved)
  VALUES (p_user_id, v_activity_date, 1, p_study_minutes, p_problems_solved)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    activity_count = user_activity.activity_count + 1,
    study_minutes = user_activity.study_minutes + p_study_minutes,
    problems_solved = user_activity.problems_solved + p_problems_solved;
  
  -- Check and award achievements
  WITH achievement_progress AS (
    SELECT 
      ua.id,
      ua.achievement_id,
      a.title,
      a.category,
      a.required_value,
      a.xp_reward,
      CASE 
        WHEN a.category = 'problem' THEN v_profile.problems_solved
        WHEN a.category = 'time' THEN v_profile.total_study_time
        WHEN a.category = 'streak' THEN v_profile.current_streak
        WHEN a.category = 'course' THEN v_profile.courses_completed
        ELSE ua.progress + 1
      END as current_progress
    FROM user_achievements ua
    JOIN achievements a ON ua.achievement_id = a.id
    WHERE ua.user_id = p_user_id AND ua.is_earned = false
  )
  UPDATE user_achievements ua SET
    progress = ap.current_progress,
    is_earned = ap.current_progress >= ap.required_value,
    earned_at = CASE WHEN ap.current_progress >= ap.required_value THEN now() ELSE null END
  FROM achievement_progress ap
  WHERE ua.id = ap.id AND ap.current_progress >= ap.required_value;
  
  -- Return updated profile and new achievements
  RETURN json_build_object(
    'profile', row_to_json(v_profile),
    'new_achievements', (
      SELECT COALESCE(array_agg(row_to_json(a)), ARRAY[]::json[])
      FROM achievements a
      JOIN user_achievements ua ON a.id = ua.achievement_id
      WHERE ua.user_id = p_user_id AND ua.earned_at > now() - interval '1 minute'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate and update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id uuid)
RETURNS integer AS $$
DECLARE
  v_current_streak integer := 0;
  v_check_date date := CURRENT_DATE;
  v_has_activity boolean;
BEGIN
  -- Check if user has activity today
  SELECT EXISTS(
    SELECT 1 FROM user_activity 
    WHERE user_id = p_user_id AND activity_date = CURRENT_DATE
  ) INTO v_has_activity;
  
  -- If no activity today, streak is 0
  IF NOT v_has_activity THEN
    UPDATE profiles SET current_streak = 0 WHERE id = p_user_id;
    RETURN 0;
  END IF;
  
  -- Count consecutive days with activity
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM user_activity 
      WHERE user_id = p_user_id AND activity_date = v_check_date
    ) INTO v_has_activity;
    
    IF v_has_activity THEN
      v_current_streak := v_current_streak + 1;
      v_check_date := v_check_date - interval '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  -- Update profile with new streak
  UPDATE profiles SET
    current_streak = v_current_streak,
    longest_streak = GREATEST(longest_streak, v_current_streak)
  WHERE id = p_user_id;
  
  RETURN v_current_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;