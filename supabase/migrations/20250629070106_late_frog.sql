/*
  # Sample Data for Soleti Youvasri

  1. User Profile
    - Level 2, 250 XP, 1-day streak
    - 1 hour study time, 4 problems solved
    
  2. Course Progress
    - Web Development course at 40% completion
    - 2 lessons completed with quiz attempts
    
  3. Learning Data
    - 7 days of learning sessions
    - Activity calendar data
    - Daily goals with progress
    
  4. Achievements
    - "First Steps" and "Streak Starter" earned
    - Other achievements locked with progress
    
  5. Leaderboard
    - User ranked #1 with 250 XP
*/

-- Insert sample profile data for Soleti Youvasri
INSERT INTO profiles (id, email, full_name, avatar_url, level, total_xp, current_streak, longest_streak, total_study_time, problems_solved, courses_completed, timezone, created_at, updated_at)
VALUES (
  '8c6f16a9-21d9-4137-8c7e-b692da9a208f',
  'soleti.youvasri@example.com',
  'Soleti Youvasri',
  'https://ui-avatars.com/api/?name=Soleti+Youvasri&background=6366f1&color=fff',
  2,
  250,
  1,
  3,
  60, -- 1 hour in minutes
  4,
  0,
  'UTC',
  now() - interval '7 days',
  now()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  level = EXCLUDED.level,
  total_xp = EXCLUDED.total_xp,
  current_streak = EXCLUDED.current_streak,
  longest_streak = EXCLUDED.longest_streak,
  total_study_time = EXCLUDED.total_study_time,
  problems_solved = EXCLUDED.problems_solved,
  courses_completed = EXCLUDED.courses_completed,
  updated_at = now();

-- Enroll user in Web Development course (in progress)
DO $$
DECLARE
  web_dev_course_id uuid;
  target_user_id uuid := '8c6f16a9-21d9-4137-8c7e-b692da9a208f';
BEGIN
  SELECT id INTO web_dev_course_id FROM courses WHERE title = 'Complete Web Development Bootcamp' LIMIT 1;
  
  IF web_dev_course_id IS NOT NULL THEN
    INSERT INTO user_courses (user_id, course_id, progress_percentage, completed_lessons, is_completed, enrolled_at, last_accessed_at)
    VALUES (target_user_id, web_dev_course_id, 40, 2, false, now() - interval '3 days', now())
    ON CONFLICT (user_id, course_id) DO UPDATE SET
      progress_percentage = EXCLUDED.progress_percentage,
      completed_lessons = EXCLUDED.completed_lessons,
      last_accessed_at = EXCLUDED.last_accessed_at;
  END IF;
END $$;

-- Insert learning sessions for the past week
INSERT INTO learning_sessions (user_id, course_id, session_type, duration_minutes, problems_solved, xp_earned, session_date, created_at)
SELECT 
  '8c6f16a9-21d9-4137-8c7e-b692da9a208f',
  (SELECT id FROM courses WHERE title = 'Complete Web Development Bootcamp' LIMIT 1),
  'study',
  CASE 
    WHEN generate_series = 0 THEN 60 -- Today: 1 hour
    WHEN generate_series = 1 THEN 45 -- Yesterday: 45 min
    WHEN generate_series = 2 THEN 30 -- 2 days ago: 30 min
    ELSE 0
  END,
  CASE 
    WHEN generate_series = 0 THEN 4 -- Today: 4 problems
    WHEN generate_series = 1 THEN 3 -- Yesterday: 3 problems
    WHEN generate_series = 2 THEN 2 -- 2 days ago: 2 problems
    ELSE 0
  END,
  CASE 
    WHEN generate_series = 0 THEN 100 -- Today: 100 XP
    WHEN generate_series = 1 THEN 75 -- Yesterday: 75 XP
    WHEN generate_series = 2 THEN 50 -- 2 days ago: 50 XP
    ELSE 0
  END,
  CURRENT_DATE - generate_series,
  now() - (generate_series || ' days')::interval
FROM generate_series(0, 6) -- Last 7 days
ON CONFLICT DO NOTHING;

-- Insert user activity for calendar
INSERT INTO user_activity (user_id, activity_date, activity_count, study_minutes, problems_solved, created_at)
SELECT 
  '8c6f16a9-21d9-4137-8c7e-b692da9a208f',
  CURRENT_DATE - generate_series,
  CASE 
    WHEN generate_series = 0 THEN 5 -- Today: 5 activities
    WHEN generate_series = 1 THEN 4 -- Yesterday: 4 activities
    WHEN generate_series = 2 THEN 3 -- 2 days ago: 3 activities
    ELSE 0
  END,
  CASE 
    WHEN generate_series = 0 THEN 60 -- Today: 1 hour
    WHEN generate_series = 1 THEN 45 -- Yesterday: 45 min
    WHEN generate_series = 2 THEN 30 -- 2 days ago: 30 min
    ELSE 0
  END,
  CASE 
    WHEN generate_series = 0 THEN 4 -- Today: 4 problems
    WHEN generate_series = 1 THEN 3 -- Yesterday: 3 problems
    WHEN generate_series = 2 THEN 2 -- 2 days ago: 2 problems
    ELSE 0
  END,
  now() - (generate_series || ' days')::interval
FROM generate_series(0, 6) -- Last 7 days
ON CONFLICT (user_id, activity_date) DO UPDATE SET
  activity_count = EXCLUDED.activity_count,
  study_minutes = EXCLUDED.study_minutes,
  problems_solved = EXCLUDED.problems_solved;

-- Insert daily goals for today
INSERT INTO daily_goals (user_id, title, description, target_value, current_value, is_completed, goal_date, created_at)
VALUES 
  ('8c6f16a9-21d9-4137-8c7e-b692da9a208f', 'Solve 5 Problems', 'Complete 5 coding problems today', 5, 4, false, CURRENT_DATE, now()),
  ('8c6f16a9-21d9-4137-8c7e-b692da9a208f', 'Study 60 Minutes', 'Spend 1 hour learning today', 60, 60, true, CURRENT_DATE, now()),
  ('8c6f16a9-21d9-4137-8c7e-b692da9a208f', 'Complete 1 Lesson', 'Finish one course lesson', 1, 1, true, CURRENT_DATE, now())
ON CONFLICT DO NOTHING;

-- Award initial achievements
DO $$
DECLARE
  target_user_id uuid := '8c6f16a9-21d9-4137-8c7e-b692da9a208f';
  target_achievement_id uuid;
BEGIN
  -- Award "First Steps" achievement
  SELECT id INTO target_achievement_id FROM achievements WHERE title = 'First Steps' LIMIT 1;
  IF target_achievement_id IS NOT NULL THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, is_earned, earned_at)
    VALUES (target_user_id, target_achievement_id, 1, true, now() - interval '3 days')
    ON CONFLICT (user_id, achievement_id) DO UPDATE SET
      progress = EXCLUDED.progress,
      is_earned = EXCLUDED.is_earned,
      earned_at = EXCLUDED.earned_at;
  END IF;

  -- Award "Problem Solver" achievement (partial progress)
  SELECT id INTO target_achievement_id FROM achievements WHERE title = 'Problem Solver' LIMIT 1;
  IF target_achievement_id IS NOT NULL THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, is_earned, earned_at)
    VALUES (target_user_id, target_achievement_id, 4, false, null)
    ON CONFLICT (user_id, achievement_id) DO UPDATE SET
      progress = EXCLUDED.progress;
  END IF;

  -- Award "Streak Starter" achievement
  SELECT id INTO target_achievement_id FROM achievements WHERE title = 'Streak Starter' LIMIT 1;
  IF target_achievement_id IS NOT NULL THEN
    INSERT INTO user_achievements (user_id, achievement_id, progress, is_earned, earned_at)
    VALUES (target_user_id, target_achievement_id, 1, true, now() - interval '1 day')
    ON CONFLICT (user_id, achievement_id) DO UPDATE SET
      progress = EXCLUDED.progress,
      is_earned = EXCLUDED.is_earned,
      earned_at = EXCLUDED.earned_at;
  END IF;

  -- Initialize other achievements with 0 progress
  INSERT INTO user_achievements (user_id, achievement_id, progress, is_earned)
  SELECT target_user_id, a.id, 0, false
  FROM achievements a
  WHERE a.id NOT IN (
    SELECT ua.achievement_id FROM user_achievements ua WHERE ua.user_id = target_user_id
  )
  ON CONFLICT DO NOTHING;
