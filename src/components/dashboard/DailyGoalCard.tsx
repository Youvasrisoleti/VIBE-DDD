import React from 'react';
import { Target, CheckCircle, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useProgress } from '../../context/ProgressContext';
import { useUser } from '../../context/UserContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const DailyGoalCard: React.FC = () => {
  const { darkMode } = useTheme();
  const { dailyGoals, goalsLoading, completeGoal, createGoal } = useProgress();
  const { updateProgress } = useUser();

  const handleCompleteGoal = async (goalId: string) => {
    await completeGoal(goalId);
    // Award some XP for completing a goal
    await updateProgress(0, 0, 25);
  };

  const handleCreateGoal = async () => {
    const goals = [
      { title: 'Solve 5 Problems', description: 'Complete 5 coding problems', target: 5 },
      { title: 'Study 45 Minutes', description: 'Spend 45 minutes learning', target: 45 },
      { title: 'Complete 2 Lessons', description: 'Finish 2 course lessons', target: 2 },
    ];
    
    const randomGoal = goals[Math.floor(Math.random() * goals.length)];
    await createGoal(randomGoal.title, randomGoal.description, randomGoal.target);
  };

  if (goalsLoading) {
    return (
      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm flex items-center justify-center`}>
        <LoadingSpinner />
      </div>
    );
  }

  const completed = dailyGoals.filter(goal => goal.is_completed).length;
  const total = dailyGoals.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Daily Goals
        </h2>
        <div className="flex items-center space-x-2">
          <Target className="text-indigo-500" size={20} />
          <button
            onClick={handleCreateGoal}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus size={16} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {completed}/{total}
          </span>
        </div>
        
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
          {dailyGoals.map((goal) => (
            <div key={goal.id} className="flex items-center">
              <button
                onClick={() => !goal.is_completed && handleCompleteGoal(goal.id)}
                className={`flex-shrink-0 ${
                  goal.is_completed 
                    ? 'text-green-500 cursor-default' 
                    : 'text-gray-300 dark:text-gray-600 hover:text-indigo-500 cursor-pointer'
                } transition-colors`}
              >
                <CheckCircle size={18} />
              </button>
              <div className="ml-3 flex-1">
                <span className={`text-sm ${
                  goal.is_completed 
                    ? 'text-gray-600 dark:text-gray-300 line-through' 
                    : 'text-gray-900 dark:text-white font-medium'
                }`}>
                  {goal.title}
                </span>
                {goal.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {goal.description}
                  </p>
                )}
                <div className="mt-1 flex items-center">
                  <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${Math.min(100, (goal.current_value / goal.target_value) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {goal.current_value}/{goal.target_value}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {completed === total && total > 0 ? (
        <div className="mt-6 px-4 py-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={16} />
            <p className="text-sm text-green-800 dark:text-green-300">
              Awesome! You've completed all your daily goals.
            </p>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleCreateGoal}
          className="mt-6 w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
        >
          Add New Goal
        </button>
      )}
    </div>
  );
};

export default DailyGoalCard;