
import React from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  isDisabled: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange, isDisabled }) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLangCode = event.target.value;
    const language = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLangCode);
    if (language) {
      onLanguageChange(language);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <label htmlFor="language-select" className="block text-sm font-medium text-gray-400 mb-2 text-center">
        Translate to:
      </label>
      <select
        id="language-select"
        value={selectedLanguage.code}
        onChange={handleSelectChange}
        disabled={isDisabled}
        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