END $$;

-- Insert leaderboard entry for current user
INSERT INTO leaderboard_entries (user_id, score, rank_position, period_type, period_start, period_end, created_at)
VALUES (
  '8c6f16a9-21d9-4137-8c7e-b692da9a208f',
  250, -- Total XP as score
  1,
  'monthly',
  date_trunc('month', CURRENT_DATE),
  date_trunc('month', CURRENT_DATE) + interval '1 month' - interval '1 day',
  now()
) ON CONFLICT (user_id, period_type, period_start) DO UPDATE SET
  score = EXCLUDED.score,
  rank_position = EXCLUDED.rank_position;

-- Update course lesson progress
DO $$
DECLARE
  target_user_id uuid := '8c6f16a9-21d9-4137-8c7e-b692da9a208f';
  html_lesson_id uuid;
  css_lesson_id uuid;
BEGIN
  SELECT id INTO html_lesson_id FROM course_lessons WHERE title = 'Introduction to HTML' LIMIT 1;
  SELECT id INTO css_lesson_id FROM course_lessons WHERE title = 'CSS Fundamentals' LIMIT 1;
  
  IF html_lesson_id IS NOT NULL THEN
    INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, watch_time_minutes, completed_at, last_accessed_at)
    VALUES (target_user_id, html_lesson_id, true, 25, now() - interval '2 days', now() - interval '2 days')
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET
      is_completed = EXCLUDED.is_completed,
      watch_time_minutes = EXCLUDED.watch_time_minutes,
      completed_at = EXCLUDED.completed_at;
  END IF;
  
  IF css_lesson_id IS NOT NULL THEN
    INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, watch_time_minutes, completed_at, last_accessed_at)
    VALUES (target_user_id, css_lesson_id, true, 30, now() - interval '1 day', now() - interval '1 day')
    ON CONFLICT (user_id, lesson_id) DO UPDATE SET
      is_completed = EXCLUDED.is_completed,
      watch_time_minutes = EXCLUDED.watch_time_minutes,
      completed_at = EXCLUDED.completed_at;
  END IF;
