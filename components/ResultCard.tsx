import React from 'react';
import PlayIcon from './icons/PlayIcon';

interface ResultCardProps {
  transcript: string;
  translation: string;
  targetLanguageName: string;
  onPlay: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ transcript, translation, targetLanguageName, onPlay }) => {
  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6 animate-fade-in">
      <div>
        <h3 className="font-semibold text-gray-400 text-xs sm:text-sm mb-2">Original Transcript</h3>
        <p className="text-gray-200 italic text-sm sm:text-base">"{transcript}"</p>
      </div>
      <div className="border-t border-gray-700"></div>
      <div>
        <h3 className="font-semibold text-gray-400 text-xs sm:text-sm mb-2">Translation ({targetLanguageName})</h3>
        <div className="flex items-center justify-between space-x-4">
          <p className="text-lg sm:text-xl text-cyan-300 flex-grow">{translation}</p>
          <button
            onClick={onPlay}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-transform duration-200 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Play translation"
          >
            <PlayIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;