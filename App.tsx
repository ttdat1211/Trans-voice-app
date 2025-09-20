import React, { useState, useCallback, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES } from './types';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { transcribeAndTranslate } from './services/geminiService';
import { speak } from './services/speechService';
import LanguageSelector from './components/LanguageSelector';
import RecordButton from './components/RecordButton';
import ResultCard from './components/ResultCard';
import Loader from './components/Loader';

export default function App() {
  const [targetLanguage, setTargetLanguage] = useState<Language>(SUPPORTED_LANGUAGES[0]);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  // Effect to prevent scrolling while recording on mobile
  useEffect(() => {
    if (isRecording) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isRecording]);


  const handleStartRecording = async () => {
    setError(null);
    setTranscript(null);
    setTranslation(null);
    try {
      await startRecording();
    } catch (err) {
      if (err instanceof Error) {
        setError("Microphone access was denied. Please allow microphone access in your browser settings.");
      } else {
        setError("An unknown error occurred while trying to access the microphone.");
      }
    }
  };

  const handleStopRecording = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const audioData = await stopRecording();
      if (audioData) {
        const result = await transcribeAndTranslate(audioData.blob, audioData.mimeType, targetLanguage.name);
        setTranscript(result.transcript);
        setTranslation(result.translation);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`Translation failed: ${err.message}. Please check your Gemini API key and try again.`);
      } else {
        setError("An unknown error occurred during translation.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [stopRecording, targetLanguage.name]);

  const handlePlayTranslation = useCallback(() => {
    if (translation) {
      speak(translation, targetLanguage.code);
    }
  }, [translation, targetLanguage.code]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-start sm:justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center space-y-6 md:space-y-8 mt-8 sm:mt-0">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Gemini Live Translator
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Record, translate, and listen in real-time.</p>
        </header>

        <main className="w-full flex flex-col items-center space-y-6">
          <LanguageSelector
            selectedLanguage={targetLanguage}
            onLanguageChange={setTargetLanguage}
            isDisabled={isRecording || isLoading}
          />

          <RecordButton
            isRecording={isRecording}
            isLoading={isLoading}
            onStart={handleStartRecording}
            onStop={handleStopRecording}
          />

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 sm:p-4 rounded-lg w-full text-center text-sm">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {isLoading && <Loader />}

          {!isLoading && translation && transcript && (
            <ResultCard
              transcript={transcript}
              translation={translation}
              targetLanguageName={targetLanguage.name}
              onPlay={handlePlayTranslation}
            />
          )}
        </main>
        
        <footer className="text-center text-gray-500 text-xs sm:text-sm pt-4">
            <p>Powered by Google Gemini & Browser Speech API</p>
        </footer>
      </div>
    </div>
  );
}