END $$;

-- Insert quiz attempts
DO $$
DECLARE
  target_user_id uuid := '8c6f16a9-21d9-4137-8c7e-b692da9a208f';
  html_quiz_id uuid;
  css_quiz_id uuid;
BEGIN
  SELECT lq.id INTO html_quiz_id 
  FROM lesson_quizzes lq 
  JOIN course_lessons cl ON lq.lesson_id = cl.id 
  WHERE cl.title = 'Introduction to HTML' LIMIT 1;
  
  SELECT lq.id INTO css_quiz_id 
  FROM lesson_quizzes lq 
  JOIN course_lessons cl ON lq.lesson_id = cl.id 
  WHERE cl.title = 'CSS Fundamentals' LIMIT 1;
  
  IF html_quiz_id IS NOT NULL THEN
    INSERT INTO user_quiz_attempts (user_id, quiz_id, selected_answer, is_correct, points_earned, attempt_date)
    VALUES (target_user_id, html_quiz_id, 0, true, 10, now() - interval '2 days');
  END IF;
  
  IF css_quiz_id IS NOT NULL THEN
    INSERT INTO user_quiz_attempts (user_id, quiz_id, selected_answer, is_correct, points_earned, attempt_date)
    VALUES (target_user_id, css_quiz_id, 2, true, 10, now() - interval '1 day');
  END IF;
END $$;