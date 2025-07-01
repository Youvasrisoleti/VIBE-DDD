import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { Trophy, RotateCcw, Star, Clock, Target, Zap, Heart, Diamond, Crown, Gem, Flame, Sparkles } from 'lucide-react';

interface Card {
  id: number;
  icon: React.ReactNode;
  iconType: string;
  isFlipped: boolean;
  isMatched: boolean;
  color: string;
}

const Gamify = () => {
  const { darkMode } = useTheme();
  const { user, updateProgress } = useUser();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [bestTime, setBestTime] = useState<number | null>(null);

  // Eye-catching game icons with beautiful colors
  const gameIcons = [
    { 
      icon: <Heart size={32} />, 
      type: 'Heart', 
      color: 'from-pink-400 to-red-500',
      iconColor: 'text-white'
    },
    { 
      icon: <Diamond size={32} />, 
      type: 'Diamond', 
      color: 'from-blue-400 to-cyan-500',
      iconColor: 'text-white'
    },
    { 
      icon: <Crown size={32} />, 
      type: 'Crown', 
      color: 'from-yellow-400 to-amber-500',
      iconColor: 'text-white'
    },
    { 
      icon: <Gem size={32} />, 
      type: 'Gem', 
      color: 'from-purple-400 to-indigo-500',
      iconColor: 'text-white'
    },
    { 
      icon: <Flame size={32} />, 
      type: 'Flame', 
      color: 'from-orange-400 to-red-500',
      iconColor: 'text-white'
    },
    { 
      icon: <Sparkles size={32} />, 
      type: 'Sparkles', 
      color: 'from-emerald-400 to-teal-500',
      iconColor: 'text-white'
    },
  ];

  // Initialize game
  const initializeGame = () => {
    const shuffledIcons = [...gameIcons, ...gameIcons]
      .sort(() => Math.random() - 0.5)
      .map((iconData, index) => ({
        id: index,
        icon: React.cloneElement(iconData.icon as React.ReactElement, {
          className: iconData.iconColor
        }),
        iconType: iconData.type,
        isFlipped: false,
        isMatched: false,
        color: iconData.color,
      }));
    
    setCards(shuffledIcons);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(false);
    setGameCompleted(false);
    setStartTime(null);
    setEndTime(null);
  };

  // Start game
  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
  };

  // Reset game
  const resetGame = () => {
    initializeGame();
  };

  // Handle card click
  const handleCardClick = (cardId: number) => {
    if (!gameStarted) {
      startGame();
    }

    const card = cards[cardId];
    if (card.isFlipped || card.isMatched || flippedCards.length === 2) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update cards to show flipped state
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards[firstCardId];
      const secondCard = cards[secondCardId];

      // Compare by iconType for accurate matching
      if (firstCard.iconType === secondCard.iconType) {
        // Match found - keep cards visible and mark as matched
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstCardId || c.id === secondCardId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match - flip cards back after delay
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(c =>
              c.id === firstCardId || c.id === secondCardId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Check for game completion
  useEffect(() => {
    if (matches === gameIcons.length && gameStarted && !gameCompleted) {
      setGameCompleted(true);
      setEndTime(Date.now());
      
      // Award XP for completing the game
      updateProgress(0, 0, 50);
      
      // Update best scores
      const currentTime = startTime ? Date.now() - startTime : 0;
      if (!bestScore || moves < bestScore) {
        setBestScore(moves);
        localStorage.setItem('matchPairsBestScore', moves.toString());
      }
      if (!bestTime || currentTime < bestTime) {
        setBestTime(currentTime);
        localStorage.setItem('matchPairsBestTime', currentTime.toString());
      }
    }
  }, [matches, gameStarted, gameCompleted, moves, startTime, bestScore, bestTime, updateProgress]);

  // Load best scores from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('matchPairsBestScore');
    const savedBestTime = localStorage.getItem('matchPairsBestTime');
    
    if (savedBestScore) setBestScore(parseInt(savedBestScore));
    if (savedBestTime) setBestTime(parseInt(savedBestTime));
  }, []);

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentTime = () => {
    if (!startTime) return 0;
    return gameCompleted ? (endTime! - startTime) : (Date.now() - startTime);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
            🎮 Match the Pairs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Flip cards to reveal hidden icons and match pairs. Make as few moves as possible!
          </p>
        </div>
        
        <button
          onClick={resetGame}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <RotateCcw size={18} className="mr-2" />
          New Game
        </button>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border border-gray-200 dark:border-gray-700 text-center transform hover:scale-105 transition-all duration-300`}>
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full">
              <Target className="text-white" size={20} />
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Moves</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {moves}
          </div>
        </div>

        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border border-gray-200 dark:border-gray-700 text-center transform hover:scale-105 transition-all duration-300`}>
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
              <Trophy className="text-white" size={20} />
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Matches</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {matches}/{gameIcons.length}
          </div>
        </div>

        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border border-gray-200 dark:border-gray-700 text-center transform hover:scale-105 transition-all duration-300`}>
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
              <Clock className="text-white" size={20} />
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Time</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatTime(getCurrentTime())}
          </div>
        </div>

        <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border border-gray-200 dark:border-gray-700 text-center transform hover:scale-105 transition-all duration-300`}>
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full">
              <Star className="text-white" size={20} />
            </div>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Best Score</div>
          <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {bestScore || '-'}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border border-gray-200 dark:border-gray-700`}>
        <div className="grid grid-cols-4 gap-6 max-w-lg mx-auto">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched}
              className={`aspect-square rounded-2xl border-3 transition-all duration-500 transform hover:scale-110 active:scale-95 shadow-lg ${
                card.isFlipped || card.isMatched
                  ? card.isMatched
                    ? `bg-gradient-to-br ${card.color} border-white shadow-2xl ring-4 ring-green-300 dark:ring-green-600`
                    : `bg-gradient-to-br ${card.color} border-white shadow-2xl`
                  : darkMode
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:from-gray-600 hover:to-gray-700 shadow-inner'
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 hover:from-gray-200 hover:to-gray-300 shadow-inner'
              } flex items-center justify-center relative overflow-hidden`}
            >
              {card.isFlipped || card.isMatched ? (
                <div className="relative z-10">
                  {card.icon}
                  {card.isMatched && (
                    <div className="absolute -top-1 -right-1">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} opacity-50`} />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg" />
                </div>
              )}
              
              {/* Card shine effect */}
              {!card.isFlipped && !card.isMatched && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Game Completion Modal */}
      {gameCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 text-center border border-gray-200 dark:border-gray-700`}>
            <div className="mb-6">
              <div className="relative inline-block">
                <Trophy className="mx-auto h-20 w-20 text-amber-500 mb-4" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <h2 className={`text-3xl font-bold mb-3 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent`}>
                🎉 Congratulations!
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                You completed the game in <span className="font-semibold text-indigo-600 dark:text-indigo-400">{moves} moves</span> and <span className="font-semibold text-green-600 dark:text-green-400">{formatTime(getCurrentTime())}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border border-gray-200 dark:border-gray-600`}>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {moves}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Moves</div>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border border-gray-200 dark:border-gray-600`}>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +50 XP
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Earned</div>
              </div>
            </div>

            {(bestScore === moves || bestTime === getCurrentTime()) && (
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-center text-amber-700 dark:text-amber-300">
                  <Star className="mr-2 animate-pulse" size={20} />
                  <span className="font-semibold">🏆 New Personal Best!</span>
                </div>
              </div>
            )}

            <button
              onClick={resetGame}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🎮 Play Again
            </button>
          </div>
        </div>
      )}

      {/* Best Scores */}
      {(bestScore || bestTime) && (
        <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl border border-gray-200 dark:border-gray-700`}>
          <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'} text-center`}>
            🏆 Personal Best Records
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {bestScore && (
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {bestScore}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Fewest Moves</div>
              </div>
            )}
            {bestTime && (
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {formatTime(bestTime)}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Fastest Time</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gamify;