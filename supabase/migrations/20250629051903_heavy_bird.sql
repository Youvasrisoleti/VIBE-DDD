/*
  # Add Sample Data and Course System

  1. New Tables
    - `course_lessons` - Individual lessons within courses
    - `lesson_quizzes` - Quiz questions for lessons
    - `user_quiz_attempts` - User quiz attempt tracking
    - `user_lesson_progress` - User progress through lessons

  2. Sample Data
    - Learning path courses (Web Dev, AI/ML, Data Science, Mobile, DevOps)
    - Additional achievements with proper UUIDs
    - Course lessons with video content
    - Quiz questions for interactive learning

  3. Functions
    - `complete_quiz_question` - Handle quiz completion and scoring
    - `complete_lesson` - Track lesson completion and progress
*/

-- Insert learning path courses
INSERT INTO courses (id, title, description, category, thumbnail_url, total_lessons, estimated_hours, difficulty, rating, student_count) VALUES
(gen_random_uuid(), 'Complete Web Development Bootcamp', 'Master HTML, CSS, JavaScript, React, and Node.js', 'Web Development', 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600', 45, 25, 'Beginner', 4.8, 12543),
(gen_random_uuid(), 'AI & Machine Learning Fundamentals', 'Learn Python, TensorFlow, and ML algorithms', 'Machine Learning', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', 32, 18, 'Intermediate', 4.7, 8932),
(gen_random_uuid(), 'Data Science with Python', 'Complete data science workflow with Python and pandas', 'Data Science', 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600', 28, 15, 'Intermediate', 4.6, 6754),
(gen_random_uuid(), 'Mobile App Development with React Native', 'Build cross-platform mobile apps', 'Mobile Development', 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600', 22, 12, 'Intermediate', 4.5, 4321),
(gen_random_uuid(), 'DevOps and Cloud Computing', 'Master AWS, Docker, and Kubernetes', 'DevOps', 'https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=600', 35, 20, 'Advanced', 4.9, 3456);

-- Add more achievements with proper UUIDs
INSERT INTO achievements (title, description, category, icon, required_value, xp_reward) VALUES
('Welcome Aboard', 'Complete your profile setup', 'milestone', 'user-check', 1, 25),
('First Lesson', 'Complete your first lesson', 'milestone', 'play-circle', 1, 50),
('Quiz Master', 'Score 100% on your first quiz', 'quiz', 'brain', 1, 75),
('Speed Learner', 'Complete 3 lessons in one day', 'speed', 'zap', 3, 100),
('Consistent Learner', 'Study for 3 consecutive days', 'streak', 'flame', 3, 150),
('Problem Solver Pro', 'Solve 25 quiz questions correctly', 'problem', 'target', 25, 200),
('Course Explorer', 'Enroll in 3 different courses', 'exploration', 'compass', 3, 250),
('Time Warrior', 'Study for 5 hours total', 'time', 'clock', 300, 300),
('Perfectionist', 'Get 100% on 5 different quizzes', 'quiz', 'star', 5, 400),
('Marathon Learner', 'Maintain a 7-day streak', 'streak', 'flame', 7, 500);

-- Create course lessons and quizzes table
CREATE TABLE IF NOT EXISTS course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text,
  duration_minutes integer DEFAULT 0,
  lesson_order integer NOT NULL,
  is_free boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lesson_quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES course_lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  options jsonb NOT NULL, -- Array of options
  correct_answer integer NOT NULL, -- Index of correct option
  explanation text,
  points integer DEFAULT 10,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id uuid REFERENCES lesson_quizzes(id) ON DELETE CASCADE,
  selected_answer integer NOT NULL,
  is_correct boolean NOT NULL,
  points_earned integer DEFAULT 0,
  attempt_date timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES course_lessons(id) ON DELETE CASCADE,
  is_completed boolean DEFAULT false,
  watch_time_minutes integer DEFAULT 0,
  quiz_score integer DEFAULT 0,
  completed_at timestamptz,
  last_accessed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS for new tables
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Add policies for new tables
CREATE POLICY "Anyone can view course lessons" ON course_lessons
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view lesson quizzes" ON lesson_quizzes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own quiz attempts" ON user_quiz_attempts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own lesson progress" ON user_lesson_progress
  FOR ALL USING (auth.uid() = user_id);

-- Insert sample lessons for Web Development course (using subquery to get course ID)
DO $$
DECLARE
  web_dev_course_id uuid;
BEGIN
  -- Get the Web Development course ID
  SELECT id INTO web_dev_course_id FROM courses WHERE title = 'Complete Web Development Bootcamp' LIMIT 1;
  
  IF web_dev_course_id IS NOT NULL THEN
    INSERT INTO course_lessons (course_id, title, description, video_url, duration_minutes, lesson_order, is_free) VALUES
    (web_dev_course_id, 'Introduction to HTML', 'Learn the basics of HTML structure and elements', 'https://www.youtube.com/embed/UB1O30fR-EE', 25, 1, true),
    (web_dev_course_id, 'CSS Fundamentals', 'Master CSS styling and layout techniques', 'https://www.youtube.com/embed/yfoY53QXEnI', 30, 2, true),
    (web_dev_course_id, 'JavaScript Basics', 'Introduction to JavaScript programming', 'https://www.youtube.com/embed/PkZNo7MFNFg', 35, 3, false),
    (web_dev_course_id, 'DOM Manipulation', 'Learn to interact with HTML elements using JavaScript', 'https://www.youtube.com/embed/5fb2aPlgoys', 40, 4, false),
    (web_dev_course_id, 'React Introduction', 'Getting started with React framework', 'https://www.youtube.com/embed/Tn6-PIqc4UM', 45, 5, false);
  END IF;
END $$;

-- Insert sample quizzes for lessons
DO $$
DECLARE
  html_lesson_id uuid;
  css_lesson_id uuid;
  js_lesson_id uuid;
BEGIN
  -- Get lesson IDs
  SELECT id INTO html_lesson_id FROM course_lessons WHERE title = 'Introduction to HTML' LIMIT 1;
  SELECT id INTO css_lesson_id FROM course_lessons WHERE title = 'CSS Fundamentals' LIMIT 1;
  SELECT id INTO js_lesson_id FROM course_lessons WHERE title = 'JavaScript Basics' LIMIT 1;
  
  -- Insert quizzes
  IF html_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_quizzes (lesson_id, question, options, correct_answer, explanation, points) VALUES
    (html_lesson_id, 'What does HTML stand for?', '["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"]'::jsonb, 0, 'HTML stands for HyperText Markup Language, which is the standard markup language for creating web pages.', 10);
  END IF;
  
  IF css_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_quizzes (lesson_id, question, options, correct_answer, explanation, points) VALUES
    (css_lesson_id, 'Which CSS property is used to change the text color?', '["font-color", "text-color", "color", "foreground-color"]'::jsonb, 2, 'The "color" property is used to set the color of text in CSS.', 10);
  END IF;
  
  IF js_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_quizzes (lesson_id, question, options, correct_answer, explanation, points) VALUES
    (js_lesson_id, 'Which of the following is NOT a JavaScript data type?', '["string", "boolean", "integer", "undefined"]'::jsonb, 2, 'JavaScript has number type, not specifically integer. The primitive types are string, number, boolean, undefined, null, symbol, and bigint.', 10);
  END IF;
END $$;

-- Function to update user progress with quiz completion
CREATE OR REPLACE FUNCTION complete_quiz_question(
  p_user_id uuid,
  p_quiz_id uuid,
  p_selected_answer integer
)
RETURNS json AS $$
DECLARE
  v_quiz lesson_quizzes%ROWTYPE;
  v_is_correct boolean;
  v_points_earned integer := 0;
  v_lesson_id uuid;
BEGIN
  -- Get quiz details
  SELECT * INTO v_quiz FROM lesson_quizzes WHERE id = p_quiz_id;
  
  -- Check if answer is correct
  v_is_correct := (p_selected_answer = v_quiz.correct_answer);
  
  IF v_is_correct THEN
    v_points_earned := v_quiz.points;
  END IF;
  
  -- Record the attempt
  INSERT INTO user_quiz_attempts (user_id, quiz_id, selected_answer, is_correct, points_earned)
  VALUES (p_user_id, p_quiz_id, p_selected_answer, v_is_correct, v_points_earned);
  
  -- Update user progress
  PERFORM update_user_progress(p_user_id, 1, 0, v_points_earned);
  
  -- Update activity for today
  INSERT INTO user_activity (user_id, activity_date, activity_count, study_minutes, problems_solved)
  VALUES (p_user_id, CURRENT_DATE, 1, 0, 1)
  ON CONFLICT (user_id, activity_date)
  DO UPDATE SET
    activity_count = user_activity.activity_count + 1,
    problems_solved = user_activity.problems_solved + 1;
  
  RETURN json_build_object(
    'correct', v_is_correct,
    'points_earned', v_points_earned,
    'explanation', v_quiz.explanation
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete a lesson
CREATE OR REPLACE FUNCTION complete_lesson(
  p_user_id uuid,
  p_lesson_id uuid,
  p_watch_time_minutes integer DEFAULT 0
)
RETURNS json AS $$
DECLARE
  v_lesson course_lessons%ROWTYPE;
  v_course_id uuid;
  v_xp_earned integer := 50; -- Base XP for completing a lesson
BEGIN
  -- Get lesson details
  SELECT * INTO v_lesson FROM course_lessons WHERE id = p_lesson_id;
  v_course_id := v_lesson.course_id;
  
  -- Update or insert lesson progress
  INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, watch_time_minutes, completed_at)
  VALUES (p_user_id, p_lesson_id, true, p_watch_time_minutes, now())
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET
    is_completed = true,
    watch_time_minutes = GREATEST(user_lesson_progress.watch_time_minutes, p_watch_time_minutes),
    completed_at = COALESCE(user_lesson_progress.completed_at, now()),
    last_accessed_at = now();
  
  -- Update course progress
  WITH course_progress AS (
    SELECT 
      COUNT(*) as total_lessons,
      COUNT(CASE WHEN ulp.is_completed THEN 1 END) as completed_lessons
    FROM course_lessons cl
    LEFT JOIN user_lesson_progress ulp ON cl.id = ulp.lesson_id AND ulp.user_id = p_user_id
    WHERE cl.course_id = v_course_id
  )
  UPDATE user_courses SET
    completed_lessons = cp.completed_lessons,
    progress_percentage = ROUND((cp.completed_lessons::float / cp.total_lessons::float) * 100),
    is_completed = (cp.completed_lessons = cp.total_lessons),
    completed_at = CASE WHEN cp.completed_lessons = cp.total_lessons THEN now() ELSE completed_at END,
    last_accessed_at = now()
  FROM course_progress cp
  WHERE user_id = p_user_id AND course_id = v_course_id;
  
  -- Update user progress
  PERFORM update_user_progress(p_user_id, 0, p_watch_time_minutes, v_xp_earned);
  
  RETURN json_build_object('success', true, 'xp_earned', v_xp_earned);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;