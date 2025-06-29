import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onComplete?: () => void;
  onProgress?: (watchTime: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onComplete, onProgress }) => {
  const { darkMode } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [watchTime, setWatchTime] = useState(0);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleRewatch = () => {
    setCurrentTime(0);
    setWatchTime(0);
    setIsPlaying(true);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    setWatchTime(prev => prev + 1);
    onProgress?.(Math.floor(watchTime / 60));
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    onComplete?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="relative aspect-video bg-black">
        <iframe
          src={videoUrl}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      <div className="p-4">
        <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span className="ml-2">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            
            <button
              onClick={handleRewatch}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <RotateCcw size={16} />
              <span className="ml-2">Rewatch</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Volume2 size={16} />
            <span>Watch time: {Math.floor(watchTime / 60)}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;