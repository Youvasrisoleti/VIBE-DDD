import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  points: number;
}

interface QuizComponentProps {
  quizzes: Quiz[];
  onQuizComplete?: (score: number, totalPoints: number) => void;
  onAnswerSubmit?: (quizId: string, selectedAnswer: number) => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quizzes, onQuizComplete, onAnswerSubmit }) => {
  const { darkMode } = useTheme();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: { selected: number; correct: boolean; points: number } }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuiz = quizzes[currentQuizIndex];
  const totalQuizzes = quizzes.length;

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuiz.correct_answer;
    const pointsEarned = isCorrect ? currentQuiz.points : 0;

    setAnswers(prev => ({
      ...prev,
      [currentQuizIndex]: {
        selected: selectedAnswer,
        correct: isCorrect,
        points: pointsEarned
      }
    }));

    setShowResult(true);
    onAnswerSubmit?.(currentQuiz.id, selectedAnswer);
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < totalQuizzes - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      const totalScore = Object.values(answers).filter(a => a.correct).length;
      const totalPoints = Object.values(answers).reduce((sum, a) => sum + a.points, 0);
      setQuizCompleted(true);
      onQuizComplete?.(totalScore, totalPoints);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers({});
    setQuizCompleted(false);
  };

  const getScorePercentage = () => {
    const correctAnswers = Object.values(answers).filter(a => a.correct).length;
    return Math.round((correctAnswers / totalQuizzes) * 100);
  };

  const getTotalPoints = () => {
    return Object.values(answers).reduce((sum, a) => sum + a.points, 0);
  };

  if (quizCompleted) {
    const scorePercentage = getScorePercentage();
    const totalPoints = getTotalPoints();

    return (
      <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm text-center`}>
        <div className="mb-6">
          <Award className="mx-auto h-16 w-16 text-amber-500 mb-4" />
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Quiz Completed!
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            You scored {Object.values(answers).filter(a => a.correct).length} out of {totalQuizzes} questions correctly
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {scorePercentage}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Score</div>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {totalPoints}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Points Earned</div>
          </div>
        </div>

        <button
          onClick={handleRetakeQuiz}
          className="flex items-center justify-center mx-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          <RotateCcw size={16} className="mr-2" />
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Question {currentQuizIndex + 1} of {totalQuizzes}
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentQuiz.points} points
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuizIndex + 1) / totalQuizzes) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {currentQuiz.question}
        </h4>

        <div className="space-y-3">
          {currentQuiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedAnswer === index
                  ? showResult
                    ? index === currentQuiz.correct_answer
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : showResult && index === currentQuiz.correct_answer
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : darkMode
                      ? 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 text-sm font-medium ${
                  selectedAnswer === index
                    ? showResult
                      ? index === currentQuiz.correct_answer
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-red-500 bg-red-500 text-white'
                      : 'border-indigo-500 bg-indigo-500 text-white'
                    : showResult && index === currentQuiz.correct_answer
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {showResult ? (
                    selectedAnswer === index ? (
                      index === currentQuiz.correct_answer ? <CheckCircle size={16} /> : <XCircle size={16} />
                    ) : index === currentQuiz.correct_answer ? (
                      <CheckCircle size={16} />
                    ) : (
                      String.fromCharCode(65 + index)
                    )
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className={darkMode ? 'text-white' : 'text-gray-900'}>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {showResult && (
        <div className={`p-4 rounded-lg mb-6 ${
          answers[currentQuizIndex]?.correct 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center mb-2">
            {answers[currentQuizIndex]?.correct ? (
              <CheckCircle className="text-green-600 dark:text-green-400 mr-2" size={20} />
            ) : (
              <XCircle className="text-red-600 dark:text-red-400 mr-2" size={20} />
            )}
            <span className={`font-medium ${
              answers[currentQuizIndex]?.correct 
                ? 'text-green-800 dark:text-green-300'
                : 'text-red-800 dark:text-red-300'
            }`}>
              {answers[currentQuizIndex]?.correct ? 'Correct!' : 'Incorrect'}
            </span>
          </div>
          <p className={`text-sm ${
            answers[currentQuizIndex]?.correct 
              ? 'text-green-700 dark:text-green-300'
              : 'text-red-700 dark:text-red-300'
          }`}>
            {currentQuiz.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {showResult && `+${answers[currentQuizIndex]?.points || 0} points`}
        </div>
        
        <div className="space-x-3">
          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              {currentQuizIndex < totalQuizzes - 1 ? 'Next Question' : 'Complete Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;