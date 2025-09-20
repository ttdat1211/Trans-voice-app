import React from 'react';
import MicrophoneIcon from './icons/MicrophoneIcon';
import StopIcon from './icons/StopIcon';

interface RecordButtonProps {
  isRecording: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
}

const RecordButton: React.FC<RecordButtonProps> = ({ isRecording, isLoading, onStart, onStop }) => {
  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  const buttonClasses = `
    relative flex items-center justify-center w-24 h-24 rounded-full shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 active:scale-95
    ${isRecording ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500/50 animate-pulse-strong' : 'bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-400/50'}
    ${isLoading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
  `;

  return (
    <div className="flex flex-col items-center space-y-3">
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={buttonClasses}
            aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
            {isRecording ? <StopIcon /> : <MicrophoneIcon />}
        </button>
        <p className="text-gray-400 text-sm">
            {isLoading ? 'Processing...' : (isRecording ? 'Recording...' : 'Tap to record')}
        </p>
    </div>

  );
};

export default RecordButton;